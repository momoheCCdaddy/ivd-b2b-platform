import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "src", "data", "leadingmed-products.generated.json");
const USER_AGENT = "CobioerCatalogIndexer/1.0 (+sales@cobioer.com)";
const CN_BASE = "https://www.leadingmed.cn";
const EN_BASE = "https://en.leadingmed.cn";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const decode = value => String(value || "")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
const text = html => decode(String(html || "").replace(/<br\s*\/?>/gi, " ").replace(/<\/p>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

async function fetchText(url, init = {}, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, headers: { "User-Agent": USER_AGENT, ...init.headers }, signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      return await response.text();
    } catch (error) {
      if (attempt === retries) throw error;
      await sleep(500 * (attempt + 1));
    }
  }
}

function extractConfig(html) {
  const candidates = [];
  for (const match of html.matchAll(/name=["']_config["']\s+value=["']([^"']+)["']/g)) {
    try {
      const config = JSON.parse(decode(match[1]));
      if (config?.api?.includes("/product/product/es/findPage")) candidates.push(config);
    } catch { /* Ignore unrelated or malformed component settings. */ }
  }
  return candidates.find(config => config.params?._detailId) || candidates.find(config => /产品.*产品列表|product.*list/i.test(config.cname || "")) || candidates[0] || null;
}

async function fetchListing(pageUrl) {
  const html = await fetchText(pageUrl);
  const config = extractConfig(html);
  if (!config?.api || !config?.params) return { html, items: [] };
  const params = { ...config.params, size: 200, from: 0 };
  const apiUrl = new URL(config.api, pageUrl);
  const payload = await fetchText(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8", Referer: pageUrl, ...(params.header || {}) },
    body: JSON.stringify(params),
  });
  const parsed = JSON.parse(payload);
  return { html, items: parsed?.data?.list || [] };
}

async function fetchAllListings() {
  const chinese = await fetchListing(`${CN_BASE}/product.html`);
  const isDetail = item => /^\/(?:product_xq\/|product\/\d+\.html)/.test(item.href || item.hrefObject?.value || "");
  const cnItems = chinese.items.filter(isDetail);

  const seed = await fetchText(`${EN_BASE}/product/7/`);
  const categoryPaths = [...new Set([...seed.matchAll(/href=["'](\/product\/\d+\/)["']/g)].map(match => match[1]))];
  const english = [];
  for (const categoryPath of categoryPaths) {
    try {
      const listing = await fetchListing(new URL(categoryPath, EN_BASE).href);
      english.push(...listing.items.filter(isDetail));
    } catch (error) {
      console.warn(`Skipped English category ${categoryPath}: ${error.message}`);
    }
    await sleep(120);
  }
  const unique = items => [...new Map(items.map(item => [item.href || item.hrefObject?.value, item])).values()];
  return { cn: unique(cnItems), en: unique(english) };
}

function extractSkuRows(html) {
  const results = [];
  for (const tableMatch of html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    const rows = [...tableMatch[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(row =>
      [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(cell => text(cell[1]))
    ).filter(row => row.length);
    const headerIndex = rows.findIndex(row => row.some(cell => /货号|catalog\s*(?:no|number|id)|cat\.?\s*no/i.test(cell)) && row.some(cell => /产品名称|product\s*name/i.test(cell)));
    if (headerIndex < 0) continue;
    const header = rows[headerIndex];
    const indexOf = pattern => header.findIndex(cell => pattern.test(cell));
    const indexes = {
      name: indexOf(/产品名称|product\s*name/i),
      code: indexOf(/货号|catalog\s*(?:no|number|id)|cat\.?\s*no/i),
      type: indexOf(/类型|type/i),
      application: indexOf(/应用|application/i),
      note: indexOf(/备注|remark|note/i),
    };
    for (const row of rows.slice(headerIndex + 1)) {
      const shift = Math.max(0, header.length - row.length);
      const get = index => index < 0 ? "" : row[Math.max(0, index - shift)] || "";
      const code = get(indexes.code).replace(/\s+/g, "").replace(/[，；]/g, ",");
      if (!/^LD[0-9A-Za-z()α-ωΑ-Ω-]+$/u.test(code) || code.length > 80) continue;
      const name = get(indexes.name);
      if (!name || /产品名称|product\s*name/i.test(name)) continue;
      results.push({ code, name, type: get(indexes.type), application: get(indexes.application), note: get(indexes.note) });
    }
  }
  return results;
}

async function mapConcurrent(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      try { results[index] = await mapper(items[index], index); }
      catch (error) { results[index] = { item: items[index], rows: [], error: error.message }; }
      await sleep(100);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function enrich(items, base) {
  return mapConcurrent(items, 4, async item => {
    const href = item.href || item.hrefObject?.value;
    const html = await fetchText(new URL(href, base));
    return { item, href, rows: extractSkuRows(html) };
  });
}

const CATEGORY_INFO = {
  "抗原/抗体": ["antigens-antibodies", "抗原/抗体", "Antigens & Antibodies", "诊断用蛋白原料和抗体", "Diagnostic protein raw materials and antibodies"],
  "微球": ["microspheres", "微球", "Microspheres", "免疫检测与层析用微球", "Microspheres for immunoassay and chromatography"],
  "糖化血红蛋白质控品": ["quality-controls", "质控品", "Quality Controls", "体外诊断质量控制材料", "Quality-control materials for in vitro diagnostics"],
  "生化试剂": ["biochemical-reagents", "生化试剂", "Biochemical Reagents", "生化和免疫检测用试剂", "Reagents for biochemical and immunoassay platforms"],
  "层析试剂": ["chromatography-reagents", "层析试剂", "Chromatography Reagents", "POCT层析平台试剂", "Reagents for POCT chromatography platforms"],
  "仪器": ["instruments", "仪器", "Instruments", "体外诊断配套仪器", "Instruments supporting in vitro diagnostics"],
};
const FALLBACK_CATEGORY = ["ivd-solutions", "IVD解决方案", "IVD Solutions", "立顶医疗体外诊断解决方案", "LeadingMed in vitro diagnostic solutions"];

const ENGLISH_TERMS = [
  ["中性粒细胞明胶酶相关载脂蛋白", "neutrophil gelatinase-associated lipocalin"],
  ["脂蛋白相关磷脂酶A2", "lipoprotein-associated phospholipase A2"],
  ["纤维蛋白（原）降解产物", "fibrin(ogen) degradation products"],
  ["纤维蛋白(原)降解产物", "fibrin(ogen) degradation products"],
  ["血管紧张素转化酶", "angiotensin-converting enzyme"],
  ["抗链球菌溶血素O", "anti-streptolysin O"],
  ["抗链球菌溶血素0", "anti-streptolysin O"],
  ["抗环瓜氨酸肽抗体", "anti-cyclic citrullinated peptide antibody"],
  ["高密度脂蛋白胆固醇", "high-density lipoprotein cholesterol"],
  ["低密度脂蛋白胆固醇", "low-density lipoprotein cholesterol"],
  ["血清淀粉样蛋白A", "serum amyloid A"],
  ["血清淀粉样蛋白", "serum amyloid A"],
  ["糖化血红蛋白", "glycated hemoglobin"],
  ["视黄醇结合蛋白", "retinol-binding protein"],
  ["肝素结合蛋白", "heparin-binding protein"],
  ["C反应蛋白", "C-reactive protein"],
  ["降钙素原", "procalcitonin"],
  ["胃蛋白酶原II", "pepsinogen II"],
  ["胃蛋白酶原I", "pepsinogen I"],
  ["人载脂蛋白A1", "human apolipoprotein A1"],
  ["人载脂蛋白B", "human apolipoprotein B"],
  ["载脂蛋白A1", "apolipoprotein A1"],
  ["载脂蛋白B", "apolipoprotein B"],
  ["肌酸激酶同工酶", "creatine kinase-MB"],
  ["中性粒细胞", "neutrophil"],
  ["微球蛋白", "microglobulin"],
  ["类风湿因子", "rheumatoid factor"],
  ["Ⅳ型胶原蛋白", "type IV collagen"],
  ["D-二聚体", "D-dimer"],
  ["补体C1q", "complement C1q"],
  ["胱抑素C", "cystatin C"],
  ["糖化白蛋白", "glycated albumin"],
  ["前白蛋白", "prealbumin"],
  ["脂蛋白a", "lipoprotein(a)"],
  ["脂联素", "adiponectin"],
  ["白蛋白", "albumin"],
  ["铁蛋白", "ferritin"],
  ["肌酐", "creatinine"],
  ["微球", "microsphere"],
  ["白色乳胶", "white latex"],
  ["红色乳胶", "red latex"],
  ["紫色乳胶", "purple latex"],
  ["时间分辨荧光", "time-resolved fluorescent"],
  ["鼠抗人", "mouse anti-human "],
  ["羊抗人", "goat anti-human "],
  ["羊抗鼠", "goat anti-mouse "],
  ["兔抗人", "rabbit anti-human "],
  ["单克隆抗体", " monoclonal antibody "],
  ["多克隆抗体", " polyclonal antibody "],
  ["单抗寡聚体", " monoclonal antibody oligomer "],
  ["校准质控原料", "calibration and QC material"],
  ["校准品", " calibrator"],
  ["质控品", " quality control"],
  ["抗原稀释液", " antigen diluent"],
  ["抗原", " antigen"],
  ["抗血清", " antiserum"],
  ["稀释液", " diluent"],
  ["OEM试剂", " OEM reagent"],
  ["高值", " high level"],
  ["低值", " low level"],
  ["(血清)", "serum "],
  ["(尿)", "urine "],
  ["（ACE）", " (ACE)"], ["（APOA1）", " (APOA1)"], ["（APOB）", " (APOB)"],
  ["（C1q）", " (C1q)"], ["（COL-IV）", " (COL-IV)"], ["（Cr）", " (Cr)"],
  ["（HDL）", " (HDL)"], ["（LDL）", " (LDL)"], ["（HBP）", " (HBP)"], ["（Ferritin）", " (Ferritin)"],
];

function translateToEnglish(value, fallback) {
  let translated = String(value || "").replace(/[☆★]/g, "").trim();
  for (const [source, target] of ENGLISH_TERMS) translated = translated.split(source).join(target);
  translated = translated.replace(/\s+/g, " ").replace(/\s+([),])/g, "$1").replace(/\(\s+/g, "(").trim();
  return translated && !/\p{Script=Han}/u.test(translated) ? translated.replace(/^./, character => character.toUpperCase()) : fallback;
}

function categoryInfo(item = {}, row = {}) {
  const trail = [item.categoryName, ...(Array.isArray(item.category) ? item.category.map(category => category?.name) : [])].filter(Boolean).join("->");
  for (const [label, info] of Object.entries(CATEGORY_INFO)) if (trail.includes(label)) return info;
  const type = `${row.type || ""} ${row.name || ""}`;
  if (/抗体|抗原|antibody|antigen/i.test(type)) return CATEGORY_INFO["抗原/抗体"];
  if (/质控|校准|血清|血浆|control|calibrat|serum|plasma/i.test(type)) return CATEGORY_INFO["糖化血红蛋白质控品"];
  if (/质控|quality\s*control/i.test(trail)) return CATEGORY_INFO["糖化血红蛋白质控品"];
  if (/层析|chromatography/i.test(trail)) return CATEGORY_INFO["层析试剂"];
  return FALLBACK_CATEGORY;
}

function createCatalog(cnPages, enPages) {
  const enByCode = new Map();
  for (const page of enPages) for (const row of page.rows) enByCode.set(row.code.toLowerCase(), { ...row, pageTitle: page.item.title, href: page.href });
  const groups = new Map();
  const seen = new Set();
  const add = (row, page, language) => {
    const key = row.code.toLowerCase();
    if (seen.has(key)) return;
    const english = language === "en" ? { ...row, pageTitle: page.item.title, href: page.href } : enByCode.get(key);
    const chinese = language === "zh" ? row : null;
    const category = categoryInfo(page.item, row);
    const sourceUrl = new URL(page.href, language === "zh" ? CN_BASE : EN_BASE).href;
    const name = chinese?.name || english?.name || row.name;
    const nameEn = english?.name || translateToEnglish(name, row.code);
    const application = chinese?.application || "体外诊断";
    const applicationEn = english?.application || "In vitro diagnostics";
    const type = chinese?.type || "IVD产品";
    const typeEn = english?.type || translateToEnglish(type, "IVD product");
    const product = {
      id: row.code,
      name,
      nameEn,
      description: `${page.item.title || "立顶医疗"}产品。类型：${type}；应用：${application}。`,
      descriptionEn: `${english?.pageTitle || "LeadingMed diagnostic product"}. Type: ${typeEn}; application: ${applicationEn}.`,
      tags: ["立顶医疗", category[1], type].filter(Boolean),
      tagsEn: ["LeadingMed", category[2], typeEn].filter(Boolean),
      applications: [application].filter(Boolean),
      applicationsEn: [applicationEn].filter(Boolean),
      specs: type,
      status: "Available by inquiry",
      source: sourceUrl,
      note: "产品信息来自立顶医疗官方公开目录。具体规格、批次和供应状态以销售确认为准。",
      listPrice: "询价"
    };
    if (!groups.has(category[0])) groups.set(category[0], { info: category, products: [] });
    groups.get(category[0]).products.push(product);
    seen.add(key);
  };
  for (const page of cnPages) for (const row of page.rows) add(row, page, "zh");
  for (const page of enPages) for (const row of page.rows) add(row, page, "en");
  return [...groups.values()].map(({ info, products }) => ({
    id: info[0], name: info[1], nameEn: info[2], description: info[3], descriptionEn: info[4],
    applications: ["体外诊断"], applicationsEn: ["In vitro diagnostics"],
    products: products.sort((a, b) => a.id.localeCompare(b.id, "en")),
  })).sort((a, b) => a.id.localeCompare(b.id));
}

async function main() {
  console.log("Fetching official LeadingMed listings …");
  const listings = await fetchAllListings();
  console.log(`Official pages: zh=${listings.cn.length}, en=${listings.en.length}`);
  console.log(`Chinese source categories: ${[...new Set(listings.cn.map(item => item.categoryName || "Uncategorized"))].sort().join(" | ")}`);
  const [cnPages, enPages] = await Promise.all([enrich(listings.cn, CN_BASE), enrich(listings.en, EN_BASE)]);
  const sourceTypes = [...cnPages, ...enPages].flatMap(page => page.rows.map(row => row.type || "Unspecified"));
  const typeCounts = [...sourceTypes.reduce((map, type) => map.set(type, (map.get(type) || 0) + 1), new Map())].sort((a, b) => b[1] - a[1]);
  console.log(`Source product types: ${typeCounts.slice(0, 20).map(([type, count]) => `${type}=${count}`).join(" | ")}`);
  const items = createCatalog(cnPages, enPages);
  const productCount = items.reduce((total, item) => total + item.products.length, 0);
  const payload = {
    source: ["https://www.leadingmed.cn/product.html", "https://en.leadingmed.cn/product/7/"],
    generatedAt: new Date().toISOString(),
    sourcePages: { zh: listings.cn.length, en: listings.en.length },
    productCount,
    items,
  };
  console.log(`Extracted official catalog SKUs: ${productCount} across ${items.length} categories`);
  for (const item of items) console.log(`  ${item.id}: ${item.products.length}`);
  if (process.argv.includes("--write")) {
    await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`Wrote ${path.relative(ROOT, OUTPUT)}`);
  } else {
    console.log("Dry run only. Re-run with --write to update the generated catalog.");
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
