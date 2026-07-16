export type Bilingual = { en: string; zh: string };
export type ContentCard = { title: Bilingual; description: Bilingual; bullets?: Bilingual[]; badge?: Bilingual };
export type ContentSection = { id: string; title: Bilingual; description?: Bilingual; cards: ContentCard[] };
export type PageContent = { eyebrow: Bilingual; title: Bilingual; description: Bilingual; sections: ContentSection[]; cta?: { title: Bilingual; description: Bilingual; label: Bilingual; href: string } };
const b = (en: string, zh: string): Bilingual => ({ en, zh });

export const siteContent: Record<string, PageContent> = {
  about: {
    eyebrow: b("ABOUT COBIOER", "关于科佰"), title: b("Science translated into dependable products", "让科学成果成为可靠产品"),
    description: b("Cobioer BioSciences develops authenticated cell models, diagnostic reference materials and integrated IVD solutions for pharmaceutical, biotechnology and diagnostic customers worldwide.", "科佰生物面向全球制药、生物技术及诊断客户，开发经过验证的细胞模型、诊断标准品与IVD整体解决方案。"),
    sections: [
      { id: "profile", title: b("Built for translational R&D", "专注转化研发"), description: b("From target discovery to assay validation, our teams connect biological insight with scalable manufacturing and quality control.", "从靶点发现到检测验证，我们将生物学洞察与规模化生产和质量控制连接起来。"), cards: [
        { title: b("Cobioer BioSciences", "科佰生物"), description: b("Founded in Nanjing, Cobioer focuses on engineered cell lines, drug-target models and molecular diagnostic reference materials.", "科佰生物立足南京，专注工程细胞系、药物靶点模型和分子诊断标准品。"), badge: b("CELL MODELS", "细胞模型") },
        { title: b("Ningpu Diagnostics", "宁普诊断"), description: b("Quality-control materials and reference products designed for molecular diagnostic workflows and laboratory validation.", "面向分子诊断流程及实验室验证的质控材料与参考产品。"), badge: b("QUALITY CONTROL", "质量控制") },
        { title: b("LeadingMed", "立顶医疗"), description: b("IVD raw materials, assay development and CDMO capabilities supporting diagnostic manufacturers from concept to scale-up.", "提供IVD原料、检测开发和CDMO能力，支持诊断厂商从概念到规模化。"), badge: b("IVD & CDMO", "IVD与CDMO") },
      ]},
      { id: "culture", title: b("How we work", "我们的工作方式"), cards: [
        { title: b("Evidence first", "证据优先"), description: b("Product claims are tied to documented methods, traceable batches and fit-for-purpose quality records.", "产品主张以有记录的方法、可追溯批次及适用的质量记录为依据。") },
        { title: b("Customer context", "理解客户场景"), description: b("We match products and technical support to the customer's assay, regulatory path and delivery requirements.", "根据客户检测体系、法规路径和交付要求匹配产品与技术支持。") },
        { title: b("Long-term partnership", "长期合作"), description: b("Responsive communication, transparent lead times and reliable after-sales support are part of every engagement.", "快速沟通、透明交期和可靠售后是每次合作的基本组成。") },
      ]},
      { id: "history", title: b("Capabilities at a glance", "核心能力概览"), cards: [
        { title: b("7,000+", "7,000+"), description: b("Catalog products across research and diagnostics.", "覆盖科研与诊断领域的目录产品。") },
        { title: b("ISO-oriented quality", "ISO导向质量体系"), description: b("Controlled workflows for identity, contamination and performance testing.", "针对身份、污染和性能检测的受控流程。") },
        { title: b("Global response", "全球响应"), description: b("English-first commercial support with multilingual and regional routing.", "英文优先的商务支持，并提供多语言和区域分配。") },
      ]},
    ], cta: { title: b("Discuss your program with a specialist", "与产品专家讨论您的项目"), description: b("Tell us your target, assay format and timeline. We will recommend the most suitable product or development path.", "告诉我们您的靶点、检测形式和时间要求，我们将推荐合适的产品或开发路径。"), label: b("Contact global sales", "联系全球销售"), href: "/contact" },
  },
  services: {
    eyebrow: b("TECHNICAL SERVICES", "技术服务"), title: b("From target concept to validated assay", "从靶点概念到验证检测"),
    description: b("Flexible development services for cell engineering, target validation, efficacy studies and IVD scale-up.", "面向细胞工程、靶点验证、药效研究及IVD规模化的灵活开发服务。"),
    sections: [{ id: "platforms", title: b("Four service platforms", "四大服务平台"), cards: [
      { title: b("Cell engineering", "细胞工程"), description: b("Stable cell-line construction with documented clone screening and identity control.", "提供稳定细胞株构建、克隆筛选和身份控制记录。"), bullets: [b("Gene overexpression and knockout", "基因过表达与敲除"), b("Reporter cell development", "报告基因细胞开发"), b("Stable clone characterization", "稳定克隆表征")] },
      { title: b("Target model development", "靶点模型开发"), description: b("Fit-for-purpose GPCR, kinase, immune and pathway models for screening campaigns.", "面向筛选项目的GPCR、激酶、免疫和信号通路模型。"), bullets: [b("Assay feasibility", "检测可行性"), b("Signal-window optimization", "信号窗口优化"), b("Reference compound validation", "参考化合物验证")] },
      { title: b("Efficacy evaluation", "药效评价"), description: b("Cell-based studies supporting candidate selection, resistance mechanisms and combination strategies.", "支持候选物筛选、耐药机制和联合策略的细胞药效研究。"), bullets: [b("Dose-response studies", "剂量反应研究"), b("Mechanism-focused panels", "机制导向面板"), b("Custom data reports", "定制数据报告")] },
      { title: b("IVD CDMO", "IVD CDMO"), description: b("Raw-material selection, assay transfer, pilot production and controlled scale-up for diagnostic manufacturers.", "为诊断厂商提供原料筛选、检测转移、中试生产及受控放大。"), bullets: [b("Antigen and antibody sourcing", "抗原抗体筛选"), b("Reagent optimization", "试剂优化"), b("Scale-up and technology transfer", "规模化与技术转移")] },
    ]}], cta: { title: b("Need a custom development plan?", "需要定制开发方案？"), description: b("Share your technical goal and expected deliverables with our project team.", "向项目团队说明技术目标与预期交付物。"), label: b("Start a technical inquiry", "发起技术咨询"), href: "/contact" },
  },
  quality: {
    eyebrow: b("QUALITY & TRACEABILITY", "质量与追溯"), title: b("Confidence built into every batch", "将可信度融入每个批次"),
    description: b("Our quality approach combines identity verification, contamination control, performance testing and traceable documentation.", "我们的质量方法结合身份验证、污染控制、性能测试和可追溯文件。"),
    sections: [
      { id: "controls", title: b("Core quality controls", "核心质量控制"), cards: [
        { title: b("Identity verification", "身份验证"), description: b("Cell identity and source records are reviewed using appropriate authentication methods such as STR where applicable.", "根据产品适用性采用STR等方法审核细胞身份和来源记录。") },
        { title: b("Contamination control", "污染控制"), description: b("Defined testing workflows address bacteria, fungi and mycoplasma risks before release.", "放行前通过规定流程控制细菌、真菌和支原体风险。") },
        { title: b("Functional performance", "功能性能"), description: b("Fit-for-purpose assays verify signal response, stability or target-related performance.", "采用适用检测验证信号响应、稳定性或靶点相关性能。") },
        { title: b("Batch traceability", "批次追溯"), description: b("Lot-linked records connect source, production, testing and release information.", "批次记录连接来源、生产、检测和放行信息。") },
      ]},
      { id: "documents", title: b("Documentation supplied by product and lot", "按产品和批次提供文件"), description: b("Certificates and technical documents are released only when supported by the relevant product and batch records.", "仅在相应产品和批次记录支持的情况下提供证书和技术文件。"), cards: [
        { title: b("Certificate of Analysis", "分析证书"), description: b("Batch-specific test results and release information, available where applicable.", "在适用情况下提供批次检测结果和放行信息。") },
        { title: b("Technical data", "技术资料"), description: b("Handling, culture, storage and application guidance matched to the product.", "与产品匹配的操作、培养、储存及应用指南。") },
        { title: b("Quality statements", "质量声明"), description: b("Supporting quality or traceability statements provided after product verification.", "在产品确认后提供支持性的质量或追溯声明。") },
      ]},
    ], cta: { title: b("Request batch-specific documentation", "申请批次相关文件"), description: b("Provide the catalog ID and lot number so our quality team can locate the correct record.", "请提供货号和批号，以便质量团队定位正确记录。"), label: b("Contact quality support", "联系质量支持"), href: "/contact" },
  },
  faq: {
    eyebrow: b("HELP CENTER", "帮助中心"), title: b("Frequently asked questions", "常见问题"), description: b("Practical answers for product selection, ordering, shipping and technical documentation.", "关于产品选择、订购、运输和技术文件的实用解答。"),
    sections: [{ id: "questions", title: b("Products and ordering", "产品与订购"), cards: [
      { title: b("How do I request a quotation?", "如何申请报价？"), description: b("Open a product page and select Request Quote. The catalog ID is carried into the form automatically. Products with verified list prices may also use the instant quote tool.", "打开产品详情并选择申请报价，货号会自动带入表单。有可信目录价的产品也可使用即时报价工具。") },
      { title: b("Are prices shown final?", "页面价格是最终价格吗？"), description: b("Catalog calculations exclude freight, duties, taxes and special handling. Availability and final commercial terms require sales confirmation.", "目录计算不包含运费、关税、税费及特殊处理费，库存和最终商务条款需销售确认。") },
      { title: b("Can you ship internationally?", "是否支持国际运输？"), description: b("International fulfillment depends on product type, destination, cold-chain requirements and local import rules. Our sales team confirms feasibility before order acceptance.", "国际交付取决于产品类型、目的地、冷链要求和当地进口规定，销售团队会在接受订单前确认可行性。") },
      { title: b("How can I obtain a COA?", "如何获取COA？"), description: b("COAs are batch-specific. Send the catalog ID and lot number through the inquiry form so the correct document can be verified and supplied.", "COA与批次绑定，请通过询盘提交货号和批号，以便核实并提供正确文件。") },
      { title: b("What information speeds up technical support?", "哪些信息有助于技术支持？"), description: b("Include catalog ID, lot number, assay objective, protocol conditions, observed result and relevant images or raw data.", "请提供货号、批号、实验目标、操作条件、观察结果以及相关图片或原始数据。") },
      { title: b("Do you offer custom development?", "是否提供定制开发？"), description: b("Yes. We evaluate target, assay format, acceptance criteria, timeline and expected deliverables before proposing a project plan.", "可以。我们会在提出项目方案前评估靶点、检测形式、验收标准、时间和预期交付物。") },
    ]}], cta: { title: b("Still need help?", "仍需帮助？"), description: b("Our product and technical teams normally respond within one business day.", "产品和技术团队通常会在一个工作日内回复。"), label: b("Ask our team", "咨询团队"), href: "/contact" },
  },
  "tech-center": {
    eyebrow: b("TECHNICAL CENTER", "技术中心"), title: b("Resources for better experimental decisions", "帮助实验决策的技术资源"), description: b("Application guidance, product handling principles and development insights from our scientific teams.", "来自科学团队的应用指南、产品操作原则和开发洞察。"),
    sections: [{ id: "resources", title: b("Resource library", "资源库"), cards: [
      { title: b("Cell culture & handling", "细胞培养与操作"), description: b("Core practices for recovery, culture conditions, passage control, cryopreservation and contamination prevention.", "关于复苏、培养条件、传代控制、冻存和污染预防的核心实践。"), badge: b("GUIDE", "指南") },
      { title: b("Assay model selection", "检测模型选择"), description: b("How target biology, signaling context and assay readout influence model choice.", "靶点生物学、信号背景和检测读出如何影响模型选择。"), badge: b("APPLICATION NOTE", "应用说明") },
      { title: b("Reference material planning", "标准品规划"), description: b("Considerations for matrix, variant level, commutability, intended use and quality-control design.", "关于基质、变异水平、互换性、预期用途和质控设计的考虑。"), badge: b("IVD INSIGHT", "IVD洞察") },
      { title: b("Custom project readiness", "定制项目准备"), description: b("A practical checklist for defining scope, acceptance criteria, timelines and deliverables.", "定义范围、验收标准、时间和交付物的实用清单。"), badge: b("CHECKLIST", "清单") },
    ]}], cta: { title: b("Need product-specific guidance?", "需要产品专属指导？"), description: b("Send the catalog ID and your intended application to our technical team.", "向技术团队提供货号和预期应用。"), label: b("Contact technical support", "联系技术支持"), href: "/contact" },
  },
  news: {
    eyebrow: b("INSIGHTS & UPDATES", "洞察与动态"), title: b("Scientific and company updates", "科学与公司动态"), description: b("New products, technical resources and events from the Cobioer team.", "来自科佰团队的新产品、技术资源与活动信息。"),
    sections: [{ id: "updates", title: b("Latest updates", "最新动态"), cards: [
      { title: b("Expanded molecular diagnostic reference catalog", "分子诊断标准品目录扩展"), description: b("Additional oncology, pathogen, methylation and pharmacogenomic materials are now searchable in the product center.", "更多肿瘤、病原体、甲基化和用药指导材料现已可在产品中心检索。"), badge: b("PRODUCT", "产品") },
      { title: b("A faster way to identify target models", "更快速地查找靶点模型"), description: b("Server-side catalog search now prioritizes exact catalog IDs and returns paginated results across 7,000+ products.", "服务器端目录搜索现在优先匹配精确货号，并在 7,000+ 产品中分页返回结果。"), badge: b("PLATFORM", "平台") },
      { title: b("International quotation workflow launched", "国际报价流程上线"), description: b("Global customers can submit structured inquiries and prepare indicative catalog quotations in supported currencies.", "全球客户可提交结构化询盘，并使用支持的币种生成目录参考报价。"), badge: b("SERVICE", "服务") },
    ]}], cta: { title: b("Looking for a specific update?", "寻找特定信息？"), description: b("Ask our team about new products, availability or upcoming technical materials.", "向团队咨询新产品、库存或即将发布的技术资料。"), label: b("Contact us", "联系我们"), href: "/contact" },
  },
  privacy: {
    eyebrow: b("PRIVACY & DATA", "隐私与数据"), title: b("Privacy policy", "隐私政策"), description: b("How we collect, use, protect and retain personal data submitted through this website.", "我们如何收集、使用、保护和保留通过本网站提交的个人数据。"),
    sections: [{ id: "policy", title: b("Our privacy commitments", "我们的隐私承诺"), cards: [
      { title: b("Data we collect", "我们收集的数据"), description: b("Contact details, company information, product interests, inquiry content, language, currency, timezone and technical request information that you choose to provide.", "您主动提供的联系方式、公司信息、产品兴趣、询盘内容、语言、币种、时区及技术请求信息。") },
      { title: b("Why we use it", "数据用途"), description: b("To answer inquiries, prepare quotations, provide technical support, fulfill contracts, improve service quality and meet legal obligations.", "用于回复询盘、准备报价、提供技术支持、履行合同、改善服务质量和满足法律义务。") },
      { title: b("Lawful basis and consent", "法律依据与同意"), description: b("We process inquiry data to take steps requested before a contract and based on legitimate business interests. Optional marketing requires separate consent that can be withdrawn.", "我们为采取合同前请求的措施及基于合法商业利益处理询盘数据；可选营销需单独同意，并可撤回。") },
      { title: b("Retention and security", "保留与安全"), description: b("Records are retained only as needed for commercial, quality, legal and regulatory purposes. Access is restricted and sensitive credentials remain server-side.", "记录仅在商业、质量、法律和法规目的所需期限内保留，访问受限，敏感凭据仅保存在服务器端。") },
      { title: b("International transfers", "跨境传输"), description: b("Where data crosses borders, we apply reasonable contractual, technical and organizational safeguards appropriate to the transfer.", "发生跨境传输时，我们会采取与传输相适应的合同、技术和组织保障措施。") },
      { title: b("Your rights", "您的权利"), description: b("Depending on your location, you may request access, correction, deletion, restriction, objection or data portability. Contact sales@cobioer.com to make a request.", "根据所在地，您可请求访问、更正、删除、限制、反对或数据可携带。请通过sales@cobioer.com提出请求。") },
    ]}], cta: { title: b("Questions about your data?", "对个人数据有疑问？"), description: b("Contact us with the subject “Privacy Request” and we will route it to the appropriate team.", "请以“隐私请求”为主题联系我们，我们会转交相应团队。"), label: b("Submit a privacy request", "提交隐私请求"), href: "/contact" },
  },
};
