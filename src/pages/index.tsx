import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Calendar, Users, Award, Briefcase } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft mb-7">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 200+ engineering colleges
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.05]">
              Elite Industry Training<br />
              <span className="text-gradient">for Colleges</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Book a single, dedicated training day for your campus. One slot per day — first come, first served. Transparent, premium, and effortless.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated transition-base h-12 px-7 text-base">
                <Link to="/book">Book Now <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base border-border bg-card hover:bg-surface-soft">
                <Link to="/trainers">Meet Trainers</Link>
              </Button>
            </div>
            <div className="mt-12 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              One booking per day · Instantly locked · Email confirmed
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 -mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, value: "12,400+", label: "Students Trained" },
              { icon: Briefcase, value: "200+", label: "Colleges Served" },
              { icon: Award, value: "94%", label: "Placement Rate" },
              { icon: Calendar, value: "1,800+", label: "Sessions Delivered" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated transition-base">
                <s.icon className="h-5 w-5 text-primary mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{s.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trainers */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-28">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-primary mb-2">Our Trainers</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Senior practitioners. Real outcomes.</h2>
            </div>
            <Link to="/trainers" className="text-sm font-medium text-primary hover:opacity-80 transition-base">View all →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { name: "Aarav Mehta", role: "Senior Engineer · Ex-Google", expertise: "System Design, DSA", years: "12 yrs" },
              { name: "Priya Iyer", role: "Product Lead · Ex-Stripe", expertise: "Product Thinking, UX", years: "10 yrs" },
              { name: "Rohan Kapoor", role: "ML Architect · Ex-Meta", expertise: "ML, Deep Learning", years: "9 yrs" },
            ].map((t) => (
              <div key={t.name} className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elevated transition-base">
                <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg mb-4">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{t.role}</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.expertise}</span>
                  <span className="font-medium text-foreground">{t.years}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Placements */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-28">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">Placements</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Where our students land</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {["Google", "Microsoft", "Stripe", "Atlassian", "Razorpay", "Swiggy"].map(c => (
              <div key={c} className="rounded-xl border border-border bg-card py-5 text-center text-sm font-semibold text-foreground/80 shadow-soft hover:shadow-elevated transition-base">
                {c}
              </div>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { name: "Sneha Rao", company: "Google", role: "SWE Intern", college: "IIT Madras" },
              { name: "Karan Shah", company: "Stripe", role: "Software Engineer", college: "BITS Pilani" },
              { name: "Megha Nair", company: "Razorpay", role: "Product Analyst", college: "VIT Vellore" },
            ].map(s => (
              <div key={s.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-muted flex items-center justify-center font-semibold text-foreground text-sm">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.college}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border text-sm">
                  <div className="font-medium text-foreground">{s.role}</div>
                  <div className="text-muted-foreground">{s.company}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-28">
          <div className="rounded-3xl bg-gradient-primary p-10 sm:p-16 text-center shadow-elevated overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(60% 80% at 50% 0%, white, transparent)" }} />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight">Ready to upskill your campus?</h2>
              <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">Pick an open date and lock it in 60 seconds. No back-and-forth.</p>
              <Button asChild size="lg" className="mt-8 bg-card text-primary hover:bg-card/90 h-12 px-7 shadow-soft">
                <Link to="/book">Open Calendar <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
