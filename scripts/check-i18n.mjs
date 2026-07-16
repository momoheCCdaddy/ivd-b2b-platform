import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const languages = ["en", "zh", "ar", "de", "fr", "es", "id", "th", "vi"];
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const core = Object.fromEntries(languages.map(language => [language, readJson(`messages/${language}.json`)]));
const completions = readJson("messages/core-completions.json");
const bundles = ["sales", "fallback", "storefront"].map(name => [name, readJson(`messages/${name}.json`)]);
const failures = [];

for (const language of languages) {
  const merged = { ...core[language], ...(completions[language] || {}) };
  const missing = Object.keys(core.en).filter(key => !(key in merged));
  if (missing.length) failures.push(`${language}: missing core keys: ${missing.join(", ")}`);
}

for (const [name, bundle] of bundles) {
  const expected = Object.keys(bundle.en || {});
  for (const language of languages) {
    const missing = expected.filter(key => !(key in (bundle[language] || {})));
    if (missing.length) failures.push(`${language}: missing ${name} keys: ${missing.join(", ")}`);
  }
}

if (failures.length) {
  console.error(`Translation coverage check failed:\n${failures.map(item => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log(`Translation coverage complete for ${languages.length} languages.`);
