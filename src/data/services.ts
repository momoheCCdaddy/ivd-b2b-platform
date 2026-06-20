export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: ServiceDetail[];
}

export interface ServiceDetail {
  name: string;
  description: string;
  features: string[];
  deliverables?: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cell-engineering',
    title: '细胞工程服务',
    description: '基于慢病毒、CRISPR-Cas9等多种技术平台的稳定细胞株构建与基因编辑服务，满足从基础研究到药物发现的各类需求。',
    icon: 'Dna',
    details: [
      {
        name: '稳定细胞株构建',
        description: '基于公司细胞功能改造技术和高精度基因编辑工具平台，提供多种整合技术路线的稳定细胞株构建服务，包括慢病毒整合、质粒随机整合等。可构建过表达、敲低和报告基因细胞株。',
        features: [
          '多种整合技术路线可选',
          '克隆筛选与表达水平验证',
          '单克隆筛选定株',
          '至少32代稳定性验证',
          '支持工业级细胞株构建',
        ],
        deliverables: ['稳定细胞株（≥3个克隆）', '表达水平验证报告', '细胞鉴定报告', 'QC检测数据含支原体/无菌检测'],
      },
      {
        name: 'CRISPR-Cas9基因编辑',
        description: '从靶点设计到单克隆筛选的全流程基因编辑服务，涵盖基因敲除(KO)、精确基因敲入(KI)和点突变引入，配套脱靶分析。',
        features: [
          'sgRNA设计与筛选优化',
          '同源重组模板构建',
          '单克隆筛选与鉴定',
          '脱靶分析（可选）',
          'Sanger测序验证',
        ],
        deliverables: ['编辑验证报告', 'Sanger测序结果', '单克隆细胞株', '脱靶分析报告（可选）'],
      },
      {
        name: '病毒包装服务',
        description: '高滴度慢病毒和腺病毒包装服务，支持基因过表达、shRNA干扰和CRISPR敲除等多种功能需求的病毒载体构建与包装。',
        features: [
          '慢病毒/腺病毒包装',
          '高滴度（≥10⁸ TU/mL）',
          '多种血清型可选',
          '浓缩与纯化服务',
          '体外/体内级别可选',
        ],
        deliverables: ['高滴度病毒液', '滴度检测报告', '无菌/支原体检测报告'],
      },
    ],
  },
  {
    id: 'molecular-bio',
    title: '分子生物学服务',
    description: '提供基因合成、克隆构建、突变引入等分子生物学全流程服务，支撑细胞工程和药物研发的上游需求。',
    icon: 'Microscope',
    details: [
      {
        name: '基因合成与克隆',
        description: '全基因合成服务，包含密码子优化、载体构建、克隆验证等环节，适用于各类表达系统。',
        features: [
          '全长基因合成',
          '密码子优化',
          '多载体系统支持',
          '序列验证保证',
        ],
        deliverables: ['重组质粒', '测序验证报告', '甘油菌保种'],
      },
      {
        name: '定点突变与突变体构建',
        description: '基于PCR和分子克隆技术的高效定点突变服务，支持单点/多点突变、缺失和插入突变体的快速构建。',
        features: [
          '快速定点突变',
          '多点突变同步引入',
          '突变验证（测序）',
          '大规模突变体库构建',
        ],
        deliverables: ['突变质粒', '测序验证报告', '菌种保藏'],
      },
    ],
  },
  {
    id: 'protein-antibody',
    title: '蛋白工程与抗体服务',
    description: '涵盖重组蛋白表达纯化、单克隆/多克隆抗体制备等技术服务，为诊断试剂和药物开发提供高品质原料。',
    icon: 'FlaskConical',
    details: [
      {
        name: '重组蛋白表达与纯化',
        description: '提供原核(E.coli)、酵母、昆虫细胞、哺乳动物细胞(CHO/HEK293)等多系统的蛋白表达服务，配备多步纯化工艺。',
        features: [
          '多表达系统可选',
          '标签融合/切除方案',
          '多步纯化工艺',
          '内毒素控制（哺乳动物系统）',
        ],
        deliverables: ['纯化蛋白', 'SDS-PAGE检测报告', '浓度与纯度报告', '内毒素检测报告'],
      },
      {
        name: '单克隆/多克隆抗体制备',
        description: '从抗原设计、动物免疫到杂交瘤筛选或血清纯化的全流程抗体制备服务，满足科研和工业级需求。',
        features: [
          '抗原设计与合成',
          '动物免疫（小鼠/兔）',
          '杂交瘤筛选（单抗）',
          '亲和纯化（多抗）',
          'ELISA/WB验证',
        ],
        deliverables: ['纯化抗体', '效价检测报告', 'WB/ELISA验证数据', '杂交瘤细胞株（单抗）'],
      },
    ],
  },
  {
    id: 'drug-dev',
    title: '药物研发服务',
    description: '从靶点验证、先导化合物筛选到药效评价的全流程药物研发技术服务，依托自有的药靶模型库和示踪细胞库。',
    icon: 'Crosshair',
    details: [
      {
        name: '体外药效学评价',
        description: '采用自建的药靶细胞模型库（GPCR/激酶/免疫治疗/ADC/PROTAC），为候选分子提供全面的体外生物学活性评价。',
        features: [
          '靶点结合与功能活性检测',
          '细胞增殖/凋亡检测',
          '信号通路活性分析',
          '联合用药协同评价',
          'ADCC/ADCP效应检测',
        ],
        deliverables: ['剂量-效应曲线', 'IC50/EC50数据', '实验条件与原始数据', '综合评价报告'],
      },
      {
        name: '体内药效评价',
        description: '提供多种肿瘤细胞系的体内成瘤和药效评价服务，支持CDX模型的构建和药物有效性验证。基于Luciferase示踪细胞可进行活体成像监测。',
        features: [
          'CDX模型（皮下/原位）',
          '多瘤种覆盖',
          'Luciferase活体成像',
          '给药方案设计',
          '肿瘤生长动态监测',
        ],
        deliverables: ['肿瘤生长曲线', '活体成像数据', '体重变化记录', '终末肿瘤重量与分析'],
      },
      {
        name: '生物大数据库服务',
        description: '依托公司七大核心数据库（肿瘤细胞库/STR鉴定比对信息库/DNA、RNA标准品库/药靶细胞库/示踪细胞库/蛋白标准品库/基因表达和突变数据库），为客户提供数据支持与咨询服务。',
        features: [
          'STR鉴定比对查询',
          '基因突变数据库检索',
          '药靶细胞信息查询',
          '蛋白标准品数据',
          '定制化数据分析',
        ],
      },
    ],
  },
];
