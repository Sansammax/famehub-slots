import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface-soft/60 mt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Elite industry training programs for colleges. Curated trainers, real outcomes,
              transparent booking.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/book" className="hover:text-foreground transition-base inline-block">
                  Book Training
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-foreground transition-base inline-block">
                  Trainers
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-foreground transition-base inline-block">
                  Placements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-base inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-base inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-foreground transition-base inline-block">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FameHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Crafted with precision.</p>
        </div>
      </div>
    </footer>
  );
}