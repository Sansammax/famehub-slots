import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Calendar, Users, Award, Briefcase, Quote } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ─── Scroll-reveal hook ──────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useReveal() as React.RefObject<HTMLDivElement>;
  return (
    <div
      ref={ref}
      className={`reveal ${delay ? `reveal-delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Data ────────────────────────────────────────────────────────────── */
const stats = [
  { icon: Users, value: "1000+", label: "Students Trained" },
  { icon: Briefcase, value: "20+", label: "Colleges Served" },
  { icon: Award, value: "94%", label: "Placement Rate" },
  { icon: Calendar, value: "180+", label: "Sessions Delivered" },
];

const colleges = [
  "Lovely Professional University", "Chandigarh University", "Dayananda Sagar College of Engineering", "VIT Vellore",
  "NIT Trichy", "Anna University", "SRM University", "PSG Tech",
];

const trainers = [
  { name: "Aarav Mehta", role: "Senior Engineer", company: "Ex-Google", expertise: "System Design, DSA", years: "12 yrs", tags: ["System Design", "DSA", "Distributed"] },
  { name: "Priya Iyer", role: "Product Lead", company: "Ex-Stripe", expertise: "Product Thinking, UX", years: "10 yrs", tags: ["Product", "UX Strategy", "Growth"] },
  { name: "Rohan Kapoor", role: "ML Architect", company: "Ex-Meta", expertise: "ML, Deep Learning", years: "9 yrs", tags: ["ML", "Deep Learning", "GenAI"] },
];

const testimonials = [
  {
    quote: "FameHub transformed our campus placement prep. Students came out with real interview confidence — not just textbook knowledge.",
    author: "Dr.Sanjay",
    role: "Training & Placement Officer",
    college: "Lovely Professional University",
    initials: "RK",
  },
  {
    quote: "The booking process was seamless and the trainer matched exactly what our final-year batch needed. Highly recommend.",
    author: "Prof. Anita Desai",
    role: "Dean, Engineering",
    college: "Dayananda Sagar College of Engineering",
    initials: "AD",
  },
];

/* ─── Page ────────────────────────────────────────────────────────────── */
function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-25"
            style={{ background: "radial-gradient(ellipse, oklch(0.7 0.18 275), transparent 70%)" }}
          />
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-20 sm:pt-28 sm:pb-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary shadow-soft mb-7 hover:bg-primary/10 transition-base cursor-default">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 200+ engineering colleges
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.06]">
              Elite Industry Training
              <br />
              <span className="text-gradient">for Colleges</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Book a dedicated training day for your campus. Senior practitioners from Google, Stripe &amp; Meta — delivered to your students.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild size="lg"
                className="group bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated hover:scale-[1.03] transition-all duration-200 h-13 px-8 text-base rounded-xl"
              >
                <Link to="/book">
                  Book a Training Day
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild variant="outline" size="lg"
                className="h-13 px-8 text-base border-border bg-card hover:bg-surface-soft hover:border-primary/30 rounded-xl transition-base"
              >
                <Link to="/trainers">Meet Our Trainers</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Trust Strip ── */}
        <section className="border-y border-border/60 bg-surface-soft/50 py-5">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-5">
              Trusted by leading institutions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {colleges.map((name) => (
                <span
                  key={name}
                  className="text-sm font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200 cursor-default select-none tracking-tight"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated hover:-translate-y-1 hover:border-primary/20 transition-all duration-200 cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <s.icon className="h-5 w-5 text-primary" />
                    <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{s.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Trainers ── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-20">
          <Reveal>
            <div className="flex items-end justify-between mb-9 gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Our Trainers</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Senior practitioners.<br className="hidden sm:block" /> Real outcomes.
                </h2>
                <p className="mt-3 text-muted-foreground max-w-md text-sm leading-relaxed">
                  Every trainer has 7+ years at top product companies — no theory, just real experience.
                </p>
              </div>
              <Link
                to="/trainers"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-75 transition-base"
              >
                View all trainers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {trainers.map((t, i) => (
              <Reveal key={t.name} delay={(i + 1) as 1 | 2 | 3}>
                <div className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated hover:-translate-y-1 hover:border-primary/20 transition-all duration-200 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-soft flex-shrink-0">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{t.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.role} · <span className="text-primary font-medium">{t.company}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                    {t.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full border border-border bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t.expertise}</span>
                    <span className="font-semibold text-foreground">{t.years}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-20">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">What they say</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Trusted by placement officers
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.author} delay={(i + 1) as 1 | 2}>
                <div className="relative rounded-2xl border border-border bg-card p-7 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
                  {/* Quote icon */}
                  <Quote className="h-7 w-7 text-primary/20 mb-4" />
                  <p className="text-foreground/80 leading-relaxed text-sm mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role} · {t.college}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Placements — Coming Soon ── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-20">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Placements</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Coming Soon</h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="flex items-center justify-center">
              <div className="relative rounded-3xl overflow-hidden max-w-xl w-full">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.95 0.05 265 / 0.5), oklch(0.92 0.08 280 / 0.4))" }}
                />
                <div
                  className="relative rounded-3xl border border-primary/15 p-10 text-center"
                  style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
                >
                  <div className="h-16 w-16 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center mx-auto mb-5">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">Placement Results Coming Soon</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                    Our placement results will be showcased here soon. We're collecting data from 12,400+ students across 200+ colleges.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Expected: Q3 2025
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-20 mb-4">
          <Reveal>
            <div className="group rounded-3xl bg-gradient-primary p-10 sm:p-14 text-center shadow-elevated overflow-hidden relative hover:shadow-[0_20px_60px_-15px_oklch(0.5_0.18_270/0.5)] transition-all duration-300">
              {/* Radial glow top */}
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(70% 80% at 50% 0%, white, transparent)" }} />
              {/* Ambient bottom-right orb */}
              <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full opacity-15 blur-2xl" style={{ background: "radial-gradient(circle, white, transparent)" }} />
              {/* Animated shimmer bar */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
              />

              <div className="relative">
                <p className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-widest mb-3">
                  Ready to upskill your campus?
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight">
                  Pick a date. Lock it in.
                </h2>
                <p className="mt-3 text-primary-foreground/75 max-w-md mx-auto text-base leading-relaxed">
                  One training day, zero headaches. We handle trainer matching, content, and delivery.
                </p>
                <Button
                  asChild size="lg"
                  className="group/btn mt-8 bg-card text-primary hover:bg-card/95 hover:scale-[1.04] h-13 px-8 shadow-soft transition-all duration-200 rounded-xl font-semibold"
                >
                  <Link to="/book">
                    Open Booking Calendar
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>

      </main>
      <Footer />
    </div>
  );
}
