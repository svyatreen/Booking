import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Building2,
  Globe2,
  Star,
  Users,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  MapPin,
  Trophy,
  Leaf,
} from "lucide-react";

const stats = [
  { value: "43+", label: "Luxury Hotels", icon: Building2 },
  { value: "30+", label: "Countries", icon: Globe2 },
  { value: "4.8", label: "Average Rating", icon: Star },
  { value: "50k+", label: "Happy Guests", icon: Users },
];

const values = [
  {
    icon: Sparkles,
    title: "Uncompromising Quality",
    description:
      "Every hotel in our collection is hand-picked and vetted to meet our exacting standards — from thread-count to Michelin stars.",
  },
  {
    icon: HeartHandshake,
    title: "Genuine Hospitality",
    description:
      "We believe true luxury is about how you feel, not just what you see. Our partners share our passion for making guests feel at home, anywhere.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "No hidden fees. No surprises. We show you exactly what you're booking — real photos, real reviews, real prices.",
  },
  {
    icon: Leaf,
    title: "Responsible Travel",
    description:
      "We actively promote eco-certified properties and support initiatives that protect the destinations we all love to visit.",
  },
];

const team = [
  {
    name: "Isabelle Fontaine",
    role: "Founder & CEO",
    bio: "Former hospitality director with 20 years across Parisian palace hotels. Isabelle founded StayLux to bring insider access to every traveller.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    location: "Paris, France",
  },
  {
    name: "James Whitfield",
    role: "Head of Curation",
    bio: "Luxury travel journalist turned hotelier scout. James has personally inspected over 300 properties across six continents.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    location: "London, UK",
  },
  {
    name: "Yuki Tanaka",
    role: "Guest Experience Director",
    bio: "With roots in ryokan culture, Yuki leads our concierge team to craft bespoke itineraries that go far beyond the hotel room.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    location: "Tokyo, Japan",
  },
  {
    name: "Marco Esposito",
    role: "Partnerships Director",
    bio: "Former General Manager at three Relais & Châteaux properties, Marco builds lasting relationships with the world's finest hoteliers.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    location: "Rome, Italy",
  },
];

const milestones = [
  { year: "2016", title: "Founded in Paris", description: "StayLux was born from a simple idea — make the world's best hotels accessible to everyone." },
  { year: "2018", title: "50 Hotels Milestone", description: "Expanded our portfolio across Europe, with our first Asian partners joining the collection." },
  { year: "2020", title: "Global Reach", description: "Survived and thrived through challenging times, emerging with a stronger, more diverse portfolio." },
  { year: "2022", title: "Award-Winning Platform", description: "Named Best Luxury Travel Platform by Condé Nast Traveller readers for two consecutive years." },
  { year: "2024", title: "50,000 Guests Served", description: "A community of discerning travellers who trust StayLux for every extraordinary stay." },
];

export default function About() {
  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury hotel lobby"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Trophy className="h-4 w-4 text-amber-300" />
            Award-Winning Luxury Travel
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            StayLux was built by travellers, for travellers — with one unwavering belief: exceptional hospitality should be within everyone's reach.
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="h-7 w-7 opacity-80" />
                <span className="font-serif text-4xl font-bold">{value}</span>
                <span className="text-sm font-medium opacity-75 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Who We Are</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                A Curated World of Extraordinary Stays
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                Founded in 2016 in Paris, StayLux began as a small editorial project reviewing the world's finest independent hotels. Today we've grown into a trusted booking platform for discerning travellers across the globe.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Every property in our collection is personally inspected by our curation team. We reject over 80% of hotels that apply to join — because your time and money deserve only the best.
              </p>
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-8">
                  Explore Our Collection
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"
                alt="Luxury hotel suite"
                className="w-full h-[480px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-xl border border-border max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-medium text-foreground">"Flawlessly curated — every stay has been unforgettable."</p>
                <p className="text-xs text-muted-foreground mt-1">— Sarah M., London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} pl-16 md:pl-0`}>
                    <div className="bg-background border border-border rounded-xl p-5 shadow-sm inline-block text-left">
                      <span className="text-primary font-bold text-sm">{m.year}</span>
                      <h3 className="font-semibold text-foreground mt-1 mb-2">{m.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary ring-4 ring-background mt-5" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">The People Behind StayLux</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Meet the Team</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Hospitality veterans, travel writers and experience designers — united by an obsession with the perfect stay.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(({ name, role, bio, image, location }) => (
              <div
                key={name}
                className="bg-background rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground text-base">{name}</h3>
                  <p className="text-primary text-sm font-medium mt-0.5">{role}</p>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1 mb-3">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Ready for an Extraordinary Stay?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Browse our curated collection of 43+ luxury hotels across 30+ countries — and find your perfect match today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hotels">
                <Button size="lg" className="rounded-full px-10 text-base">
                  Explore Hotels
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="rounded-full px-10 text-base">
                  Join StayLux
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
