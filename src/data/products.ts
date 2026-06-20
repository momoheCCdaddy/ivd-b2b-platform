import productData from "./products.json";

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

export const productCategories: ProductCategory[] = productData as ProductCategory[];
