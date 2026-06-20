import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '联系我们',
  description: '联系BioSci，获取技术咨询和商务合作',
};

const contactInfo = [
  {
    icon: Phone,
    label: '全国服务热线',
    value: '400-XXX-XXXX',
  },
  {
    icon: Mail,
    label: '销售咨询',
    value: 'sales@biosci.com',
  },
  {
    icon: Mail,
    label: '技术支持',
    value: 'tech@biosci.com',
  },
  {
    icon: MapPin,
    label: '公司地址',
    value: '南京市栖霞区纬地路9号',
  },
  {
    icon: Clock,
    label: '工作时间',
    value: '周一至周五 9:00-18:00',
  },
];

export default function ContactPage() {
  return (
    <div className="pt-20">
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <Badge variant="primary" className="mb-4">联系我们</Badge>
          <h1 className="heading-1 mb-4">联系我们</h1>
          <p className="body-text max-w-2xl mx-auto">
            无论您需要靶点验证模型、诊断标准品还是CDMO服务，我们的专家团队随时为您提供支持
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="heading-2 mb-8">联系方式</h2>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">{info.label}</p>
                      <p className="text-lg font-semibold text-neutral-800">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-neutral-50 rounded-xl">
                <h3 className="font-semibold text-neutral-800 mb-2">销售团队分区联系</h3>
                <p className="text-sm text-neutral-500">
                  我们提供分区域销售服务，根据您所在的地区，为您匹配最合适的商务经理，确保快速响应和专业服务。
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="heading-2 mb-8">在线留言</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-neutral-700"
                      placeholder="您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      公司/机构
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-neutral-700"
                      placeholder="公司或机构名称"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-neutral-700"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">电话</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-neutral-700"
                      placeholder="您的联系电话"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    咨询类型
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-neutral-700 bg-white">
                    <option>请选择咨询类型</option>
                    <option>产品咨询</option>
                    <option>技术服务咨询</option>
                    <option>CDMO合作</option>
                    <option>商务合作</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    留言内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-neutral-700 resize-none"
                    placeholder="请描述您的需求，我们会尽快与您联系"
                  />
                </div>
                <Button size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  提交留言
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
