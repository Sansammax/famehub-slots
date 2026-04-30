import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/placements")({
  component: PlacementsPage,
});

function PlacementsPage() {
  return (
    <PageShell
      eyebrow="Placements"
      title="Coming Soon"
      subtitle="We're compiling placement results from our partner colleges. Stay tuned."
    >
      <div className="flex items-center justify-center py-16">
        <div className="relative rounded-3xl overflow-hidden max-w-lg w-full">
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.05 265 / 0.6), oklch(0.92 0.08 280 / 0.5))",
            }}
          />
          {/* Glassmorphism card */}
          <div
            className="relative rounded-3xl border border-border/60 p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center mx-auto mb-6">
              <svg
                className="h-10 w-10 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
              Placement Results Coming Soon
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              Our placement results will be showcased here soon. We're collecting data from
              12,400+ students across 200+ colleges to bring you real, verified outcomes.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Expected: Q3 2025
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
