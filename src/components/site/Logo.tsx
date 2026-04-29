import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="h-9 w-9 rounded-xl bg-gradient-primary shadow-soft flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path d="M9 22V12h6v10"/>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-bold text-[15px] text-foreground tracking-tight">TrainHub</span>
        <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Training Center</span>
      </div>
    </Link>
  );
}