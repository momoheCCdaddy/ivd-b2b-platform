import { Metadata } from 'next';
import { CheckCircle, Award, Users, Lightbulb, Target, Heart, Microscope } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: '关于我们',
  description: '了解科佰生物的企业文化、发展历程和团队介绍',
};

const timeline = [
  { year: '2013', event: '公司创立，致力于生命科学上游领域' },
  { year: '2015', event: '首条科研细胞产品线发布，建立肿瘤细胞库' },
  { year: '2017', event: '诊断标准品业务线启动，推出基因检测标准品' },
  { year: '2019', event: '药靶模型产品线大幅拓展，覆盖GPCR/Kinase/免疫治疗' },
  { year: '2021', event: '产品数突破2000种，假病毒标准品系列上市' },
  { year: '2023', event: '通过ISO认证，获评瞪羚企业，产品总数突破3000种' },
  { year: '2025', event: '产品总数达3227种，覆盖9大分类，服务全国90%+分子诊断企业' },
];

const values = [
  {
    icon: Target,
    title: '科学严谨',
    desc: '以数据说话，以实验验证。每批发货前严格QC检测——活性、细菌、真菌、支原体四重检测，支持STR鉴定。32代稳定性验证是对细胞模型质量的承诺。',
  },
  {
    icon: Heart,
    title: '客户至上',
    desc: '创新客户免赔售后政策：1个月超长售后期，售后期内客户免责1次，STR错误全额退款并赔偿鉴定费用。细胞活性、质量和服务是对客户的三重保障。',
  },
  {
    icon: Lightbulb,
    title: '持续创新',
    desc: '在基因编辑、细胞工程、诊断标准品技术上不断突破边界。拥有三大基因检测标准品专利（BRAF/IDH1/KRAS），持续将最新技术转化为客户可用的产品。',
  },
  {
    icon: Users,
    title: '开放协作',
    desc: '与全国90%以上的分子诊断企业建立了合作关系，成功支持多家企业的试剂盒研发和获批。在LDT、IVD和CDx领域均有丰富的合作经验和优质产品。',
  },
];

const stats = [
  { value: '3227', label: '产品总数', suffix: '种' },
  { value: '9', label: '产品分类', suffix: '大' },
  { value: '12', label: '行业深耕', suffix: '年' },
  { value: '1200', label: '现货细胞系', suffix: '+株' },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <Badge variant="primary" className="mb-4">关于我们</Badge>
          <h1 className="heading-1 mb-4">关于科佰生物</h1>
          <p className="body-text max-w-2xl mx-auto">
            南京科佰生物科技有限公司成立于2013年，是一家专业提供自主生物产品、生命医学研究外包服务、生物大数据库的综合型公司。
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-primary-500 py-10">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-extrabold font-mono">
                  {stat.value}<span className="text-lg font-medium text-primary-200">{stat.suffix}</span>
                </div>
                <div className="text-sm text-primary-100 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">我们的故事</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                科佰生物在多年的发展历程中，整合资源、悉心研发，逐步建立起"肿瘤细胞库"、"STR鉴定比对信息库"、"DNA/RNA标准品库"、"药靶细胞库"、"示踪细胞库"、"蛋白标准品库"、"基因表达和突变数据库"等七大核心产品和数据库。
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                同时开发了分子生物学、蛋白工程、病毒包装、抗体工程、细胞工程、药物研发等一系列实验外包服务平台，为各类药物研发和基因诊断机构提供全方位支持。
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                公司十分重视研发创新，凭借细胞功能改造技术、高精度和灵活的基因编辑工具平台，提供包括激酶、GPCR、肿瘤免疫等多类疾病靶点的药物筛选细胞模型，以及数百种多种形式的用于基因诊断的标准参照品。
              </p>
              <p className="text-neutral-600 leading-relaxed mb-6">
                我们支持对所有物种的基因功能和人类疾病的基因驱动因素的进一步了解，以及个性化分子、细胞和基因治疗的发展。公司拥有五大商业化授权细胞系（Jurkat/CHO-K1/HEK293/THP-1/Raji），为药物发现提供核心工具。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/contact">商务合作</Button>
                <Button variant="outline" href="/products">浏览产品</Button>
              </div>
            </div>
            <div className="relative space-y-4">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                    <Microscope className="w-10 h-10 text-primary-500" />
                  </div>
                  <div className="text-5xl font-extrabold text-primary-500 font-mono">7</div>
                  <p className="text-neutral-600 mt-2">核心数据库</p>
                </div>
              </div>
              <Card hover={false} className="!p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">3项国家发明专利</p>
                    <p className="text-xs text-neutral-500">BRAF/IDH1/KRAS基因检测标准品</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Culture / Values */}
      <section className="section-padding bg-neutral-50" id="culture">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">企业文化</h2>
            <p className="body-text max-w-2xl mx-auto">
              这些价值观驱动着我们每天的决策和行动
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <Card key={v.title} hover={false}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <v.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">{v.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white" id="history">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">发展历程</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
                  {index < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-primary-200 mt-2" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-lg font-bold text-primary-500 font-mono">{item.year}</span>
                  <p className="text-neutral-600">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-neutral-50" id="team">
        <div className="container-page text-center">
          <h2 className="heading-2 mb-4">团队介绍</h2>
          <p className="body-text max-w-3xl mx-auto">
            团队主要由国内知名大学（中科院、复旦大学、上海交通大学、西安交通大学、吉林大学、南京师范大学、四川大学等）毕业的硕士、博士组成，多数员工拥有CRO公司或国内外药企工作经历，具备专业的生命科学背景和强烈的客户服务意识。
          </p>
        </div>
      </section>
    </div>
  );
}
