export type CatalogSummary = {
  id: string; title: string; titleEn: string; description: string; descriptionEn: string;
  icon: string; count: number; highlights: string[]; highlightsEn: string[];
};

export const catalogSummary: CatalogSummary[] = [
  { id: "research-cells", title: "科研细胞", titleEn: "Research Cell Lines", description: "覆盖肿瘤、正常组织及常用实验细胞系。", descriptionEn: "Authenticated tumor, normal tissue and commonly used research cell lines.", icon: "Microscope", count: 1439, highlights: ["肿瘤细胞", "正常细胞", "模式细胞"], highlightsEn: ["Tumor cells", "Normal cells", "Model cells"] },
  { id: "gpcr-targets", title: "GPCR靶点", titleEn: "GPCR Target Models", description: "面向功能检测和药物筛选的稳定细胞模型。", descriptionEn: "Stable functional assay models for GPCR drug discovery and screening.", icon: "Target", count: 268, highlights: ["Class A", "Class B", "孤儿受体"], highlightsEn: ["Class A", "Class B", "Orphan receptors"] },
  { id: "kinase-cells", title: "激酶靶点", titleEn: "Kinase Target Models", description: "用于细胞增殖和靶向药物评价的激酶模型。", descriptionEn: "Kinase-driven cellular models for targeted therapy evaluation.", icon: "FlaskConical", count: 243, highlights: ["突变型", "野生型", "耐药型"], highlightsEn: ["Mutant", "Wild type", "Drug resistant"] },
  { id: "immunotherapy-cells", title: "免疫治疗", titleEn: "Immunotherapy Models", description: "覆盖免疫检查点、ADCC及报告基因检测。", descriptionEn: "Immune checkpoint, ADCC and reporter gene bioassay models.", icon: "TestTubes", count: 495, highlights: ["检查点", "ADCC", "报告基因"], highlightsEn: ["Checkpoints", "ADCC", "Reporter assays"] },
  { id: "diagnostic-standards", title: "诊断标准品", titleEn: "Diagnostic Reference Materials", description: "面向分子诊断开发和质量控制的标准品。", descriptionEn: "Reference materials for molecular diagnostic development and quality control.", icon: "TestTubes", count: 3773, highlights: ["肿瘤", "病原体", "遗传病"], highlightsEn: ["Oncology", "Pathogens", "Genetic disease"] },
  { id: "taa-mouse", title: "TAA小鼠模型", titleEn: "TAA Mouse Models", description: "肿瘤抗原相关的同源移植和药效模型。", descriptionEn: "Tumor-associated antigen syngeneic and efficacy models.", icon: "Microscope", count: 252, highlights: ["同源移植", "免疫肿瘤", "药效评价"], highlightsEn: ["Syngeneic", "Immuno-oncology", "Efficacy"] },
  { id: "tracer-cells", title: "示踪细胞", titleEn: "Reporter & Tracer Cells", description: "Luciferase、GFP和RFP标记细胞。", descriptionEn: "Luciferase, GFP and RFP labelled cell models.", icon: "Microscope", count: 185, highlights: ["Luciferase", "GFP", "RFP"], highlightsEn: ["Luciferase", "GFP", "RFP"] },
  { id: "drug-resistant", title: "耐药模型", titleEn: "Drug-resistant Models", description: "用于耐药机制研究和联合用药评价。", descriptionEn: "Models for resistance mechanism and combination therapy research.", icon: "Target", count: 39, highlights: ["化疗耐药", "靶向耐药"], highlightsEn: ["Chemoresistance", "Targeted resistance"] },
];
