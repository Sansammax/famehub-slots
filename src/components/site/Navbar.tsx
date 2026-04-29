import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/trainers", label: "Trainers" },
  { to: "/placements", label: "Placements" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-soft transition-base"
              activeProps={{ className: "px-3.5 py-2 text-sm font-medium text-foreground rounded-lg bg-surface-muted" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-primary hover:opacity-95 text-primary-foreground shadow-soft hover:shadow-glow transition-base">
            <Link to="/book">Book Training</Link>
          </Button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-surface-soft" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col p-3 gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-soft">
                {l.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 bg-gradient-primary text-primary-foreground">
              <Link to="/book" onClick={() => setOpen(false)}>Book Training</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}