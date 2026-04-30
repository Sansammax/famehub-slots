import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center group">
      <span
        className="font-extrabold tracking-tight select-none"
        style={{ fontSize: "1.35rem", letterSpacing: "-0.03em", lineHeight: 1 }}
      >
        <span className="text-foreground">FAME</span>
        <span style={{ color: "#1a7ee8" }}>HUB</span>
      </span>
    </Link>
  );
}