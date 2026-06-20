export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'company' | 'product' | 'event' | 'industry';
  slug: string;
}

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: '科佰生物荣获"瞪羚企业"称号',
    summary: '成功入选2023年度南京市瞪羚企业榜单，标志着公司在创新能力、发展速度和社会贡献方面获得高度认可。公司拥有3227种产品，覆盖9大分类，服务全国90%以上分子诊断企业。',
    date: '2023-12-15',
    category: 'company',
    slug: 'gazelle-enterprise-2023',
  },
  {
    id: '2',
    title: '科佰生物获得三项基因检测标准品国家发明专利',
    summary: '公司成功获得BRAF基因检测标准品（CN202210073940.2）、IDH1基因检测标准品（CN202210073039.5）、KRAS基因突变检测标准品（CN202210074655.2）三项发明专利，标志着公司在分子诊断标准品领域的技术领先地位。',
    date: '2024-03-20',
    category: 'company',
    slug: 'gene-patents-2024',
  },
  {
    id: '3',
    title: 'HPV分子诊断标准品全线扩容',
    summary: '新增高致癌风险分型（HPV67、69等）和低致癌风险分型（HPV34、71等），所有新增分型标准品均经过严格一代测序和数字PCR双验证，实现精准分型无交叉。产品覆盖全长HPV基因组，对试剂盒检测区段实现全覆盖。',
    date: '2025-02-28',
    category: 'product',
    slug: 'hpv-standard-expansion',
  },
  {
    id: '4',
    title: 'PDGF/PDGFRA Effector Reporter Cell新品上市',
    summary: '全新PDGF/PDGFRA效应报告基因细胞模型（CBP74284）正式上市，很好地模拟体内PDGFRA信号转导过程，可用于PDGFRA靶向药物功能活性检测。PDGFRA在GIST、胶质瘤等多种肿瘤中发挥关键驱动作用。',
    date: '2025-06-01',
    category: 'product',
    slug: 'pdgfra-effector-cell',
  },
  {
    id: '5',
    title: 'hPRL Effector Reporter Cell发布',
    summary: '催乳素(PRL)效应报告基因细胞模型（CBP74227）正式发布。PRL在哺乳、繁殖、免疫反应、代谢和血管生成等多个生理过程中发挥关键作用，该模型可用于PRL靶向药物的筛选和评价。',
    date: '2026-01-19',
    category: 'product',
    slug: 'hprl-effector-cell',
  },
  {
    id: '6',
    title: 'PDGFRA双突变药靶模型上市',
    summary: 'PDGFRA D842V-G680R/BaF3双突变激酶药靶细胞（CBP73334）正式发布。该模型基于BaF3激酶依赖性增殖系统，可同时评估小分子药物对D842V和G680R双突变的靶向抑制作用，解决GIST伊马替尼耐药研究痛点。',
    date: '2026-02-10',
    category: 'product',
    slug: 'pdgfra-double-mutant',
  },
];

export const techArticles = [
  {
    id: 't1',
    title: 'CD3E：T细胞活化开关的结构与功能新认知',
    summary: '深入解析CD3E在T细胞信号传导中的核心作用，及其在免疫治疗靶点开发中的应用前景。CD3E作为TCR-CD3复合体的关键组分，在T细胞发育、活化和效应功能中发挥不可或缺的作用。',
    date: '2025-11-20',
    category: '免疫靶点',
    slug: 'cd3e-tcell-activation',
  },
  {
    id: 't2',
    title: 'MRGPRX2：假性过敏反应的新靶点',
    summary: '探讨MRGPRX2在药物诱导过敏反应中的作用机制，以及相关GPCR细胞模型的构建策略。MRGPRX2属于Mas相关G蛋白偶联受体家族，在肥大细胞中高表达，是假性过敏反应的关键介导因子。',
    date: '2025-10-15',
    category: 'GPCR研究',
    slug: 'mrgprx2-pseudoallergy',
  },
  {
    id: 't3',
    title: 'STAT5信号通路在血液肿瘤中的双面角色',
    summary: 'STAT5响应多种细胞因子和生长因子激活，在造血功能尤其是淋巴细胞发育、增殖和存活中发挥关键作用。STAT5B基因突变与发育迟缓、自身免疫和免疫缺陷有关，其过度激活则与多种血液恶性肿瘤发展相关。科佰生物提供STAT5-Luc/TF-1报告基因细胞模型(CBPB0006)用于相关药物筛选。',
    date: '2025-09-10',
    category: '肿瘤靶点',
    slug: 'stat5-signaling-hematology',
  },
  {
    id: 't4',
    title: '假病毒标准品在分子诊断中的应用',
    summary: '科佰生物自2020年起推出冠状病毒假病毒标准品系列，已完成7个冠状病毒产品线的研发。全部采用DdPCR定标，支持从qPCR到数字PCR的多种检测平台验证。本文系统介绍假病毒标准品的设计、制备和质控要点。',
    date: '2025-08-05',
    category: '诊断技术',
    slug: 'pseudovirus-standards-application',
  },
  {
    id: 't5',
    title: '神经胶质瘤分子诊断标志物全景',
    summary: '2021年WHO中枢神经系统肿瘤分类将分子标志物纳入胶质瘤分型的核心依据。本文系统梳理IDH1/IDH2突变、1p/19q联合缺失、MGMT甲基化、TERT突变、H3F3A突变、BRAF融合等关键标志物，以及对应的诊断标准品选择策略。',
    date: '2025-07-01',
    category: '诊断技术',
    slug: 'glioma-molecular-markers',
  },
  {
    id: 't6',
    title: '五大黄金细胞系在药物发现中的角色',
    summary: '系统梳理Jurkat、CHO-K1、HEK293、THP-1、Raji五大商业化授权细胞系在靶点验证和药物筛选中的核心价值。这些细胞系因其明确的遗传背景、易操作性和多样化的应用场景，成为药物发现中不可或缺的工具。',
    date: '2025-06-01',
    category: '方法学',
    slug: 'golden-cell-lines',
  },
  {
    id: 't7',
    title: 'MYC：从超转录因子到癌症治疗靶点',
    summary: 'MYC蛋白家族(c-MYC/MYCN/MYCL)调控至少15%基因组转录，参与核糖体生物合成、蛋白质翻译、细胞周期和代谢。多种致癌信号通路(Wnt/Ras/PI3K/Akt)可能通过MYC介导促肿瘤发生作用，使其成为极具吸引力的癌症治疗靶点。科佰生物提供MYC系列诊断标准品支持相关研究。',
    date: '2025-05-20',
    category: '肿瘤靶点',
    slug: 'myc-oncogene-target',
  },
  {
    id: 't8',
    title: 'PDGFRA：从结构到药靶模型的构建',
    summary: 'PDGFRA（血小板衍生生长因子受体α）属于激酶受体家族，其D842V突变导致GIST伊马替尼耐药。本文详述PDGFRA信号转导机制、疾病关联及科佰生物PDGFRA系列药靶模型的构建原理和应用策略。',
    date: '2025-04-15',
    category: '激酶研究',
    slug: 'pdgfra-kinase-model',
  },
];
