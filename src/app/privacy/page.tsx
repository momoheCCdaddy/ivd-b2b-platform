import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策',
};

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <h1 className="heading-1 mb-4">隐私政策</h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page max-w-3xl prose prose-neutral">
          <h2 className="heading-3 mb-4">信息收集</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            我们仅在您主动提供的情况下收集个人信息，例如通过联系表单提交的姓名、邮箱和咨询内容。我们不会在未经您明确同意的情况下收集额外信息。
          </p>

          <h2 className="heading-3 mb-4">信息使用</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            收集的信息仅用于：回应您的咨询请求、提供所申请的产品或服务信息、改善我们的服务质量。我们不会将您的个人信息出售或分享给第三方。
          </p>

          <h2 className="heading-3 mb-4">信息安全</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            我们采取合理的技术和组织措施保护您的个人信息，防止未经授权的访问、使用或泄露。
          </p>

          <h2 className="heading-3 mb-4">联系我们</h2>
          <p className="text-neutral-600 leading-relaxed">
            如果您对本隐私政策有任何疑问，请通过 contact@biosci.com 与我们联系。
          </p>
        </div>
      </section>
    </div>
  );
}
