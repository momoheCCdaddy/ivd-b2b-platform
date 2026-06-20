# Codex 完整修复与重建指令

## 项目路径
`C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\generated-site`

## 技术栈
- Next.js 14 (App Router, static export)
- TypeScript + Tailwind CSS
- i18n: 自定义 `src/lib/i18n.tsx` (localStorage, zh/en)
- 数据层: `src/data/*.ts` (纯 TS 对象，无数据库)

## ⚠️ 关键前置步骤

### 真实产品数据源
完整的 3028 个产品数据已导出为 JSON 文件：
**`C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\cobioer-products-all.json`**

**你必须在 Codex 中执行以下步骤之一来获取真实数据：**

**方案A（推荐）**：编写一个 Python 脚本，读取该 JSON 文件，将 10 个 Sheet 的所有产品数据转换为 `src/data/products.ts` 格式的 TypeScript 代码，输出到指定路径。

**方案B**：直接在 Codex 中引用 JSON，运行时通过 `fetch('/data/cobioer-products-all.json')` 加载。

数据文件结构（JSON）：
```json
{
  "researchCells": [{ "id": "CBP60002", "name": "CNE1", "nameCn": "人鼻咽癌细胞", "strStatus": "已验证", "source": "ATCC", "mediumInternal": "RPMI-1640+10%FBS", "price2026": "新货" }],
  "gpcr": [{ "id": "CBP71555", "name": "5-HTR2A HEK293", "classLevel2": "Class A（Rhodopsin）", "classLevel3": "5-HTR", "application": "Functional assay for 5-HTR2A Receptor", "assayFormat": "HTRF IP-One Assay", "transducer": "Gq", "medium": "DMEM+10%FBS+2μg/ml Puromycin", "listPrice": 86000, "dailyPrice": 39130, "status": "现货" }],
  "kinase": [{ "id": "CBP73295", "name": "AKT1 WT/BaF3", "classLevel2": "AKT", "application": "Cell-based Kinase Assay", "assayFormat": "Anti-proliferation Assay", "dailyPrice": 19800, "listPrice": 40000 }],
  "immunotherapy": [{ "id": "CBP74002", "name": "ADCC Bioassay Effector Cell F variant (Low Affinity)-Fcγ-NFAT/Jurkat", "classLevel2": "Fc Effector", "assayApplication": "Functional(Report Gene) Assay", "dailyPrice": 50000, "listPrice": 100000 }],
  "taa": [{ "id": "CBPG0139", "name": "h5T4/CT26", "classLevel2": "5T4", "parentCellName": "4T1", "parentCellId": "CBP60352", "dailyPrice": 15000, "listPrice": 30000 }],
  "tracer": [{ "id": "CBP-Luc-001", "name": "Luciferase/T84", "tissue": "结肠癌/肺转移", "species": "人" }],
  "drugResistant": [{ "id": "CBP60341DR", "name": "22RV1/DR", "drug": "Docetaxel", "gi50": "耐药株420nM, 22RV1 4.06nM", "resistanceRatio": 100, "price": 15000 }],
  "signalPathway": [{ "id": "CBPB0011", "name": "ARE-Luc(Nrf2 Antioxidant Pathway)/HEK293", "dailyPrice": 21000, "listPrice": 30000 }],
  "nuclearReceptor": [{}],
  "otherStable": [{ "id": "...", "name": "...", "classLevel2": "BCL2" }]
}
```

**完整产品数量统计**：
| 分类 | 数据行 |
|------|-------|
| 科研细胞（Research Cells） | 1439 |
| GPCR稳定细胞株 | 262 |
| Kinase激酶细胞株 | 243 |
| 免疫治疗靶点 | 495 |
| TAA肿瘤抗原（Mouse Model） | 252 |
| 示踪细胞（Luciferase/GFP/RFP） | 185 |
| 耐药细胞株 | 39 |
| 信号通路细胞 | 22 |
| 核受体细胞株 | 22 |
| 其他稳定株 | 63 |
| **总计** | **3028** |

详细的产品分类介绍、每个分类的完整介绍文本、以及推荐的产品样本数据，请参考：
**`C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\CODEX-WEB-CONTENT.md`**（所有页面文案模板）

---

## 🔴 P0 — 产品中心必须修复（当前显示 0/0）

### 根因
`src/data/products.ts` 只有 **分类级别** 数据（约20个子分类条目），**没有具体产品条目**。筛选逻辑正确，但因数据量极少（每个分类下只有1个条目代表整个子类），搜索/筛选体验极差。

### 修复方案

#### 1. 重构 products.ts 数据模型

**新数据结构**：

```typescript
// 分类（保持现有结构）
export interface ProductCategory {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  items: ProductSubCategory[];
}

// 子分类
export interface ProductSubCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  applications: string[];
  applicationsEn: string[];
  features?: string[];
  featuresEn?: string[];
  count?: string;
  products: ProductItem[];  // ← 新增：具体产品列表
}

// 具体产品
export interface ProductItem {
  id: string;           // 货号，如 CBP71473
  name: string;         // 产品名
  nameEn: string;       // 英文名
  category: string;     // 所属子分类ID
  description: string;
  descriptionEn: string;
  tags: string[];       // 搜索标签
  tagsEn: string[];
  specs?: string;       // 规格，如 "T-25 Flask"
  parentCell?: string;  // 母细胞，如 "CHO-K1"
  cultureMedium?: string;  // 培养基
  stability?: string;   // 稳定性，如 "32 passages"
  applications: string[];
  applicationsEn: string[];
}
```

#### 2. 填充真实产品数据

**科佰生物** 共 3028 个产品、10 大分类。所有真实产品数据已导出为 JSON 文件，**你不需要手动编造数据**，请直接从 JSON 导入：

**数据文件路径**：`C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\cobioer-products-all.json`（1277 KB，3028条）

**内容文件路径**：`C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\CODEX-WEB-CONTENT.md`（产品分类介绍文案、热门产品推荐）

**数据导入步骤**：
1. 读取 `cobioer-products-all.json`
2. 按10个分类（researchCells/gpcr/kinase/immunotherapy/taa/tracer/drugResistant/signalPathway/nuclearReceptor/otherStable）分别生成 TypeScript 数据文件
3. 每个产品必须保留完整字段（货号、名称、中文名、培养基、价格等），不要省略
4. 产品分类介绍文案从 CODEX-WEB-CONTENT.md 中获取

**各分类产品数量**：
- researchCells: 1439 条（科研细胞）
- gpcr: 268 条（GPCR稳定细胞株）
- kinase: 243 条（Kinase激酶）
- immunotherapy: 495 条（免疫治疗靶点）
- taa: 252 条（TAA肿瘤抗原Mouse Model）
- tracer: 185 条（示踪细胞）
- drugResistant: 39 条（耐药细胞）
- signalPathway: 22 条（信号通路细胞）
- nuclearReceptor: 22 条（核受体）
- otherStable: 63 条（其他稳定株）

**注意**：产品数量很大（3028条），需要考虑性能优化：
- 建议将产品数据按分类拆分为多个文件
- 首页/列表页只展示摘要数据
- 产品详情页才加载完整数据
- 或使用动态导入（dynamic import）

#### 3. 修复产品中心页面（`src/app/products/page.tsx`）

**必须实现**：
- ✅ 左侧分类树（已实现，需适配新数据结构）
- ✅ 搜索框（按产品名/货号/关键词搜索）
- ✅ 分类筛选（主分类+子分类）
- 🆕 **分页**：每页 24 个产品，底部分页导航
- 🆕 **产品卡片**：显示货号、产品名、描述摘要、标签
- 🆕 **点击产品卡片 → 跳转产品详情页 `/products/[id]`**

#### 4. 新增产品详情页（`src/app/products/[id]/page.tsx`）

**必须实现**：
- 产品基本信息（货号、名称、描述）
- Background（背景介绍）
- Description（产品描述）
- Introduction（技术规格：母细胞、培养基、稳定性、支原体检测等）
- Applications（应用领域）
- 相关产品推荐（同分类产品）
- "询价" 按钮（链接到联系页面）
- 面包屑导航

---

## 🔴 P0 — 立顶医疗产品数据补全

### 立顶医疗产品体系（基于专利和公开信息）

立顶医疗是 IVD 原料+试剂一体化服务商，需要新增为独立的产品板块。

**新增分类**：

```typescript
// 在 products.ts 中新增
{
  id: 'leadingmed-raw-materials',
  title: 'IVD原料（立顶医疗）',
  titleEn: 'IVD Raw Materials (LeadingMed)',
  description: '为品牌客户提供集原料和试剂于一体的整体解决方案，涵盖高端抗原、抗体、酶、纳米微球。',
  descriptionEn: 'Integrated raw material and reagent solutions for IVD brands...',
  icon: 'Beaker',
  items: [
    {
      id: 'lm-antibodies',
      name: '配对抗体',
      nameEn: 'Paired Antibodies',
      products: [
        { id: 'LM-AB-001', name: 'CK-MB 配对单抗', nameEn: 'CK-MB Paired mAbs', ... },
        { id: 'LM-AB-002', name: 'HbA1c 单克隆抗体', nameEn: 'HbA1c mAb', ... },
        { id: 'LM-AB-003', name: '脂联素ADP单克隆抗体', nameEn: 'ADP mAb', ... },
        { id: 'LM-AB-004', name: '脂蛋白相关磷脂酶A2配对抗体', nameEn: 'Lp-PLA2 Paired mAbs', ... },
        { id: 'LM-AB-005', name: '补体C1q单克隆抗体', nameEn: 'C1q mAb', ... },
        { id: 'LM-AB-006', name: 'D-二聚体单克隆抗体', nameEn: 'D-Dimer mAb', ... },
        { id: 'LM-AB-007', name: 'HbA1c 重组IgM型抗体', nameEn: 'HbA1c Recombinant IgM', ... },
        { id: 'LM-AB-008', name: 'PGI 鼠抗人单克隆抗体', nameEn: 'PGI Anti-Human mAb', ... },
      ]
    },
    {
      id: 'lm-microspheres',
      name: '纳米微球',
      nameEn: 'Nano Microspheres',
      products: [
        { id: 'LM-MS-001', name: '包裹咔唑的聚苯乙烯微球', ... },
        { id: 'LM-MS-002', name: '中空多孔单分散羧基聚苯乙烯微球', ... },
        { id: 'LM-MS-003', name: '时间分辨荧光微球', ... },
        { id: 'LM-MS-004', name: '量子点荧光微球', ... },
        { id: 'LM-MS-005', name: 'AIPE磷光微球', ... },
        { id: 'LM-MS-006', name: '双色协同增效彩色微球', ... },
        { id: 'LM-MS-007', name: '羧基聚苯乙烯微球保存液', ... },
        { id: 'LM-MS-008', name: '表面氨基化聚苯乙烯微球', ... },
      ]
    },
    {
      id: 'lm-reagent-kits',
      name: 'OEM试剂',
      nameEn: 'OEM Reagent Kits',
      products: [
        { id: 'LM-RK-001', name: 'HbA1c 检测试剂盒', ... },
        { id: 'LM-RK-002', name: 'PSP/CRP/MxA 定量检测免疫层析试纸条', ... },
        { id: 'LM-RK-003', name: 'MxA/CRP/SAA 联合检测卡', ... },
        { id: 'LM-RK-004', name: '定量检测MxA 免疫荧光层析试纸条', ... },
        { id: 'LM-RK-005', name: '新冠病毒IgA中和抗体检测试剂盒', ... },
        { id: 'LM-RK-006', name: '肾损伤标志物检测试剂盒', ... },
      ]
    },
    {
      id: 'lm-enzymes',
      name: '诊断酶',
      nameEn: 'Diagnostic Enzymes',
      products: [
        { id: 'LM-EZ-001', name: '果糖氨基酸氧化酶（酶法HbA1c）', ... },
      ]
    }
  ]
}
```

**立顶医疗关键信息**（用于页面内容）：
- 公司全称：南京立顶医疗科技有限公司
- 成立时间：2019年5月
- 地址：南京市栖霞区
- 法定代表人：张玉基
- 注册资本：1391.67万元
- 高新技术企业（2024年认定，GR202432004277）
- 2023年12月新四板成长版挂牌
- 46项专利、9条商标
- 参保46人
- 技术平台：生化免疫、特定蛋白、POCT层析、ELISA
- 核心能力：IVD原料（抗原/抗体/酶/微球）+ OEM试剂 + CDMO
- 6000m²研发中心 + 10000m² CDMO基地
- 战略合作：德大医械（2023年8月）

---

## 🟡 P1 — i18n 完整化

### 当前状态
- 导航翻译已完成（zh.json / en.json）
- 产品描述硬编码中文
- 首页标题已翻译

### 修复方案

#### 1. 产品数据内置双语
已在上面数据模型中加入 `nameEn` / `descriptionEn` / `applicationsEn` 等字段。

#### 2. 页面组件使用双语数据
```tsx
const { lang } = useI18n();
// 使用 lang === 'en' ? product.nameEn : product.name
```

#### 3. 补全翻译文件
在 zh.json 和 en.json 中补全以下翻译键：

```json
{
  "products.detail.background": "背景介绍",
  "products.detail.description": "产品描述", 
  "products.detail.introduction": "技术规格",
  "products.detail.applications": "应用领域",
  "products.detail.related": "相关产品",
  "products.detail.inquiry": "询价",
  "products.detail.parentCell": "母细胞",
  "products.detail.cultureMedium": "培养基",
  "products.detail.stability": "稳定性",
  "products.detail.mycoplasma": "支原体检测",
  "products.detail.storage": "储存条件",
  "products.detail.freezeMedium": "冻存条件",
  "products.pagination.prev": "上一页",
  "products.pagination.next": "下一页",
  "products.pagination.page": "第 {n} 页",
  "products.showing": "显示 {from}-{to}，共 {total} 个产品",
  "home.stats.cells": "1200+",
  "home.stats.cells.label": "现货细胞株",
  "home.stats.models": "1000+",
  "home.stats.models.label": "药靶模型",
  "home.stats.standards": "300+",
  "home.stats.standards.label": "诊断标准品",
  "home.stats.patents": "46+",
  "home.stats.patents.label": "专利技术",
  "about.cobioer.founded": "2013年",
  "about.cobioer.location": "南京栖霞区纬地路9号",
  "about.leadingmed.founded": "2019年",
  "about.leadingmed.location": "南京栖霞区",
  "services.cobioer": "靶点模型开发 · 细胞工程 · 药效评价",
  "services.leadingmed": "IVD原料 · OEM试剂 · CDMO服务"
}
```

---

## 🟡 P1 — 首页品牌名修正

当前显示 "Cobioer B2B"，应修改为以下方案之一：
- **方案A**：品牌名 "科佰生物 · 立顶医疗"（中）/ "Cobioer · LeadingMed"（英）
- **方案B**：品牌名 "科佰生物"（作为主品牌，立顶医疗作为子品牌展示）

推荐方案B，因为科佰生物是主品牌，立顶医疗为子公司/关联公司。

修改位置：
1. `src/components/layout/Header.tsx` — Logo/品牌名
2. `src/components/layout/Footer.tsx` — 底部品牌信息
3. `src/app/layout.tsx` — 页面 title

---

## 🟢 P2 — 产品详情页参考模板

基于科佰生物官网产品页面格式（`https://www.cobioer.com/research-cells/info9369.html`），产品详情页应包含：

```
I. General Information
  - Synonyms / Cell Name
  - Species
  - Tissue
  - Disease
  - Morphology
  - Growth Mode
  - Culture Medium
  - Cryopreservation Medium

II. Background
  - 详细背景介绍

III. Description  
  - 产品描述

IV. Introduction
  - Expressed Gene
  - Stability
  - Freeze Medium
  - Culture Medium
  - Mycoplasma Testing
  - Storage
  - Application(s)

V. Representative Data
  - 数据图表占位区
```

---

## 🟢 P2 — 立顶医疗专属页面

新增 `/leadingmed` 路由，展示立顶医疗品牌专区：
- 公司简介
- 技术平台（生化免疫/特定蛋白/POCT层析/ELISA）
- 产品中心（IVD原料）
- CDMO 服务
- 专利技术展示
- 联系方式

---

## 🟢 P2 — 其他改进

1. **搜索功能增强**：搜索框支持货号精确匹配（如输入 CBP71473 直接定位产品）
2. **产品卡片样式**：增加货号醒目显示、分类标签颜色区分
3. **面包屑导航**：首页 > 产品中心 > [分类] > [子分类] > [产品名]
4. **关于我们页面**：分别展示科佰生物和立顶医疗两家公司信息
5. **服务页面**：科佰生物技术服务 + 立顶医疗CDMO服务

---

## 执行优先级

1. **P0-1**: 重构 products.ts 数据模型 + 填充真实产品数据
2. **P0-2**: 修复产品中心页面（分页+搜索+筛选）
3. **P0-3**: 新增产品详情页 `/products/[id]/page.tsx`
4. **P0-4**: 新增立顶医疗产品分类数据
5. **P1-1**: i18n 完整化（产品双语 + 翻译文件补全）
6. **P1-2**: 首页品牌名修正
7. **P2**: 立顶医疗专属页面 + 其他改进

## 编译验证
修改完成后运行：
```bash
cd C:\Users\DWJ\.qclaw\workspace-tfxjjhfnjialcuju\generated-site
npm run build
```
确保零错误通过。`out/` 目录包含可直接部署的静态 HTML。

## 部署
当前部署在 Vercel：https://ivd-b2b-platform.vercel.app/
本地开发：`npm run dev` → http://localhost:3000
