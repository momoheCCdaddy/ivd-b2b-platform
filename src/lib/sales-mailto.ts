const SALES_EMAIL = "sales@cobioer.com";

export function salesMailto(subject: string, fields: Array<[string, unknown]>) {
  const body = fields
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
    .join("\n");
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
