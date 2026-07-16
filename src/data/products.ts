import productData from "./products.json";
import leadingmedData from "./leadingmed-products.generated.json";

export interface ProductItem {
  id: string; name: string; nameEn: string;
  description: string; descriptionEn: string;
  tags: string[]; tagsEn: string[];
  specs?: string; parentCell?: string; cultureMedium?: string; stability?: string;
  applications: string[]; applicationsEn: string[];
  status?: string; listPrice?: string; dailyPrice?: string;
  source?: string; note?: string;
  classLevel2?: string; classLevel3?: string;
  rawApplication?: string; assayFormat?: string; transducer?: string;
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

export const productCategories: ProductCategory[] = baseProductCategories.map((category) => {
  if (category.id !== "leadingmed-products") return category;

  return {
    ...category,
    titleEn: "LeadingMed Products",
    description: "立顶医疗（LeadingMed）的体外诊断原料、质控品、微球与配套解决方案",
    descriptionEn: "LeadingMed IVD raw materials, quality controls, microspheres, and supporting solutions",
    items: leadingmedData.items as ProductSubCategory[],
  };
});
