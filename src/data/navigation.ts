export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    label: '关于我们',
    href: '/about',
    children: [
      { label: '企业简介', href: '/about' },
      { label: '企业文化', href: '/about#culture' },
      { label: '发展历程', href: '/about#history' },
      { label: '团队介绍', href: '/about#team' },
    ],
  },
  {
    label: '产品中心',
    href: '/products',
    children: [
      { label: '药物靶点模型', href: '/products#target-models' },
      { label: '诊断标准品', href: '/products#diagnostic' },
      { label: '科研细胞', href: '/products#cells' },
      { label: 'IVD原料', href: '/products#ivd' },
    ],
  },
  {
    label: '技术服务',
    href: '/services',
    children: [
      { label: '细胞工程', href: '/services#cell-engineering' },
      { label: '靶点模型开发', href: '/services#target-dev' },
      { label: '药效评价', href: '/services#efficacy' },
      { label: 'CDMO服务', href: '/services#cdmo' },
    ],
  },
  {
    label: '技术中心',
    href: '/tech-center',
  },
  {
    label: '新闻动态',
    href: '/news',
  },
  {
    label: '质量体系',
    href: '/quality',
  },
  {
    label: '联系我们',
    href: '/contact',
  },
];
