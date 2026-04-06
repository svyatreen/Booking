import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ShieldCheck,
  Lock,
  Eye,
  AlertTriangle,
  BadgeCheck,
  UserCheck,
  PhoneCall,
  FileText,
  Star,
  Globe2,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Building2,
  Fingerprint,
  Wifi,
} from "lucide-react";
import { useState } from "react";

const commitments = [
  {
    icon: ShieldCheck,
    title: "Verified Properties Only",
    description:
      "Every hotel in our collection is personally inspected and verified by our curation team before listing. We reject properties that don't meet our strict safety and quality standards.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "All transactions are encrypted using industry-standard TLS and processed through PCI-DSS compliant payment providers. Your card details are never stored on our servers.",
  },
  {
    icon: UserCheck,
    title: "Identity Verification",
    description:
      "Our hotel partners follow KYC and guest identification procedures at check-in, ensuring a safe environment for all guests staying at our properties.",
  },
  {
    icon: Eye,
    title: "Transparent Reviews",
    description:
      "All guest reviews on StayLux are verified as genuine post-stay submissions. We do not allow incentivised or anonymous reviews, so you can trust what you read.",
  },
  {
    icon: Fingerprint,
    title: "Data Privacy",
    description:
      "We comply fully with GDPR and international data privacy regulations. Your personal data is never sold to third parties and you can request deletion at any time.",
  },
  {
    icon: Globe2,
    title: "Global Safety Standards",
    description:
      "We work only with hotels that comply with local fire safety, health, and accessibility regulations. Our partnerships include properties certified by national tourism authorities.",
  },
];

const guestTips = [
  {
    icon: BadgeCheck,
    title: "Check the cancellation policy",
    description: "Always review the refund terms before confirming your booking — policies vary by property.",
  },
  {
    icon: FileText,
    title: "Keep your confirmation email",
    description: "Save your booking confirmation as proof of reservation. It contains all essential check-in details.",
  },
  {
    icon: Wifi,
    title: "Use secure networks",
    description: "Avoid making bookings over public Wi-Fi. Always use a trusted, password-protected connection.",
  },
  {
    icon: PhoneCall,
    title: "Share your itinerary",
    description: "Let a trusted person know your travel plans, hotel address, and check-in dates when travelling alone.",
  },
  {
    icon: AlertTriangle,
    title: "Report suspicious activity",
    description: "If you notice anything unusual about your booking confirmation or our website, contact us immediately.",
  },
  {
    icon: HeartHandshake,
    title: "Travel insurance",
    description: "We strongly recommend comprehensive travel insurance covering medical emergencies, trip cancellation, and lost luggage.",
  },
];

const certifications = [
  { label: "PCI-DSS Level 1", detail: "Payment security" },
  { label: "GDPR Compliant", detail: "EU data protection" },
  { label: "SSL / TLS Encrypted", detail: "256-bit encryption" },
  { label: "ISO 27001", detail: "Information security" },
];

const faqs = [
  {
    question: "How do I know a hotel listing is legitimate?",
    answer:
      "Every property listed on StayLux is manually verified by our curation team. We conduct on-site inspections, check official registrations, and review licences before any hotel is approved. You'll also see verified guest reviews and a StayLux quality badge on all listings.",
  },
  {
    question: "Is my payment information safe?",
    answer:
      "Yes. All payments are processed through PCI-DSS Level 1 certified providers. We use TLS 1.3 encryption for all data in transit, and your card number is never stored on our servers. You'll also see the secure padlock icon in your browser address bar during checkout.",
  },
  {
    question: "What should I do if I suspect fraud?",
    answer:
      "If you receive an unsolicited email, call, or message claiming to be from StayLux and asking for payment or personal details, do not respond. Contact our support team immediately via the Contact Us page or by calling our fraud hotline: +33 1 23 45 67 89.",
  },
  {
    question: "How are guest reviews moderated?",
    answer:
      "Reviews are only accepted from guests who have completed a stay booked through StayLux. Each review is screened by our trust and safety team before publication. We have a zero-tolerance policy for fake or manipulated reviews.",
  },
  {
    question: "What accessibility standards do your hotels meet?",
    answer:
      "We include accessibility information on every hotel page. Properties that meet international accessibility standards — including wheelchair access, adapted rooms, and assistive services — are clearly marked. Contact our team if you have specific accessibility requirements.",
  },
  {
    question: "How can I report a safety concern at a property?",
    answer:
      "If you experience a safety issue at one of our partner hotels during your stay, contact our 24/7 guest support line immediately. For emergencies, always call local emergency services first. We take all safety reports extremely seriously and will investigate promptly.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Safety() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2000"
            alt="Safety and security"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            Your Safety, Our Priority
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Safety at StayLux
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            We go above and beyond to make sure every booking, every stay, and every interaction on our platform is safe and secure.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: ShieldCheck, value: "100%", label: "Verified hotels" },
              { icon: Lock, value: "256-bit", label: "SSL encryption" },
              { icon: Star, value: "4.8★", label: "Guest trust score" },
              { icon: PhoneCall, value: "24/7", label: "Safety support" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="h-7 w-7 opacity-80" />
                <span className="font-serif text-3xl font-bold">{value}</span>
                <span className="text-sm font-medium opacity-75 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Commitments ───────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">How We Protect You</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Our Safety Commitments
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From secure payments to verified properties, we've built multiple layers of protection into every part of the StayLux experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-muted/30 rounded-2xl p-7 border border-border/50 hover:shadow-md transition-shadow group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Certified & Compliant</p>
            <h2 className="font-serif text-3xl font-bold text-foreground">Security Standards We Uphold</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map(({ label, detail }) => (
              <div
                key={label}
                className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
                <p className="text-muted-foreground text-xs">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guest Safety Tips ─────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Stay Smart</p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                Tips for a Safe and Secure Trip
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                While we do everything we can to protect you on our platform, these simple habits will help keep your travels safe from booking to check-out.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-4 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">Phishing Warning</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    StayLux will never ask for your password, card details, or OTP via email, SMS, or phone. If you receive such a request, it is fraudulent — do not respond and report it to us immediately.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {guestTips.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 items-start bg-muted/30 rounded-xl p-5 border border-border/50 hover:shadow-sm transition-shadow"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm mb-1">{title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Contact ─────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <PhoneCall className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">Emergency & Safety Hotline</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  If you experience an emergency during your stay, always contact local emergency services first (112 in Europe, 911 in the USA). Our dedicated safety team is also available around the clock to assist you.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    +33 1 23 45 67 89 (24/7)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    safety@staylux.com
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Common Questions</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Safety FAQs</h2>
            <p className="text-muted-foreground">
              Answers to the most frequently asked questions about safety and security at StayLux.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-background border border-border/50 rounded-3xl p-12 shadow-sm">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Travel with Complete Confidence
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Every StayLux property is verified, every payment is encrypted, and our team is always on hand. Book knowing we've got your back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  Explore Hotels
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full px-10 text-base">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
