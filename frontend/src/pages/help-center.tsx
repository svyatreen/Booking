import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CreditCard,
  CalendarX,
  Star,
  ShieldCheck,
  User,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

const categories = [
  {
    icon: BookOpen,
    label: 'Booking',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    count: 12,
  },
  {
    icon: CreditCard,
    label: 'Payments',
    color:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    count: 8,
  },
  {
    icon: CalendarX,
    label: 'Cancellations',
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
    count: 6,
  },
  {
    icon: Star,
    label: 'Reviews',
    color:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    count: 5,
  },
  {
    icon: User,
    label: 'Account',
    color:
      'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
    count: 9,
  },
  {
    icon: ShieldCheck,
    label: 'Safety',
    color:
      'bg-stone-100 text-stone-600 dark:bg-stone-900/30 dark:text-stone-300',
    count: 4,
  },
];

const faqs = [
  {
    category: 'Booking',
    question: 'How do I make a reservation?',
    answer:
      "Browse our hotel collection, choose your dates and room type, then click 'Book Now'. You'll be guided through a simple checkout — enter your details, select any extras, and confirm your booking. You'll receive an instant confirmation email.",
  },
  {
    category: 'Booking',
    question: 'Can I book for someone else?',
    answer:
      "Yes. During checkout, enter the guest's name in the 'Primary Guest' field. The booking confirmation will be sent to your email address, and you can forward it to the guest. Please ensure the name matches their government-issued ID.",
  },
  {
    category: 'Booking',
    question: 'How far in advance can I book?',
    answer:
      'Most hotels on Selora allow bookings up to 12 months in advance. Some exclusive properties offer up to 18 months. For popular dates (Christmas, New Year, major events), we strongly recommend booking as early as possible.',
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as Apple Pay and Google Pay. All transactions are secured with 256-bit SSL encryption. We do not store full card details on our servers.',
  },
  {
    category: 'Payments',
    question: 'When will I be charged?',
    answer:
      "This depends on the rate you choose. 'Pay Now' rates are charged immediately and are usually cheaper. 'Pay Later' rates are charged 48 hours before check-in. Fully flexible rates may be charged at check-in by the hotel directly.",
  },
  {
    category: 'Payments',
    question: 'Is my payment secure?',
    answer:
      'Absolutely. Selora is PCI-DSS compliant and all payments are processed through our certified payment partner. Your card details are encrypted end-to-end. We are also 3D Secure enabled for an extra layer of protection.',
  },
  {
    category: 'Cancellations',
    question: 'What is the cancellation policy?',
    answer:
      'Cancellation policies vary by hotel and rate type. The policy applicable to your booking is clearly shown before you confirm. Flexible rates allow free cancellation up to 48 hours before check-in. Non-refundable rates cannot be cancelled or modified.',
  },
  {
    category: 'Cancellations',
    question: 'How do I cancel my booking?',
    answer:
      "Go to Profile → My Bookings, find the reservation and click 'Cancel Booking'. If the cancellation is within the free window, your refund will be processed within 5–10 business days. If outside the window, the cancellation fee will apply as stated in your booking.",
  },
  {
    category: 'Cancellations',
    question: 'Can I modify my booking dates?',
    answer:
      'Date modifications are subject to availability and the rate conditions. For flexible rates, you can modify dates free of charge. Go to Profile → My Bookings → Modify. For non-flexible rates, contact our support team who will advise on options.',
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer:
      "On the login page, click 'Forgot password?'. Enter your email address and we'll send you a secure reset link valid for 1 hour. If you don't receive the email, check your spam folder or contact our support team.",
  },
  {
    category: 'Account',
    question: 'How do I add a hotel to Favourites?',
    answer:
      'Click the heart icon on any hotel card or hotel detail page. Your favourites are saved to your account and accessible from the Favourites page. You must be logged in to save favourites.',
  },
  {
    category: 'Reviews',
    question: 'How do I leave a review?',
    answer:
      "After your stay, you'll receive an email invitation to leave a review. You can also go to Profile → My Bookings and click 'Leave a Review' on completed stays. Reviews must be submitted within 30 days of check-out.",
  },
  {
    category: 'Reviews',
    question: 'Can I edit or delete my review?',
    answer:
      'You can edit your review within 72 hours of submission by going to Profile → My Reviews. After 72 hours, reviews are locked to ensure authenticity. To report a problem with a review, contact our support team.',
  },
  {
    category: 'Safety',
    question: 'How does Selora verify its hotels?',
    answer:
      'Every hotel undergoes a rigorous multi-step vetting process: desktop research, guest feedback analysis, and an on-site inspection by our curation team. We reject over 80% of applicants. Hotels are re-evaluated annually.',
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = faqs.filter((faq) => {
    const matchCat =
      activeCategory === 'All' || faq.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            Help Center
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow">
            How Can We Help?
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Search our knowledge base or browse by topic below.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-base bg-background text-foreground rounded-xl shadow-lg border-0"
            />
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[
              {
                icon: BookOpen,
                label: 'All',
                color: 'bg-primary/10 text-primary',
                count: faqs.length,
              },
              ...categories,
            ].map(({ icon: Icon, label, color, count }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center ${
                  activeCategory === label
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/50 bg-background hover:border-primary/40 hover:shadow-sm'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {count} articles
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {search && (
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-foreground">"{search}"</span>
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg mb-4">
                No articles match your search.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq) => {
                const isOpen = expanded === faq.question;
                return (
                  <div
                    key={faq.question}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      isOpen
                        ? 'border-primary/40 shadow-sm'
                        : 'border-border/50'
                    } bg-background`}
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex items-start gap-4"
                      onClick={() => setExpanded(isOpen ? null : faq.question)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary">
                            {faq.category}
                          </span>
                        </div>
                        <p className="font-semibold text-foreground text-base leading-snug">
                          {faq.question}
                        </p>
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 border-t border-border/40 pt-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Contact Support ───────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Still Need Help?
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground">
              Contact Our Support Team
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Our team of hospitality specialists is available around the clock
              to assist you.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Live Chat */}
            <div className="bg-background border border-border/50 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-2">
                Live Chat
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Chat with a support specialist in real time. Fastest response
                for urgent queries.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium mb-5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Available now
              </div>
              <Button className="w-full rounded-lg">Start Chat</Button>
            </div>

            {/* Email */}
            <div className="bg-background border border-border/50 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-2">
                Email Support
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Send us a detailed message and we'll get back to you with a
                thorough response.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium mb-5">
                <Clock className="h-3.5 w-3.5" />
                Typically within 4 hours
              </div>
              <Link href="/contact">
                <Button variant="outline" className="w-full rounded-lg">
                  Send Email
                </Button>
              </Link>
            </div>

            {/* Phone */}
            <div className="bg-background border border-border/50 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-base mb-2">
                Phone Support
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Speak directly with a specialist for complex bookings or urgent
                travel issues.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium mb-5">
                <Clock className="h-3.5 w-3.5" />
                Mon – Sun, 08:00–22:00 CET
              </div>
              <Button variant="outline" className="w-full rounded-lg">
                +33 1 23 45 67 89
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Topics ────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-t border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">
            Popular Topics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'How to cancel a booking',
              'Payment not going through',
              'How to get a room upgrade',
              'Changing my check-in date',
              'Downloading my invoice',
              'Setting up favourites',
              'Leaving a review after checkout',
              'Forgotten password',
              'Booking for a corporate trip',
            ].map((topic) => (
              <button
                key={topic}
                onClick={() =>
                  setSearch(topic.split(' ').slice(0, 3).join(' '))
                }
                className="flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/30 transition-all text-sm text-foreground group"
              >
                <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
