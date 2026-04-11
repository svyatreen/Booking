import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  FileText,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  CreditCard,
  Globe2,
  Scale,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  XCircle,
  Lock,
} from 'lucide-react';
import { useState } from 'react';

const lastUpdated = '1 April 2026';

const highlights = [
  {
    icon: BadgeCheck,
    label: 'Fair & transparent',
    description: 'Clear terms with no hidden obligations',
  },
  {
    icon: Lock,
    label: 'Secure bookings',
    description: 'Your reservations are fully protected',
  },
  {
    icon: Scale,
    label: 'Governed by French law',
    description: 'Paris courts have jurisdiction',
  },
  {
    icon: RefreshCw,
    label: '30-day notice',
    description: 'We notify you before material changes',
  },
];

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to these Terms',
        text: `By accessing or using Selora (the "Platform"), including browsing hotels, creating an account, or making a booking, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree, please do not use the Platform.`,
      },
      {
        subtitle: 'Eligibility',
        text: 'You must be at least 18 years of age to use Selora and to enter into a binding contract. By using the Platform, you represent and warrant that you meet this requirement. Users who make bookings on behalf of others accept these Terms on behalf of all travellers in the reservation.',
      },
      {
        subtitle: 'Changes to these Terms',
        text: 'We may update these Terms from time to time. We will notify you of material changes by email and by posting a notice on the Platform at least 30 days before changes take effect. Your continued use of Selora after the effective date constitutes your acceptance of the revised Terms.',
      },
    ],
  },
  {
    id: 'platform',
    icon: Globe2,
    title: '2. The Selora Platform',
    content: [
      {
        subtitle: 'What Selora provides',
        text: 'Selora is an online travel platform that connects travellers with independent and luxury hotel partners. We facilitate hotel discovery, booking, and payment, but we are not a hotel operator, travel agent, or insurer. Each booking is a direct contract between you and the hotel.',
      },
      {
        subtitle: 'Platform availability',
        text: 'We aim to keep the Platform available 24 hours a day, 7 days a week. However, we do not guarantee uninterrupted access and may suspend the Platform for maintenance, upgrades, or circumstances beyond our control. We are not liable for losses arising from Platform downtime.',
      },
      {
        subtitle: 'Third-party content',
        text: 'Hotel descriptions, photos, amenity lists, and reviews are provided by our hotel partners and verified guests. While we take care to ensure accuracy, Selora is not responsible for errors or omissions in third-party content.',
      },
    ],
  },
  {
    id: 'accounts',
    icon: UserCheck,
    title: '3. Your Account',
    content: [
      {
        subtitle: 'Registration',
        text: 'To make a booking, you must create a Selora account. You agree to provide accurate, current, and complete information and to keep your account details up to date. You are responsible for all activity that occurs under your account.',
      },
      {
        subtitle: 'Account security',
        text: 'You are responsible for maintaining the confidentiality of your password. You must notify us immediately at security@Selora.com if you suspect unauthorised access to your account. We are not liable for losses resulting from unauthorised use of your account.',
      },
      {
        subtitle: 'Account termination',
        text: 'You may close your account at any time from your account settings. We reserve the right to suspend or terminate accounts that breach these Terms, engage in fraudulent activity, or cause harm to other users or our hotel partners.',
      },
    ],
  },
  {
    id: 'bookings',
    icon: Building2,
    title: '4. Bookings & Reservations',
    content: [
      {
        subtitle: 'Booking confirmation',
        text: 'A booking is confirmed when you receive a confirmation email from Selora containing a unique booking reference. Until that email is received, no reservation has been made. Please check your spam folder if you do not receive confirmation within 15 minutes.',
      },
      {
        subtitle: 'Accuracy of guest details',
        text: 'It is your responsibility to ensure that all guest names, dates, and room preferences entered during booking are correct. Selora is not liable for any losses arising from booking errors made by you.',
      },
      {
        subtitle: "Hotel's right to refuse",
        text: "Hotels reserve the right to refuse check-in if guests do not present valid identification, are under the minimum age, or violate the hotel's own policies. In such cases, Selora's liability is limited to the amount you paid for the booking.",
      },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: '5. Payments & Pricing',
    content: [
      {
        subtitle: 'Pricing',
        text: 'All prices on Selora are displayed in the currency you select and are inclusive of applicable taxes and fees, unless otherwise stated. We make every effort to display accurate pricing; however, in the event of a pricing error, we reserve the right to cancel the booking and issue a full refund.',
      },
      {
        subtitle: 'Payment processing',
        text: 'Payments are processed securely by our PCI-DSS certified payment partners. By providing payment details, you authorise Selora to charge the full booking amount at the time of reservation, unless a pay-at-hotel option is selected.',
      },
      {
        subtitle: 'Currency & fees',
        text: 'If your payment card is denominated in a different currency, your bank or card issuer may apply a foreign exchange fee. Selora is not responsible for any such charges. We recommend checking with your bank before booking.',
      },
    ],
  },
  {
    id: 'cancellations',
    icon: XCircle,
    title: '6. Cancellations & Refunds',
    content: [
      {
        subtitle: 'Cancellation terms',
        text: 'Each booking is subject to the cancellation policy of the hotel at which you have reserved. The applicable policy is displayed clearly on the hotel page and in your booking confirmation. Please review our full Cancellation Policy page for a detailed breakdown.',
      },
      {
        subtitle: 'Refund processing',
        text: 'Eligible refunds are processed within 3–5 business days of cancellation. Depending on your card issuer, funds may take an additional 5–10 business days to appear in your account. Selora is not responsible for delays caused by your bank.',
      },
      {
        subtitle: 'Force majeure',
        text: "In the event of extraordinary circumstances beyond either party's control (natural disasters, government travel bans, pandemics, etc.), we will work with hotel partners to offer vouchers, date changes, or refunds on a case-by-case basis.",
      },
    ],
  },
  {
    id: 'conduct',
    icon: ShieldCheck,
    title: '7. User Conduct',
    content: [
      {
        subtitle: 'Acceptable use',
        text: 'You agree to use Selora only for lawful purposes and in accordance with these Terms. You must not use the Platform to make fraudulent bookings, misrepresent your identity, or engage in any activity that disrupts the Platform or harms other users.',
      },
      {
        subtitle: 'Prohibited activities',
        text: 'The following are strictly prohibited: scraping or crawling the Platform without authorisation; reverse engineering our software; posting false or misleading reviews; using automated tools to make or modify bookings; or reselling bookings without our written consent.',
      },
      {
        subtitle: 'Reviews and content',
        text: 'When submitting a review, you grant Selora a non-exclusive, royalty-free licence to display, reproduce, and distribute your content. You confirm that your review is genuine, based on your own stay, and free from offensive or discriminatory language.',
      },
    ],
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    title: '8. Limitation of Liability',
    content: [
      {
        subtitle: "Selora's liability",
        text: "To the maximum extent permitted by law, Selora's total liability to you for any claim arising from your use of the Platform shall not exceed the total amount paid by you for the booking to which the claim relates.",
      },
      {
        subtitle: 'Excluded losses',
        text: 'Selora is not liable for: loss of profits, loss of data, indirect or consequential losses, losses arising from the act or omission of a hotel partner, or any loss arising from circumstances beyond our reasonable control.',
      },
      {
        subtitle: 'No warranty',
        text: "The Platform is provided 'as is' and 'as available'. We do not warrant that the Platform will be error-free, virus-free, or continuously available. We do not endorse or warrant the quality of any hotel listed on the Platform beyond our own curation standards.",
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: Lock,
    title: '9. Intellectual Property',
    content: [
      {
        subtitle: 'Our content',
        text: 'All content on the Platform — including text, graphics, logos, icons, and software — is the property of Selora SAS or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce or distribute any content without our written consent.',
      },
      {
        subtitle: 'Your licence to use the Platform',
        text: 'We grant you a limited, non-exclusive, non-transferable licence to access and use the Platform for personal, non-commercial travel booking purposes. This licence does not include the right to resell or commercially exploit any part of the Platform.',
      },
    ],
  },
  {
    id: 'governing-law',
    icon: Scale,
    title: '10. Governing Law & Disputes',
    content: [
      {
        subtitle: 'Applicable law',
        text: 'These Terms are governed by the laws of France, without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of Selora shall be subject to the exclusive jurisdiction of the courts of Paris, France.',
      },
      {
        subtitle: 'EU consumer rights',
        text: 'If you are a consumer resident in the European Union, you may have additional rights under local consumer protection law that cannot be excluded by these Terms. Nothing in these Terms is intended to limit any rights you have under applicable EU consumer law.',
      },
      {
        subtitle: 'Informal resolution',
        text: 'Before initiating any formal legal proceedings, we encourage you to contact us at legal@selora.com. We will make every effort to resolve disputes amicably within 30 days.',
      },
    ],
  },
];

function SectionBlock({ section }: { section: (typeof sections)[0] }) {
  const [open, setOpen] = useState(true);
  const Icon = section.icon;
  return (
    <div className="border border-border/50 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-foreground flex-1">
          {section.title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-5 border-t border-border/50 pt-5">
          {section.content.map(({ subtitle, text }) => (
            <div key={subtitle}>
              <p className="font-medium text-foreground text-sm mb-1.5">
                {subtitle}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TermsOfService() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2000"
            alt="Terms of service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Scale className="h-4 w-4 text-amber-300" />
            Clear & Fair
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Terms of Service
          </h1>
          <p className="text-white/80 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* ── Intro + Highlights ─────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                Before You Begin
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Your agreement with Selora
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Service govern your use of the Selora platform
                and all bookings made through it. Please read them carefully —
                they explain your rights and responsibilities as a guest.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, our legal team is
                available at{' '}
                <a
                  href="mailto:legal@selora.com"
                  className="text-primary hover:underline font-medium"
                >
                  legal@selora.com
                </a>
                . We are always happy to clarify.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, label, description }) => (
                <div
                  key={label}
                  className="bg-background border border-border/50 rounded-xl p-5 shadow-sm"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    {label}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Table of Contents ─────────────────────────────────────────── */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-5">
            Contents
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Terms Sections ────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <SectionBlock section={section} />
              </div>
            ))}
          </div>

          {/* Legal note */}
          <div className="mt-10 bg-muted/40 border border-border/50 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Legal Entity.</span>{' '}
              Selora SAS is a company registered in France (SIREN 123 456 789),
              with its registered office at 14 Rue du Faubourg Saint-Honoré,
              75008 Paris, France. For legal correspondence, contact us at{' '}
              <a
                href="mailto:legal@selora.com"
                className="text-primary hover:underline"
              >
                legal@selora.com
              </a>{' '}
              or by post at the address above.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Policies ──────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Also Read
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Related Policies
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                href: '/privacy-policy',
                icon: Lock,
                title: 'Privacy Policy',
                description:
                  'How we collect, use, and protect your personal data.',
              },
              {
                href: '/cancellation-policy',
                icon: XCircle,
                title: 'Cancellation Policy',
                description:
                  'Refund timelines and cancellation procedures explained.',
              },
              {
                href: '/safety',
                icon: ShieldCheck,
                title: 'Safety',
                description: 'Our commitments to keeping your bookings secure.',
              },
            ].map(({ href, icon: Icon, title, description }) => (
              <Link key={href} href={href}>
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group h-full">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    {title}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Ready to Explore?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Now that you know the terms, discover our curated collection of
              43+ luxury hotels across 30+ countries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  Explore Hotels
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 text-base"
                >
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
