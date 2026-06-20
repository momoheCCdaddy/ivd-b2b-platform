import { Metadata } from 'next';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: '常见问题',
};

const faqs = [
  {
    q: '如何订购产品？',
    a: '您可以通过以下方式订购：1）直接联系我们的销售团队（400-XXX-XXXX 或 sales@biosci.com）；2）在线提交需求表单，销售经理会在1个工作日内与您联系确认。',
  },
  {
    q: '产品发货周期是多久？',
    a: '常规产品的发货周期为1-3个工作日，定制产品的发货周期需根据具体产品与销售人员确认。干冰或液氮运输的产品通常在每周固定时间统一发货。',
  },
  {
    q: '提供产品试用服务吗？',
    a: '是的，我们为部分产品提供试用服务。您可以在线申请试用，或直接联系区域销售经理了解具体产品的试用政策。',
  },
  {
    q: '如何进行细胞复苏和培养？',
    a: '每份产品随附详细的操作说明书。同时我们的技术支持团队可以提供远程或现场的复苏和培养指导服务。请致电 tech@biosci.com 获取支持。',
  },
  {
    q: '产品如何定价？',
    a: '产品价格根据品类、规格和订购数量有所不同。请直接联系销售团队获取最新报价。大额订单和长期合作客户可享受优惠价格。',
  },
  {
    q: '产品是否有质检报告？',
    a: '所有产品均附有COA（质检报告），PDF可下载版本可联系销售获取。报告包含：细胞活性、无菌、支原体、STR鉴定等关键质量数据。',
  },
  {
    q: 'CDMO服务的最小起订量是多少？',
    a: 'CDMO服务的起订量根据产品类型和工艺复杂度不同而有所差异。我们的团队会根据您的需求提供定制化的方案和报价。请联系商务团队详细沟通。',
  },
  {
    q: '技术文章如何投稿或提议主题？',
    a: '欢迎学术界和产业界的合作伙伴投稿或提议技术文章主题。请将您的选题或稿件发送至 tech@biosci.com，主题请标注「技术中心投稿」。',
  },
];

export default function FAQPage() {
  return (
    <div className="pt-20">
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <Badge variant="primary" className="mb-4">FAQ</Badge>
          <h1 className="heading-1 mb-4">常见问题</h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-neutral-100 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-neutral-50 transition-colors list-none">
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <span className="font-medium text-neutral-800">{faq.q}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 pl-[52px] text-neutral-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
