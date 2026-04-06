import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Cookie,
  ShieldCheck,
  BarChart2,
  Settings,
  XCircle,
  RefreshCw,
  Globe2,
  Lock,
  ChevronDown,
  ChevronUp,
  Building2,
  ToggleLeft,
  Info,
} from "lucide-react";
import { useState } from "react";

const lastUpdated = "1 April 2026";

const cookieTypes = [
  {
    icon: ShieldCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    badge: "Always Active",
    badgeColor: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    title: "Essential Cookies",
    description:
      "These cookies are strictly necessary for the StayLux platform to function. They enable core features such as authentication, session management, security, and booking checkout. You cannot opt out of essential cookies — without them, the website cannot operate.",
    examples: [
      { name: "session_id", purpose: "Keeps you logged in during your visit", duration: "Session" },
      { name: "csrf_token", purpose: "Protects against cross-site request forgery", duration: "Session" },
      { name: "cookie_consent", purpose: "Stores your cookie preferences", duration: "12 months" },
    ],
  },
  {
    icon: BarChart2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    badge: "Optional",
    badgeColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    title: "Analytics Cookies",
    description:
      "These cookies help us understand how visitors interact with our platform — which pages are most popular, where users drop off, and how we can improve the experience. All analytics data is aggregated and anonymised; we never use it to identify individual users.",
    examples: [
      { name: "_ga", purpose: "Google Analytics — distinguishes users", duration: "24 months" },
      { name: "_ga_*", purpose: "Google Analytics — maintains session state", duration: "24 months" },
      { name: "plausible_ignore", purpose: "Opt-out flag for internal analytics", duration: "Persistent" },
    ],
  },
  {
    icon: Settings,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    badge: "Optional",
    badgeColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    title: "Preference Cookies",
    description:
      "These cookies remember choices you make to personalise your experience — such as your preferred language, currency, theme (light/dark mode), and search filters. Without them, you'll need to re-enter your preferences each visit.",
    examples: [
      { name: "preferred_currency", purpose: "Saves your selected currency", duration: "12 months" },
      { name: "theme", purpose: "Remembers your light/dark mode choice", duration: "12 months" },
      { name: "search_filters", purpose: "Retains your last hotel search settings", duration: "30 days" },
    ],
  },
  {
    icon: XCircle,
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/30",
    border: "border-slate-200 dark:border-slate-700",
    badge: "Not used",
    badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
    title: "Marketing & Advertising Cookies",
    description:
      "StayLux does not use third-party advertising cookies or tracking pixels for retargeting purposes. We do not share your browsing behaviour with ad networks. You will not see StayLux ads following you around the internet as a result of cookies set on our platform.",
    examples: [],
  },
];

const sections = [
  {
    id: "what-are-cookies",
    icon: Info,
    title: "What Are Cookies?",
    content: `Cookies are small text files that are placed on your device (computer, phone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owner. Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (stored for a set period or until you delete them). We also use similar technologies such as local storage and session storage, which are covered by this policy.`,
  },
  {
    id: "how-we-use",
    icon: Cookie,
    title: "How We Use Cookies",
    content: `StayLux uses cookies for four main purposes: to make our platform work (essential), to understand how it is used (analytics), to remember your preferences (preference), and to keep your account and transactions secure (security). We do not use cookies for advertising or behavioural tracking. The full breakdown of each category, including specific cookie names, purposes, and retention periods, is detailed in the Cookie Types section above.`,
  },
  {
    id: "third-party",
    icon: Globe2,
    title: "Third-Party Cookies",
    content: `Some features of our platform involve third-party services that may set their own cookies. These include our payment processors (who use cookies to detect fraud and secure transactions) and our analytics provider. We vet all third-party partners carefully and require them to adhere to applicable data protection laws. Third-party cookies are subject to the privacy policies of the respective providers, not this Cookie Policy.`,
  },
  {
    id: "managing-cookies",
    icon: ToggleLeft,
    title: "Managing Your Cookie Preferences",
    content: `You can manage your cookie preferences at any time using the Cookie Settings panel accessible from the footer of this page. You may also control cookies through your browser settings — most browsers allow you to block, delete, or receive alerts about cookies. Please note that blocking essential cookies will affect the functionality of the StayLux platform and you may not be able to complete a booking. Instructions for managing cookies are available in the help section of your browser (Chrome, Firefox, Safari, Edge).`,
  },
  {
    id: "retention",
    icon: RefreshCw,
    title: "Cookie Retention Periods",
    content: `Session cookies are deleted automatically when you close your browser. Persistent cookies are stored for varying periods depending on their purpose — from 30 days (short-term preferences) to 24 months (analytics). You can view the retention period for each specific cookie in the Cookie Types table above. We review and update cookie retention periods annually to ensure they remain proportionate.`,
  },
  {
    id: "updates",
    icon: RefreshCw,
    title: "Updates to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. When we make significant changes, we will display a notice on our platform and, where appropriate, seek fresh consent. The date at the top of this page always shows when the policy was last revised.`,
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
        <span className="font-semibold text-foreground flex-1">{section.title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-border/50 pt-5">
          <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
        </div>
      )}
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=2000"
            alt="Cookie policy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/52 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Cookie className="h-4 w-4 text-amber-300" />
            Transparent by Design
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Cookie Policy
          </h1>
          <p className="text-white/80 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* ── Intro Banner ──────────────────────────────────────────────── */}
      <section className="py-14 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Our Approach</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                We keep it simple and honest
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                This Cookie Policy explains what cookies StayLux uses, why we use them, and how you can control them. We believe in full transparency — you should always know what's running on your device and why.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We only use cookies that are necessary for our platform to work, to improve your experience, and to understand how people use StayLux. We never use advertising or tracking cookies.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: "Essential cookies only — no ad tracking" },
                { icon: Lock, text: "No data sold to third parties" },
                { icon: ToggleLeft, text: "Full control via Cookie Settings" },
                { icon: Globe2, text: "GDPR & ePrivacy compliant" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-background border border-border/50 rounded-xl px-4 py-3 shadow-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cookie Types ──────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Cookie Categories</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Here is a complete breakdown of every category of cookie on our platform — including what we don't use.
            </p>
          </div>
          <div className="space-y-6">
            {cookieTypes.map(({ icon: Icon, color, bg, border, badge, badgeColor, title, description, examples }) => (
              <div key={title} className={`rounded-2xl border p-7 ${border} ${bg}`}>
                <div className="flex flex-wrap items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                        {badge}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
                {examples.length > 0 && (
                  <div className="mt-5 bg-background/70 rounded-xl border border-border/40 overflow-hidden">
                    <div className="grid grid-cols-3 gap-0 bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <span>Cookie name</span>
                      <span>Purpose</span>
                      <span className="text-right">Duration</span>
                    </div>
                    {examples.map(({ name, purpose, duration }, i) => (
                      <div
                        key={name}
                        className={`grid grid-cols-3 gap-4 px-4 py-3 items-center text-sm ${
                          i < examples.length - 1 ? "border-b border-border/30" : ""
                        }`}
                      >
                        <code className="font-mono text-xs text-primary bg-primary/8 px-2 py-0.5 rounded">{name}</code>
                        <span className="text-muted-foreground">{purpose}</span>
                        <span className="text-right text-muted-foreground">{duration}</span>
                      </div>
                    ))}
                  </div>
                )}
                {examples.length === 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    No cookies of this type are set on our platform.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detailed Sections ─────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Further Reading</p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Policy Details</h2>
          </div>
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <SectionBlock section={section} />
              </div>
            ))}
          </div>

          <div className="mt-10 bg-background border border-border/50 rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Questions about cookies?</span>{" "}
              Contact our privacy team at{" "}
              <a href="mailto:privacy@staylux.com" className="text-primary hover:underline">
                privacy@staylux.com
              </a>
              {" "}or write to us at StayLux SAS, 14 Rue du Faubourg Saint-Honoré, 75008 Paris, France.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Policies ──────────────────────────────────────────── */}
      <section className="py-16 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Also Read</p>
            <h2 className="font-serif text-3xl font-bold text-foreground">Related Policies</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                href: "/privacy-policy",
                icon: Lock,
                title: "Privacy Policy",
                description: "How we collect, use, and protect your personal data.",
              },
              {
                href: "/terms-of-service",
                icon: ShieldCheck,
                title: "Terms of Service",
                description: "The rules governing your use of the StayLux platform.",
              },
              {
                href: "/safety",
                icon: ShieldCheck,
                title: "Safety",
                description: "Our commitments to keeping your bookings secure.",
              },
            ].map(({ href, icon: Icon, title, description }) => (
              <Link key={href} href={href}>
                <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group h-full">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-background border border-border/50 rounded-3xl p-12 shadow-sm">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Book with Confidence
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Your privacy is built into everything we do. Explore our collection of luxury hotels knowing we respect your data.
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
