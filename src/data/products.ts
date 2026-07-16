import productData from "./products.json";
import leadingmedData from "./leadingmed-products.generated.json";
import ningpuData from "./ningpu-products.generated.json";
import { isPublicProduct } from "@/lib/catalog-visibility";

export interface ProductItem {
  id: string; name: string; nameEn: string;
  description: string; descriptionEn: string;
  tags: string[]; tagsEn: string[];
  specs?: string; specsEn?: string; parentCell?: string; cultureMedium?: string; stability?: string;
  applications: string[]; applicationsEn: string[];
  status?: string; listPrice?: string; dailyPrice?: string;
  source?: string; note?: string; noteEn?: string;
  classLevel2?: string; classLevel3?: string;
  rawApplication?: string; rawApplicationEn?: string; assayFormat?: string; transducer?: string;
}

export interface ProductSubCategory {
  id: string; name: string; nameEn: string;
  description: string; descriptionEn: string;
  applications: string[]; applicationsEn: string[];
  features?: string[]; featuresEn?: string[];
  count?: string;
  products: ProductItem[];
}

export interface ProductCategory {
  id: string; title: string; titleEn: string;
  description: string; descriptionEn: string;
  icon: string;
  items: ProductSubCategory[];
}

const baseProductCategories = productData as ProductCategory[];

function publicItems(items: ProductSubCategory[]) {
  return items
    .map(item => ({ ...item, products: item.products.filter(isPublicProduct) }))
    .filter(item => item.products.length > 0);
}

export const productCategories: ProductCategory[] = baseProductCategories.map((category) => {
  if (category.id === "ningpu-qc") {
    return {
      ...category,
      titleEn: "Ningpu Quality Controls",
      description: "江苏宁普医疗天然病原体分子、抗原、NGS及HPV细胞质控品",
      descriptionEn: "Ningpu natural-pathogen molecular, antigen, NGS, and HPV cellular quality controls",
      items: publicItems(ningpuData.items as ProductSubCategory[]),
    };
  }

  if (category.id === "leadingmed-products") {
    return {
      ...category,
      titleEn: "LeadingMed Products",
      description: "立顶医疗（LeadingMed）的体外诊断原料、质控品、微球与配套解决方案",
      descriptionEn: "LeadingMed IVD raw materials, quality controls, microspheres, and supporting solutions",
      items: publicItems(leadingmedData.items as ProductSubCategory[]),
    };
  }

  return { ...category, items: publicItems(category.items) };
});
