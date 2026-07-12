import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import InquiryForm from '@/components/inquiry/InquiryForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Request a Quote | Contact Global Sales',
  description: 'Contact Cobioer global sales for IVD products, research cell lines, custom development, pricing and availability.',
};

const contactInfo = [
  {
    icon: Phone,
    label: 'Global sales hotline',
    value: '400-8750-250',
  },
  {
    icon: Mail,
    label: 'Sales inquiries',
    value: 'sales@cobioer.com',
  },
  {
    icon: Mail,
    label: 'Technical support',
    value: 'tech@cobioer.com',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'No. 9 Weidi Road, Qixia District, Nanjing, China',
  },
  {
    icon: Clock,
    label: 'Business hours',
    value: 'Monday–Friday, 09:00–18:00 (UTC+8)',
  },
];

export default function ContactPage() {
  return (
    <div className="pt-20">
      <section className="bg-neutral-50 py-16">
        <div className="container-page text-center">
          <Badge variant="primary" className="mb-4">GLOBAL SALES</Badge>
          <h1 className="heading-1 mb-4">Request product information</h1>
          <p className="body-text max-w-2xl mx-auto">
            Tell us what you need. Our product specialists will confirm availability, lead time, documentation and commercial terms.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="heading-2 mb-8">Talk to our team</h2>
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
                <h3 className="font-semibold text-neutral-800 mb-2">Regional sales support</h3>
                <p className="text-sm text-neutral-500">
                  We route each inquiry to the product and regional specialist best suited to your market. Business inquiries are normally answered within one working day.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="heading-2 mb-8">Inquiry details</h2>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-secondary-50" />}>
                <InquiryForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
