type ProductVisibilityFields = {
  listPrice?: string;
  status?: string;
};

const BLOCKED_PRICES = new Set(["下架", "不卖细胞"]);
const BLOCKED_STATUS = /下架|暂不出售|不出售|无法出售|网站隐藏|目录隐藏|停产|停售|禁售|withdrawn|discontinued|not for sale|hidden/i;

export function isPublicProduct(product: ProductVisibilityFields) {
  const price = product.listPrice?.trim().toLowerCase() || "";
  const status = product.status?.trim() || "";
  return !BLOCKED_PRICES.has(price) && !BLOCKED_STATUS.test(status);
}
