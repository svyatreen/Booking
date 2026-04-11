import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Accessibility,
  Eye,
  Ear,
  MousePointer2,
  Brain,
  Monitor,
  Smartphone,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  HeartHandshake,
  Globe2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

const lastUpdated = '1 April 2026';

const commitments = [
  {
    icon: Eye,
    title: 'Visual Accessibility',
    description:
      'All text meets WCAG AA contrast ratios. Images include descriptive alt text. Our interface supports zoom up to 200% without loss of content or functionality. We offer a light and dark theme to reduce eye strain.',
    features: [
      'AA contrast compliance',
      'Full alt text coverage',
      '200% zoom support',
      'Dark mode',
    ],
  },
  {
    icon: Ear,
    title: 'Auditory Accessibility',
    description:
      'Our platform does not rely solely on audio cues to convey information. All interactive feedback is also provided visually. We do not use auto-playing audio or video with sound.',
    features: [
      'No audio-only content',
      'Visual alert alternatives',
      'No auto-play sound',
      'Captions on video',
    ],
  },
  {
    icon: MousePointer2,
    title: 'Motor & Navigation',
    description:
      'Every feature on Selora is accessible via keyboard navigation alone. We use logical tab order, visible focus indicators, and skip-to-content links. All interactive elements have a minimum touch target of 44×44px.',
    features: [
      'Full keyboard navigation',
      'Visible focus rings',
      'Skip-to-content links',
      '44px touch targets',
    ],
  },
  {
    icon: Brain,
    title: 'Cognitive Accessibility',
    description:
      'We write in plain, clear language and keep our interfaces uncluttered. Important actions are labelled explicitly, and we avoid time-limited interactions wherever possible. Error messages are descriptive and suggest next steps.',
    features: [
      'Plain language',
      'Descriptive error messages',
      'No time pressure',
      'Consistent layouts',
    ],
  },
  {
    icon: Monitor,
    title: 'Screen Reader Support',
    description:
      'Selora is built with semantic HTML and ARIA landmarks so screen readers can interpret every page correctly. We test regularly with NVDA, JAWS, and VoiceOver across desktop and mobile platforms.',
    features: [
      'Semantic HTML',
      'ARIA landmarks',
      'NVDA & JAWS tested',
      'VoiceOver compatible',
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile Accessibility',
    description:
      'Our responsive design works seamlessly with iOS VoiceOver and Android TalkBack. Text reflows correctly at any screen size, and gestures are never the only way to perform an action.',
    features: [
      'iOS VoiceOver ready',
      'Android TalkBack ready',
      'Responsive text reflow',
      'No gesture-only actions',
    ],
  },
];

const standards = [
  {
    code: 'WCAG 2.1 AA',
    title: 'Web Content Accessibility Guidelines',
    description:
      'Our target conformance level for all new and updated features on the Selora platform.',
    status: 'Target standard',
    statusColor: 'text-primary bg-primary/10',
  },
  {
    code: 'EN 301 549',
    title: 'European Accessibility Standard',
    description:
      'The EU standard for ICT accessibility, aligned with WCAG 2.1 AA, applicable to our EU user base.',
    status: 'Compliant',
    statusColor:
      'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  },
  {
    code: 'ARIA 1.2',
    title: 'Accessible Rich Internet Applications',
    description:
      'We follow WAI-ARIA 1.2 specifications for dynamic and interactive content throughout the platform.',
    status: 'Implemented',
    statusColor:
      'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  },
  {
    code: 'Section 508',
    title: 'US Federal Accessibility Standard',
    description:
      'We align with Section 508 requirements to serve users in the United States, including those using assistive technologies.',
    status: 'Aligned',
    statusColor:
      'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  },
];

const hotelFeatures = [
  { icon: CheckCircle2, text: 'Wheelchair-accessible rooms and public areas' },
  { icon: CheckCircle2, text: 'Step-free entrances and lifts' },
  {
    icon: CheckCircle2,
    text: 'Accessible bathrooms with grab rails and roll-in showers',
  },
  { icon: CheckCircle2, text: 'Visual fire alarms and vibrating bed alerts' },
  { icon: CheckCircle2, text: 'Text telephone (TTY) or video relay services' },
  { icon: CheckCircle2, text: 'Hearing loops in public areas' },
  { icon: CheckCircle2, text: 'Braille or large-print menus on request' },
  { icon: CheckCircle2, text: 'Service animal-friendly rooms and facilities' },
];

const faqs = [
  {
    question: 'How do I request an accessible room?',
    answer:
      'On any hotel detail page, look for the Accessibility section which lists all available features. When booking, use the Special Requests field to specify your needs. You can also contact our support team directly and we will liaise with the hotel on your behalf.',
  },
  {
    question: 'Are accessibility features verified?',
    answer:
      'Yes. Our curation team verifies accessibility information provided by hotel partners. We visit properties in person and cross-reference claims with guest reviews. Where information is unverified, we clearly mark it as self-reported by the hotel.',
  },
  {
    question: 'What if I need help completing a booking?',
    answer:
      'Our support team is available by phone, live chat, and email to assist with any booking. If you need help navigating the website, we can complete the booking on your behalf — just call us or start a live chat session.',
  },
  {
    question: 'Can I filter hotels by accessibility features?',
    answer:
      'Yes. On the Hotels search page, use the Accessibility filter to show only properties with specific features — such as wheelchair access, accessible bathrooms, or hearing loops. We are continually expanding our filter options.',
  },
  {
    question: 'How do you test for accessibility?',
    answer:
      'We conduct accessibility testing at multiple stages: automated scans using axe-core during development, manual keyboard and screen reader testing with NVDA, JAWS, and VoiceOver, and periodic third-party accessibility audits. Issues are logged and prioritised in our bug tracking system.',
  },
  {
    question: 'How do I report an accessibility problem?',
    answer:
      'Please use our Accessibility Feedback form below or email us at accessibility@selora.com. Include a description of the issue, the page or feature affected, and the assistive technology you are using. We aim to acknowledge all reports within 2 business days and resolve critical issues within 14 days.',
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

export default function AccessibilityPage() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?auto=format&fit=crop&q=80&w=2000"
            alt="Accessibility"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/72" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Accessibility className="h-4 w-4 text-amber-300" />
            Inclusive by Design
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Accessibility
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            Selora is built for everyone. We are committed to making luxury
            travel accessible to all guests, regardless of disability or
            assistive technology.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: CheckCircle2,
                value: 'WCAG 2.1',
                label: 'Target AA level',
              },
              { icon: Monitor, value: '3', label: 'Screen readers tested' },
              { icon: Globe2, value: 'EN 301 549', label: 'EU compliant' },
              {
                icon: HeartHandshake,
                value: '24/7',
                label: 'Accessibility support',
              },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="h-7 w-7 opacity-80" />
                <span className="font-serif text-2xl md:text-3xl font-bold">
                  {value}
                </span>
                <span className="text-sm font-medium opacity-75 uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commitment Statement ──────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                Our Commitment
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                Travel without barriers
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                We believe that exceptional hospitality must be inclusive.
                Whether you use a screen reader, navigate by keyboard, or
                require specific hotel facilities, Selora is designed to support
                you at every step.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Our engineering and design teams follow accessibility best
                practices from the first line of code. We test with real
                assistive technologies and consult with users who have
                disabilities to continuously improve our platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This is an ongoing commitment. If something doesn't work for
                you, we want to know — and we will fix it.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                alt="Inclusive design"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-5 -left-5 bg-background rounded-xl p-4 shadow-xl border border-border max-w-[210px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HeartHandshake className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    Inclusive First
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Accessibility is a core design principle, not an afterthought.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accessibility Features ────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Platform Features
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Built for Every User
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From screen readers to motor navigation, we've addressed the full
              spectrum of accessibility needs across our platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map(({ icon: Icon, title, description, features }) => (
              <div
                key={title}
                className="bg-background rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                  {description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-primary/8 text-primary font-medium px-2.5 py-1 rounded-full border border-primary/15"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Standards ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Compliance
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Standards We Follow
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Our accessibility programme is benchmarked against the leading
              international standards for digital inclusion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {standards.map(
              ({ code, title, description, status, statusColor }) => (
                <div
                  key={code}
                  className="bg-muted/30 border border-border/50 rounded-2xl p-6 flex gap-5 items-start hover:shadow-sm transition-shadow"
                >
                  <div className="h-12 w-12 rounded-xl bg-background border border-border/50 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{code}</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Hotel Accessibility ───────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                At Our Hotels
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                Accessible Hotel Features
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                We clearly display accessibility information for every hotel in
                our collection. Our hotel partners provide details on physical
                access, assistive facilities, and services available to guests
                with disabilities.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                If you need specific facilities not listed on a hotel page,
                contact our support team before booking. We will verify directly
                with the property and help you find the best match for your
                needs.
              </p>
              <Link href="/contact">
                <Button className="rounded-full px-8 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Talk to Our Team
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {hotelFeatures.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-background border border-border/50 rounded-xl px-5 py-3.5 shadow-sm"
                >
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Known Limitations ─────────────────────────────────────────── */}
      <section className="py-16 bg-background border-y border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Known Limitations & Ongoing Work
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  While we strive for full WCAG 2.1 AA compliance, some areas of
                  our platform are still being improved. Current known
                  limitations include: complex date picker interactions on older
                  browsers, some third-party map embeds that lack full screen
                  reader support, and certain PDF documents that are not yet
                  screen-reader optimised.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We are actively working to resolve all known issues. If you
                  encounter a barrier not listed here, please report it — your
                  feedback directly shapes our accessibility roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Common Questions
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Accessibility FAQs
            </h2>
            <p className="text-muted-foreground">
              Answers to the most common questions about accessibility on our
              platform and at our hotels.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Feedback ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">
                    Send Us Accessibility Feedback
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  Found a barrier? Something that doesn't work with your
                  assistive technology? We want to hear from you. Every report
                  helps us build a more inclusive platform for everyone.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    accessibility@selora.com
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Response within 2 business days
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8">
                    Contact Us
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
              Luxury Travel for Everyone
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Browse our collection of 43+ verified luxury hotels, filtered by
              the accessibility features that matter most to you.
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
                  Get Personal Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
