import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  function isActive(to: string) {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border/70 bg-background/90 shadow-soft backdrop-blur-xl"
          : "border-border/40 bg-background/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {/* Hover / active background */}
                <span
                  className={`absolute inset-0 rounded-lg transition-all duration-200
                    ${active
                      ? "bg-surface-muted"
                      : "bg-transparent group-hover:bg-surface-soft"
                    }`}
                />
                {/* Label */}
                <span className="relative z-10">{l.label}</span>
                {/* Active underline indicator */}
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-primary transition-all duration-200
                    ${active ? "w-4/5 opacity-100" : "w-0 opacity-0 group-hover:w-3/5 group-hover:opacity-50"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex bg-gradient-primary hover:opacity-95 hover:scale-[1.03] text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-200 rounded-lg px-4"
          >
            <Link to="/book">Book Training</Link>
          </Button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-soft transition-base"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 border-t border-border" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-3 gap-0.5 bg-background">
          {links.map((l) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-base flex items-center gap-2
                  ${active
                    ? "bg-surface-muted text-foreground"
                    : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
                  }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                {l.label}
              </Link>
            );
          })}
          <Button
            asChild
            size="sm"
            className="mt-2 bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Link to="/book" onClick={() => setOpen(false)}>
              Book Training
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}