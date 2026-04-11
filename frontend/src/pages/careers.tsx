import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Clock,
  Briefcase,
  Globe2,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Plane,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const perks = [
  {
    icon: Plane,
    title: 'Travel Stipend',
    description:
      "€3,000 per year to stay at hotels in our collection — because you can't curate what you haven't experienced.",
  },
  {
    icon: Globe2,
    title: 'Remote-First',
    description:
      'Work from wherever you do your best thinking. We have team members across 12 countries and four time zones.',
  },
  {
    icon: TrendingUp,
    title: 'Growth & Learning',
    description:
      '€1,500 annual budget for courses, conferences, and books. We invest in your development as much as you do.',
  },
  {
    icon: HeartHandshake,
    title: 'Generous Leave',
    description:
      '35 days of paid leave per year — including your birthday off, no questions asked.',
  },
  {
    icon: Sparkles,
    title: 'Equity for Everyone',
    description:
      'All full-time employees receive stock options. When Selora grows, everyone benefits.',
  },
  {
    icon: Users,
    title: 'Diverse & Inclusive',
    description:
      'Our team spans 18 nationalities and speaks 24 languages. Different perspectives make us stronger.',
  },
];

type Department =
  | 'All'
  | 'Curation'
  | 'Engineering'
  | 'Design'
  | 'Marketing'
  | 'Operations';

const openings: {
  title: string;
  department: Department;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}[] = [
  {
    title: 'Senior Hotel Curator — Asia Pacific',
    department: 'Curation',
    location: 'Remote (APAC)',
    type: 'Full-time',
    description:
      "You'll scout, evaluate, and onboard new properties across Southeast and East Asia. Expect frequent travel, deep relationships with GMs, and the satisfaction of finding hidden gems before anyone else does.",
    requirements: [
      '5+ years in luxury hospitality (hotel management, travel media, or similar)',
      'Fluency in English + one Asian language',
      'Willingness to travel up to 50% of the time',
      'Sharp eye for authentic luxury vs. superficial opulence',
    ],
  },
  {
    title: 'Full-Stack Engineer (React / Node)',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    description:
      "Join the team building the platform that thousands of travellers trust to plan their most important trips. You'll work on search, personalisation, booking flows, and the internal tools our curation team relies on.",
    requirements: [
      '3+ years with React and TypeScript',
      'Solid Node.js / Express experience',
      'Comfort with PostgreSQL and RESTful API design',
      'Appreciation for clean, maintainable code',
    ],
  },
  {
    title: 'Lead Product Designer',
    department: 'Design',
    location: 'Paris or Remote',
    type: 'Full-time',
    description:
      "Own the end-to-end design of Selora — from first impression to post-checkout. You'll define our design language, lead user research, and work shoulder-to-shoulder with engineering to ship beautiful, functional experiences.",
    requirements: [
      'Portfolio showing strong interaction and visual design',
      'Experience with Figma and modern design systems',
      'User research and usability testing experience',
      'Luxury or travel category experience is a bonus',
    ],
  },
  {
    title: 'Content & SEO Strategist',
    department: 'Marketing',
    location: 'Remote (EU)',
    type: 'Full-time',
    description:
      "You'll own our editorial calendar, grow organic traffic, and ensure every word on Selora reflects our voice — authoritative, warm, and never stuffy. Our blog reaches 200k monthly readers and we want to double that.",
    requirements: [
      'Proven track record growing organic search traffic',
      'Exceptional writing and editing in English',
      'Experience with content strategy for travel or lifestyle brands',
      'Familiarity with SEO tools (Ahrefs, Semrush, etc.)',
    ],
  },
  {
    title: 'Hotel Partnerships Manager',
    department: 'Operations',
    location: 'London or Remote',
    type: 'Full-time',
    description:
      "You'll manage relationships with 40+ hotel partners — negotiating rates, resolving issues, and ensuring every property in our collection continues to meet our standards. You're the bridge between hoteliers and our guests.",
    requirements: [
      '3+ years in hotel partnerships, revenue management, or OTA relations',
      'Strong negotiation and relationship-building skills',
      'Data-comfortable — you can analyse booking performance and spot trends',
      'European language skills are a strong plus',
    ],
  },
  {
    title: 'Junior Curator (Internship)',
    department: 'Curation',
    location: 'Paris (Hybrid)',
    type: 'Internship · 6 months',
    description:
      "A rare opportunity to learn hotel curation from the inside. You'll assist senior curators, conduct desk research on new markets, write property briefs, and occasionally join inspection trips.",
    requirements: [
      'Passion for travel and luxury hospitality',
      'Strong research and writing skills in English',
      'Based in or able to relocate to Paris for the duration',
      'Currently enrolled in a relevant degree programme',
    ],
  },
];

const deptColors: Record<Department, string> = {
  All: '',
  Curation:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Engineering:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Design:
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  Marketing: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Operations:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const departments: Department[] = [
  'All',
  'Curation',
  'Engineering',
  'Design',
  'Marketing',
  'Operations',
];

export default function Careers() {
  const [activedept, setActivedept] = useState<Department>('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = openings.filter((job) => {
    const matchDept = activedept === 'All' || job.department === activedept;
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[440px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
            alt="Team working together"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Briefcase className="h-4 w-4 text-amber-300" />
            Join the Team
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow-lg">
            Build the Future of Luxury Travel
          </h1>
          <p className="text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
            We're a small, ambitious team obsessed with making exceptional hotel
            stays accessible to every discerning traveller. Come help us do it.
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '42', label: 'Team Members' },
              { value: '18', label: 'Nationalities' },
              { value: '12', label: 'Countries' },
              { value: '4.9★', label: 'Glassdoor Rating' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-4xl font-bold">{value}</p>
                <p className="text-sm font-medium opacity-75 uppercase tracking-wide mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Why Selora
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Life at Selora
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              We believe the people who build the best travel platform deserve
              the best experience too.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {perks.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-background border border-border/50 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Photo ────────────────────────────────────────────────── */}
      <section className="py-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-64 md:h-80 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
                alt="Team collaboration"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex-1 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600"
                  alt="Team meeting"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600"
                  alt="Remote work"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Positions ────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
              Now Hiring
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Open Positions
            </h2>
          </div>

          {/* Filter row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActivedept(dept)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    activedept === dept
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Job list */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg">
                No positions match your search.
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setActivedept('All');
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((job) => {
                const isOpen = expanded === job.title;
                return (
                  <div
                    key={job.title}
                    className="bg-background border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex items-start gap-4"
                      onClick={() => setExpanded(isOpen ? null : job.title)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${deptColors[job.department]}`}
                          >
                            {job.department}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {job.type}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-base leading-snug">
                          {job.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 border-t border-border/50 pt-5">
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                          {job.description}
                        </p>
                        <h4 className="text-sm font-semibold text-foreground mb-3">
                          What we're looking for:
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {job.requirements.map((req) => (
                            <li
                              key={req}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                        <Button className="rounded-full px-7">
                          Apply for this role
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Open Application ──────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Don't See Your Role?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              We're always interested in exceptional people, even when we don't
              have a specific opening. Send us your CV and tell us how you'd
              contribute to Selora.
            </p>
            <Button size="lg" className="rounded-full px-10 text-base">
              Send an Open Application
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
