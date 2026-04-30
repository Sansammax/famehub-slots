import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/trainers")({
  component: TrainersPage,
});

const trainers = [
  {
    name: "Aarav Mehta",
    role: "Senior Engineer",
    company: "Ex-Google",
    expertise: ["System Design", "DSA", "Distributed Systems"],
    years: "12 yrs",
    bio: "Led infrastructure teams at Google for 8 years. Trained 1,200+ students on FAANG-level problem solving and system architecture.",
    topics: "System Design · Data Structures · Algorithms",
  },
  {
    name: "Priya Iyer",
    role: "Product Lead",
    company: "Ex-Stripe",
    expertise: ["Product Thinking", "UX Strategy", "Growth"],
    years: "10 yrs",
    bio: "Built Stripe's payments onboarding product. Brings a unique perspective blending engineering depth with product strategy.",
    topics: "Product Management · UX · Agile",
  },
  {
    name: "Rohan Kapoor",
    role: "ML Architect",
    company: "Ex-Meta",
    expertise: ["ML Engineering", "Deep Learning", "LLMs"],
    years: "9 yrs",
    bio: "Designed recommendation systems at Meta serving 3B+ users. Specializes in making complex ML concepts accessible.",
    topics: "Machine Learning · Deep Learning · GenAI",
  },
  {
    name: "Ananya Sharma",
    role: "Cloud Architect",
    company: "Ex-AWS",
    expertise: ["Cloud Native", "DevOps", "Kubernetes"],
    years: "11 yrs",
    bio: "Architected cloud solutions for Fortune 500 clients at AWS. Expert in modern DevOps practices and cloud-native development.",
    topics: "AWS · Docker · Kubernetes · CI/CD",
  },
  {
    name: "Vikram Nair",
    role: "Security Engineer",
    company: "Ex-Cloudflare",
    expertise: ["Cybersecurity", "Pentesting", "Secure Code"],
    years: "8 yrs",
    bio: "Secured critical internet infrastructure at Cloudflare. Teaches ethical hacking, secure coding, and security mindset.",
    topics: "Security · Cryptography · Ethical Hacking",
  },
  {
    name: "Deeksha Rao",
    role: "Frontend Principal",
    company: "Ex-Figma",
    expertise: ["React", "Web Performance", "Design Systems"],
    years: "7 yrs",
    bio: "Built core editor components at Figma. Passionate about bridging design and engineering for seamless user experiences.",
    topics: "React · TypeScript · Design Systems",
  },
];

function TrainersPage() {
  return (
    <PageShell
      eyebrow="Our Trainers"
      title="Senior practitioners. Real outcomes."
      subtitle="Every FameHub trainer has 7+ years of industry experience at top product companies. No academic theory — just battle-tested expertise."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {trainers.map((t) => (
          <div
            key={t.name}
            className="group rounded-2xl border border-border bg-card p-7 shadow-soft hover:shadow-elevated transition-base hover:-translate-y-1 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-soft flex-shrink-0">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-[15px]">{t.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.role} · <span className="text-primary font-medium">{t.company}</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t.bio}</p>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex flex-wrap gap-1.5">
                {t.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-border bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs">
                <span className="text-muted-foreground">{t.topics}</span>
                <span className="font-semibold text-foreground">{t.years}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-border bg-surface-soft p-10 text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Want a trainer for your college?</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Book a training day and we'll match the right trainer to your students' needs.
        </p>
        <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated transition-base">
          <Link to="/book">
            Book Training <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
