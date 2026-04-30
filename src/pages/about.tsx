import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ShieldCheck, Zap, Users, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const values = [
  {
    icon: ShieldCheck,
    title: "Industry-First Curriculum",
    desc: "Every module is co-designed with practitioners from Google, Stripe, and Meta — not textbooks.",
  },
  {
    icon: Zap,
    title: "Single-Day, High-Impact",
    desc: "We deliver intensive, focused training days that respect the college calendar and maximize learning ROI.",
  },
  {
    icon: Users,
    title: "Student-Centric Approach",
    desc: "Small batch sizes, live problem-solving, and real-world projects ensure every student gets hands-on experience.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    desc: "94% placement rate across 200+ partner colleges. Our alumni work at top-tier product companies.",
  },
];

function AboutPage() {
  return (
    <PageShell
      eyebrow="About FameHub"
      title="We bridge the gap between campus and industry."
      subtitle="FameHub was founded on a simple belief: college students deserve the same quality of training that top companies give their employees."
    >
      {/* Mission */}
      <div className="mt-8 rounded-3xl bg-gradient-primary p-10 sm:p-14 text-center shadow-elevated overflow-hidden relative mb-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(60% 80% at 50% 0%, white, transparent)" }}
        />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-widest mb-4">Our Mission</p>
          <blockquote className="text-2xl sm:text-3xl font-bold text-primary-foreground leading-snug">
            "Make world-class industry training accessible to every engineering college in India."
          </blockquote>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <p className="text-sm font-medium text-primary mb-2">What we stand for</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-10">
          Our core values
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-border bg-card p-7 shadow-soft hover:shadow-elevated transition-base hover:-translate-y-0.5"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="rounded-2xl border border-border bg-surface-soft p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "2019", label: "Founded" },
            { value: "200+", label: "Partner Colleges" },
            { value: "12,400+", label: "Students Trained" },
            { value: "94%", label: "Placement Rate" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-foreground tracking-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
