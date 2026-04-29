import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-10">
          {eyebrow && <p className="text-sm font-medium text-primary mb-2">{eyebrow}</p>}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground max-w-3xl">{title}</h1>
          {subtitle && <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{subtitle}</p>}
        </section>
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-16">{children}</section>
      </main>
      <Footer />
    </div>
  );
}