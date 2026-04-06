import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  CreditCard,
  CalendarDays,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building2,
} from "lucide-react";
import { useState } from "react";

const policies = [
  {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    title: "Free Cancellation",
    subtitle: "Cancel up to 48 hours before check-in",
    description:
      "For most bookings, you may cancel free of charge up to 48 hours before your scheduled check-in date. A full refund will be issued to your original payment method within 5–10 business days.",
    tags: ["Full Refund", "No Fees", "Most Hotels"],
  },
  {
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    title: "Partial Refund",
    subtitle: "Cancellations within 24–48 hours of check-in",
    description:
      "If you cancel between 24 and 48 hours before check-in, a cancellation fee equivalent to one night's stay will be charged. The remaining balance will be refunded within 5–10 business days.",
    tags: ["1 Night Fee", "Partial Refund", "Some Hotels"],
  },
  {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    title: "Non-Refundable",
    subtitle: "Cancellations less than 24 hours or no-show",
    description:
      "Bookings cancelled within 24 hours of check-in or in the event of a no-show are non-refundable. The full booking amount will be charged. We recommend travel insurance to cover unforeseen circumstances.",
    tags: ["No Refund", "No-Show Included", "Strict Rate"],
  },
];

const timeline = [
  {
    window: "More than 48 hours",
    label: "before check-in",
    refund: "100% refund",
    fee: "No fee",
    status: "green",
  },
  {
    window: "24 – 48 hours",
    label: "before check-in",
    refund: "Partial refund",
    fee: "1 night charged",
    status: "amber",
  },
  {
    window: "Less than 24 hours",
    label: "before check-in",
    refund: "No refund",
    fee: "Full charge",
    status: "red",
  },
  {
    window: "No-show",
    label: "on check-in day",
    refund: "No refund",
    fee: "Full charge",
    status: "red",
  },
];

const faqs = [
  {
    question: "How do I cancel my booking?",
    answer:
      "You can cancel any booking directly from your account under 'My Bookings'. Select the reservation you wish to cancel and follow the on-screen instructions. You'll receive a confirmation email once the cancellation is processed.",
  },
  {
    question: "When will I receive my refund?",
    answer:
      "Refunds are processed within 3–5 business days of cancellation confirmation. Depending on your bank or card provider, it may take an additional 5–10 business days for the funds to appear in your account.",
  },
  {
    question: "What if the hotel cancels my booking?",
    answer:
      "If a hotel cancels your confirmed booking, you are entitled to a full refund regardless of the cancellation policy. We will also assist you in finding a comparable alternative at no extra cost.",
  },
  {
    question: "Can I modify my booking instead of cancelling?",
    answer:
      "Yes. Many hotels allow free date changes subject to availability. Go to 'My Bookings', select your reservation, and choose 'Modify Dates'. If the new dates have a different rate, you'll be charged or refunded the difference.",
  },
  {
    question: "Does travel insurance cover cancellation fees?",
    answer:
      "This depends on your insurance provider and policy terms. We strongly recommend purchasing comprehensive travel insurance that includes trip cancellation cover, especially for non-refundable bookings.",
  },
  {
    question: "Are group or corporate bookings treated differently?",
    answer:
      "Group bookings (5+ rooms) and corporate accounts may have bespoke cancellation terms agreed at the time of booking. Please refer to your booking confirmation or contact our corporate team for details.",
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

export default function CancellationPolicy() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000"
            alt="Cancellation policy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            Transparent & Fair
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Cancellation Policy
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            We believe in clarity and fairness. Here's exactly what to expect when plans change.
          </p>
        </div>
      </section>

      {/* ── Key Stats ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: CheckCircle2, value: "Free", label: "Cancel 48h+ before" },
              { icon: RefreshCw, value: "5–10", label: "Business days refund" },
              { icon: CreditCard, value: "100%", label: "Refund when eligible" },
              { icon: Clock, value: "24/7", label: "Support available" },
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

      {/* ── Policy Tiers ──────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Policy Types</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Cancellation Rates Explained
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each hotel sets its own cancellation terms. The applicable policy is always shown clearly before you confirm your booking.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {policies.map(({ icon: Icon, color, bg, border, title, subtitle, description, tags }) => (
              <div
                key={title}
                className={`rounded-2xl border p-7 ${border} ${bg} flex flex-col gap-5`}
              >
                <div className={`h-12 w-12 rounded-xl bg-background flex items-center justify-center shadow-sm`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
                  <p className={`text-sm font-medium ${color} mb-3`}>{subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-background border border-border/50 rounded-full px-3 py-1 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline Table ─────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">At a Glance</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Refund Timeline</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A quick reference to understand what you'll receive depending on when you cancel.
            </p>
          </div>

          <div className="bg-background rounded-2xl border border-border/50 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 gap-0 bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Cancellation Window</span>
              <span className="text-center">Refund</span>
              <span className="text-right">Fee</span>
            </div>
            {timeline.map(({ window, label, refund, fee, status }, i) => {
              const dotColor =
                status === "green"
                  ? "bg-green-500"
                  : status === "amber"
                  ? "bg-amber-500"
                  : "bg-red-500";
              const refundColor =
                status === "green"
                  ? "text-green-600 dark:text-green-400"
                  : status === "amber"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400";
              return (
                <div
                  key={window}
                  className={`grid grid-cols-3 gap-0 px-6 py-5 items-center ${
                    i < timeline.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
                    <div>
                      <p className="font-medium text-foreground text-sm">{window}</p>
                      <p className="text-muted-foreground text-xs">{label}</p>
                    </div>
                  </div>
                  <p className={`text-center font-semibold text-sm ${refundColor}`}>{refund}</p>
                  <p className="text-right text-muted-foreground text-sm">{fee}</p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
            * The exact policy for each booking is always displayed on the hotel page and in your booking confirmation. Hotel-specific terms may override the above.
          </p>
        </div>
      </section>

      {/* ── How to Cancel ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Step by Step</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">How to Cancel a Booking</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: CalendarDays,
                title: "Go to My Bookings",
                description: "Log in to your StayLux account and navigate to 'My Bookings' in your profile menu.",
              },
              {
                step: "02",
                icon: AlertCircle,
                title: "Select the Reservation",
                description: "Find the booking you wish to cancel and click on it to open the booking details.",
              },
              {
                step: "03",
                icon: XCircle,
                title: "Request Cancellation",
                description: "Click 'Cancel Booking' and review the applicable cancellation terms before confirming.",
              },
              {
                step: "04",
                icon: CreditCard,
                title: "Receive Your Refund",
                description: "Once confirmed, your refund (if applicable) will be returned to your original payment method.",
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative">
                <div className="bg-muted/40 rounded-2xl p-6 border border-border/50 h-full">
                  <span className="font-serif text-4xl font-bold text-primary/20 block mb-4 leading-none">{step}</span>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Questions & Answers</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Frequently Asked</h2>
            <p className="text-muted-foreground">
              Everything you need to know about cancelling or modifying a booking.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground text-sm mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full px-8 gap-2">
                <HelpCircle className="h-4 w-4" />
                Contact Our Support Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Book with Confidence
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Every StayLux booking comes with transparent terms and dedicated support. Your peace of mind is our priority.
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
