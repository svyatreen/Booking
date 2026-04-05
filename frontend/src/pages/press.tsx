import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Download,
  Mail,
  ExternalLink,
  Quote,
  Calendar,
  Trophy,
  Tv2,
} from "lucide-react";

const featuredCoverage = [
  {
    outlet: "Condé Nast Traveller",
    logo: "CNT",
    color: "bg-stone-800",
    date: "March 2025",
    title: "The 10 Best Hotel Booking Platforms of 2025",
    excerpt:
      "StayLux stands out from the crowd with its obsessive focus on curation — only the finest independent and boutique properties make the cut, making every search feel effortless.",
    url: "#",
    tag: "Featured",
  },
  {
    outlet: "Forbes Travel Guide",
    logo: "Forbes",
    color: "bg-blue-900",
    date: "January 2025",
    title: "How StayLux Is Redefining Luxury Hotel Discovery",
    excerpt:
      "In an era of endless choice, StayLux has taken the opposite approach: radical curation. The result is a platform where every listed property is genuinely worth your time and money.",
    url: "#",
    tag: "Cover Story",
  },
  {
    outlet: "The Financial Times",
    logo: "FT",
    color: "bg-pink-700",
    date: "November 2024",
    title: "Luxury Travel Platforms That Are Actually Worth It",
    excerpt:
      "Unlike aggregators that list everything under the sun, StayLux curates with conviction. Their rejection rate of over 80% is the highest in the industry — and guests feel the difference.",
    url: "#",
    tag: "Review",
  },
];

const pressReleases = [
  {
    date: "April 2025",
    title: "StayLux Surpasses 50,000 Guests Served Worldwide",
    summary: "The luxury travel platform celebrates a major milestone as it continues global expansion.",
  },
  {
    date: "February 2025",
    title: "StayLux Launches Sustainable Travel Initiative",
    summary: "New eco-certification badge programme highlights environmentally responsible properties across the portfolio.",
  },
  {
    date: "December 2024",
    title: "StayLux Named Best Luxury Booking Platform — Readers' Choice 2024",
    summary: "Condé Nast Traveller Readers' Choice Awards recognise StayLux for the second consecutive year.",
  },
  {
    date: "September 2024",
    title: "StayLux Expands to Southeast Asia with 12 New Properties",
    summary: "Singapore, Bali, and Bangkok welcome the platform's signature curated approach to luxury accommodation.",
  },
  {
    date: "June 2024",
    title: "StayLux Partners with Relais & Châteaux",
    summary: "Strategic partnership brings 30 iconic Relais & Châteaux properties exclusively to the StayLux platform.",
  },
  {
    date: "March 2024",
    title: "StayLux Raises Series B to Accelerate Global Curation",
    summary: "€24M funding round led by European luxury fund to expand the curation team and technology platform.",
  },
];

const awards = [
  { year: "2025", award: "Best Luxury Travel Platform", body: "World Travel Awards" },
  { year: "2024", award: "Readers' Choice — Best Hotel Booking", body: "Condé Nast Traveller" },
  { year: "2024", award: "Top 50 Travel Innovators", body: "Skift" },
  { year: "2023", award: "Editor's Pick — Luxury Tech", body: "Wallpaper*" },
  { year: "2023", award: "Best User Experience — Travel", body: "Webby Awards" },
  { year: "2022", award: "Rising Star in Luxury Hospitality", body: "Hospitality Tech Europe" },
];

const mediaAssets = [
  { label: "Brand Logos (SVG + PNG)", size: "2.4 MB", icon: Download },
  { label: "Press Kit PDF", size: "8.1 MB", icon: Download },
  { label: "Product Screenshots", size: "14.6 MB", icon: Download },
  { label: "Executive Headshots", size: "11.2 MB", icon: Download },
];

export default function Press() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000"
            alt="Press and media"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Newspaper className="h-4 w-4 text-amber-300" />
            Press &amp; Media
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow-lg">
            StayLux in the News
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-xl mx-auto">
            The world's leading travel publications trust StayLux. Find our latest coverage, press releases, awards and media resources all in one place.
          </p>
        </div>
      </section>

      {/* ── Featured Coverage ─────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">As Seen In</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Featured Coverage</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCoverage.map(({ outlet, logo, color, date, title, excerpt, url, tag }) => (
              <div
                key={outlet}
                className="bg-background border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
              >
                <div className={`${color} px-6 py-5 flex items-center justify-between`}>
                  <span className="font-serif text-lg font-bold text-white">{logo}</span>
                  <Badge className="bg-white/20 text-white border-0 text-xs">{tag}</Badge>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {date}
                  </div>
                  <h3 className="font-semibold text-foreground text-base leading-snug mb-3">{title}</h3>
                  <div className="relative mb-5 flex-1">
                    <Quote className="h-6 w-6 text-primary/20 mb-1" />
                    <p className="text-muted-foreground text-sm leading-relaxed italic">{excerpt}</p>
                  </div>
                  <a
                    href={url}
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                  >
                    Read full article <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Recognition</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Awards &amp; Honours</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {awards.map(({ year, award, body }) => (
              <div
                key={award}
                className="bg-background border border-border/50 rounded-xl p-5 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{year} · {body}</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">{award}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Releases ────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Latest News</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Press Releases</h2>
          </div>
          <div className="space-y-4">
            {pressReleases.map(({ date, title, summary }) => (
              <div
                key={title}
                className="group bg-background border border-border/50 rounded-xl p-6 flex gap-5 items-start hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="hidden sm:flex h-12 w-12 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-1">{date}</p>
                  <h3 className="font-semibold text-foreground text-base leading-snug mb-1.5 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Kit ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Media Resources</p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-5">Download Our Media Kit</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Journalists and media professionals can download our complete brand assets, including high-resolution logos, product screenshots, and executive portraits.
              </p>
              <div className="space-y-3">
                {mediaAssets.map(({ label, size, icon: Icon }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-4 bg-background border border-border/60 rounded-xl px-5 py-4 hover:border-primary/50 hover:shadow-sm transition-all group text-left"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{size}</p>
                    </div>
                    <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&q=80&w=800"
                alt="Press and media resources"
                className="w-full h-[420px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-5 -right-5 bg-primary text-primary-foreground rounded-xl px-5 py-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Tv2 className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-medium opacity-80">Coverage in</p>
                    <p className="text-lg font-bold">50+ outlets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Press Contact ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Press Enquiries
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              Our communications team is available for interviews, comments, and media partnerships. We aim to respond to all press enquiries within 24 hours.
            </p>
            <div className="bg-background border border-border rounded-xl p-5 mb-8 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Press contact</p>
              <p className="font-semibold text-foreground">press@staylux.com</p>
            </div>
            <div className="block">
              <Button size="lg" className="rounded-full px-10 text-base">
                <Mail className="mr-2 h-4 w-4" />
                Contact Press Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
