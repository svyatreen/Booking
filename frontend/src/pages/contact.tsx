import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'wouter';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  Building2,
  Globe2,
} from 'lucide-react';

const topics = [
  'Booking enquiry',
  'Payment issue',
  'Cancellation request',
  'Existing reservation',
  'Room upgrade request',
  'Corporate / group booking',
  'Partnership enquiry',
  'Press & media',
  'Technical issue',
  'Other',
];

const offices = [
  {
    city: 'Paris',
    flag: '🇫🇷',
    address: '14 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    phone: '+33 1 23 45 67 89',
    email: 'paris@selora.com',
    hours: 'Mon – Fri, 09:00 – 18:00 CET',
  },
  {
    city: 'London',
    flag: '🇬🇧',
    address: '42 Berkeley Square, Mayfair, London W1J 5AW, UK',
    phone: '+44 20 7946 0123',
    email: 'london@selora.com',
    hours: 'Mon – Fri, 09:00 – 18:00 GMT',
  },
  {
    city: 'New York',
    flag: '🇺🇸',
    address: '350 Fifth Avenue, Suite 4100, New York, NY 10118, USA',
    phone: '+1 212 555 0147',
    email: 'newyork@selora.com',
    hours: 'Mon – Fri, 09:00 – 18:00 EST',
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: '',
    bookingRef: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000"
            alt="Contact us"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Mail className="h-4 w-4 text-amber-300" />
            Get in Touch
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            We'd love to hear from you. Our team is here to help with anything
            you need.
          </p>
        </div>
      </section>

      {/* ── Quick Contact Cards ───────────────────────────────────────── */}
      <section className="py-14 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-3 gap-5">
            {/* Live Chat */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Available now
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Instant help from a specialist.
              </p>
              <Button size="sm" className="w-full rounded-lg">
                Start Chat
              </Button>
            </div>

            {/* Email */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Email</h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
                <Clock className="h-3.5 w-3.5" />
                Reply within 4 hours
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                support@selora.com
              </p>
              <Button size="sm" variant="outline" className="w-full rounded-lg">
                Send Email
              </Button>
            </div>

            {/* Phone */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Phone</h3>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
                <Clock className="h-3.5 w-3.5" />
                08:00 – 22:00 CET
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                +33 1 23 45 67 89
              </p>
              <Button size="sm" variant="outline" className="w-full rounded-lg">
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ──────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-14 items-start">
            {/* Left — Info */}
            <div className="lg:col-span-2">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                Write to Us
              </p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5 leading-tight">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Fill in the form and our team will get back to you within a few
                hours. For urgent booking matters, we recommend calling or using
                live chat.
              </p>

              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Response Time
                    </p>
                    <p className="text-muted-foreground text-sm">
                      General enquiries: within 4 hours
                      <br />
                      Urgent bookings: within 1 hour
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Languages
                    </p>
                    <p className="text-muted-foreground text-sm">
                      English, French, Spanish, Italian, German, Japanese
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Before You Write
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Check our{' '}
                      <Link
                        href="/help-center"
                        className="text-primary hover:underline"
                      >
                        Help Center
                      </Link>{' '}
                      — most answers are already there.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-10 text-center">
                  <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-5" />
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Thank you,{' '}
                    <span className="font-medium text-foreground">
                      {form.name}
                    </span>
                    . We've received your message and will reply to{' '}
                    <span className="font-medium text-foreground">
                      {form.email}
                    </span>{' '}
                    within 4 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full px-8"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        topic: '',
                        bookingRef: '',
                        message: '',
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Isabelle Fontaine"
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email Address{' '}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Topic
                      </label>
                      <select
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select a topic…</option>
                        {topics.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Booking Reference
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          (optional)
                        </span>
                      </label>
                      <Input
                        name="bookingRef"
                        value={form.bookingRef}
                        onChange={handleChange}
                        placeholder="e.g. SL-2025-00412"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help…"
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                      Fields marked <span className="text-destructive">*</span>{' '}
                      are required.
                    </p>
                    <Button
                      type="submit"
                      className="rounded-full px-8"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Offices ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Our Offices
            </p>
            <h2 className="font-serif text-4xl font-bold text-foreground">
              Find Us Around the World
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {offices.map(({ city, flag, address, phone, email, hours }) => (
              <div
                key={city}
                className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{flag}</span>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      {city}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Regional Office
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2.5 items-start text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary/60" />
                    <span className="leading-relaxed">{address}</span>
                  </div>
                  <div className="flex gap-2.5 items-center text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0 text-primary/60" />
                    <span>{phone}</span>
                  </div>
                  <div className="flex gap-2.5 items-center text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0 text-primary/60" />
                    <span>{email}</span>
                  </div>
                  <div className="flex gap-2.5 items-center text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0 text-primary/60" />
                    <span>{hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
