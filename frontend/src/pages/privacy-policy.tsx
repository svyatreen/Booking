import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Lock,
  Eye,
  ShieldCheck,
  FileText,
  UserCheck,
  Globe2,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronUp,
  Building2,
  Trash2,
  Server,
  Cookie,
} from "lucide-react";
import { useState } from "react";

const lastUpdated = "1 April 2026";

const sections = [
  {
    id: "information-we-collect",
    icon: FileText,
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information you provide directly",
        text: "When you create an account, make a booking, or contact us, we collect: your full name, email address, phone number, billing and payment information, travel preferences, and any messages you send us.",
      },
      {
        subtitle: "Information collected automatically",
        text: "When you use our platform, we automatically collect: IP address, browser type and version, pages visited, time spent on pages, referring URLs, device identifiers, and approximate location based on IP. This helps us improve our service and detect fraud.",
      },
      {
        subtitle: "Information from third parties",
        text: "If you sign in via a third-party service (such as Google), we receive your name and email address from that provider. We may also receive information from hotels and payment processors to complete your bookings.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "To provide and improve our services",
        text: "We use your information to process bookings, send confirmation emails, manage your account, handle cancellations and refunds, personalise your experience, and improve our platform based on usage data.",
      },
      {
        subtitle: "To communicate with you",
        text: "We may send you booking confirmations, receipts, service updates, and — with your consent — promotional offers and travel recommendations. You can opt out of marketing emails at any time.",
      },
      {
        subtitle: "For security and fraud prevention",
        text: "We use your data to detect and prevent fraudulent transactions, verify your identity, enforce our Terms of Service, and comply with legal obligations.",
      },
    ],
  },
  {
    id: "sharing",
    icon: Globe2,
    title: "3. Sharing Your Information",
    content: [
      {
        subtitle: "With hotel partners",
        text: "We share your name, contact details, and booking information with the hotel at which you've made a reservation. This is necessary to fulfil your booking.",
      },
      {
        subtitle: "With service providers",
        text: "We work with trusted third-party providers for payment processing, email delivery, data analytics, and customer support. These providers are contractually obligated to keep your data confidential and may only use it to provide services to us.",
      },
      {
        subtitle: "We never sell your data",
        text: "StayLux does not sell, rent, or trade your personal information to any third party for their own marketing or commercial purposes. Period.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "4. Cookies & Tracking",
    content: [
      {
        subtitle: "What cookies we use",
        text: "We use essential cookies (required for the platform to function), analytics cookies (to understand how visitors use our site), and preference cookies (to remember your settings like language and theme). We do not use third-party advertising cookies.",
      },
      {
        subtitle: "Managing cookies",
        text: "You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our platform. You can also manage your preferences via our Cookie Settings panel accessible from the footer.",
      },
    ],
  },
  {
    id: "data-retention",
    icon: Server,
    title: "5. Data Retention",
    content: [
      {
        subtitle: "How long we keep your data",
        text: "We retain your account information for as long as your account is active. Booking records are kept for 7 years to comply with financial and legal obligations. Analytics data is retained for a maximum of 26 months in anonymised form.",
      },
      {
        subtitle: "Deletion on request",
        text: "If you close your account, we will delete your personal data within 30 days, except where we are legally required to retain it (e.g. for tax or fraud prevention purposes).",
      },
    ],
  },
  {
    id: "your-rights",
    icon: UserCheck,
    title: "6. Your Rights",
    content: [
      {
        subtitle: "Rights under GDPR and applicable law",
        text: "Depending on your location, you may have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; restrict or object to processing; receive a portable copy of your data; and withdraw consent at any time.",
      },
      {
        subtitle: "How to exercise your rights",
        text: "To make a data request, email us at privacy@staylux.com or use the form in your account settings under 'Privacy & Data'. We will respond within 30 days. You also have the right to lodge a complaint with your national data protection authority.",
      },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "7. Security",
    content: [
      {
        subtitle: "How we protect your data",
        text: "We use industry-standard security measures including TLS 1.3 encryption for data in transit, AES-256 encryption for data at rest, regular security audits, and strict access controls. Our payment processing is PCI-DSS Level 1 certified.",
      },
      {
        subtitle: "Data breach notification",
        text: "In the unlikely event of a data breach affecting your personal information, we will notify you and the relevant supervisory authority within 72 hours of becoming aware, in accordance with GDPR requirements.",
      },
    ],
  },
  {
    id: "international",
    icon: Globe2,
    title: "8. International Transfers",
    content: [
      {
        subtitle: "Transfers outside the EEA",
        text: "Some of our service providers are based outside the European Economic Area. When we transfer data internationally, we use approved safeguards such as Standard Contractual Clauses (SCCs) to ensure your data receives an equivalent level of protection.",
      },
    ],
  },
  {
    id: "children",
    icon: UserCheck,
    title: "9. Children's Privacy",
    content: [
      {
        subtitle: "Age restriction",
        text: "StayLux is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that a child has provided us with personal information, we will delete it promptly.",
      },
    ],
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "10. Changes to This Policy",
    content: [
      {
        subtitle: "How we notify you",
        text: "We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email and display a notice on our platform at least 14 days before the changes take effect. Your continued use of StayLux after the effective date constitutes acceptance.",
      },
    ],
  },
];

const highlights = [
  { icon: Lock, label: "No data sold", description: "Your data is never sold to third parties" },
  { icon: Trash2, label: "Right to delete", description: "Request account deletion at any time" },
  { icon: ShieldCheck, label: "GDPR compliant", description: "Full EU data protection compliance" },
  { icon: Mail, label: "Opt-out anytime", description: "Unsubscribe from marketing in one click" },
];

function SectionBlock({
  section,
}: {
  section: (typeof sections)[0];
}) {
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
        <span className="font-semibold text-foreground flex-1">{section.title}</span>
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
              <p className="font-medium text-foreground text-sm mb-1.5">{subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000"
            alt="Privacy policy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Lock className="h-4 w-4 text-amber-300" />
            Your Data, Your Rights
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* ── Intro + Highlights ─────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Our Commitment</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">We take your privacy seriously</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This Privacy Policy explains what personal data StayLux collects, how we use it, who we share it with, and what rights you have over your information.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using StayLux, you agree to the practices described in this policy. If you have any questions, our privacy team is always available at{" "}
                <a href="mailto:privacy@staylux.com" className="text-primary hover:underline font-medium">
                  privacy@staylux.com
                </a>.
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
                  <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Table of Contents ─────────────────────────────────────────── */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-5">Contents</p>
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

      {/* ── Policy Sections ───────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <SectionBlock section={section} />
              </div>
            ))}
          </div>

          {/* Governing law note */}
          <div className="mt-10 bg-muted/40 border border-border/50 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Governing Law.</span> This Privacy Policy is governed by the laws of France. StayLux SAS, 14 Rue du Faubourg Saint-Honoré, 75008 Paris, France, is the data controller responsible for your personal information. Our EU Data Protection Officer can be reached at <a href="mailto:dpo@staylux.com" className="text-primary hover:underline">dpo@staylux.com</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact & Rights CTA ──────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Exercise Your Rights</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  To access, correct, export, or delete your personal data — or to withdraw consent — contact our privacy team. We'll respond within 30 days.
                </p>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Email:</span> privacy@staylux.com</p>
                  <p><span className="font-medium text-foreground">DPO:</span> dpo@staylux.com</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8 w-full md:w-auto">
                    Contact Privacy Team
                  </Button>
                </Link>
                <Link href="/safety">
                  <Button size="lg" variant="outline" className="rounded-full px-8 w-full md:w-auto">
                    View Safety Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Book with Confidence
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Your privacy matters to us. Explore our curated collection of luxury hotels knowing your data is safe and your rights are always respected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  Explore Hotels
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full px-10 text-base">
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
