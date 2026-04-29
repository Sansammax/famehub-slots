import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, buildMonthGrid, isSameDay, startOfMonth, toISODate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type DateState = "available" | "booked" | "blocked" | "past" | "outside";

export interface BookingMap {
  [iso: string]: string; // iso date -> college name
}

interface Props {
  bookings: BookingMap;
  blocked: Set<string>;
  onSelect: (date: Date) => void;
  showCollegeNames?: boolean; // when true, also reveal name on tile (admin)
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingCalendar({ bookings, blocked, onSelect, showCollegeNames }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  function getState(d: Date, inMonth: boolean): DateState {
    if (!inMonth) return "outside";
    if (d < today) return "past";
    const iso = toISODate(d);
    if (blocked.has(iso)) return "blocked";
    if (bookings[iso]) return "booked";
    return "available";
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">{monthLabel}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">One booking per day · Tap an open date</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCursor(addMonths(cursor, -1))} className="p-2 rounded-lg hover:bg-surface-soft transition-base" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button onClick={() => setCursor(startOfMonth(new Date()))} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-surface-soft transition-base">Today</button>
            <button onClick={() => setCursor(addMonths(cursor, 1))} className="p-2 rounded-lg hover:bg-surface-soft transition-base" aria-label="Next month">
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 px-3 sm:px-4 pt-3">
          {WEEKDAYS.map(w => (
            <div key={w} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center py-2">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 px-3 sm:px-4 pb-4">
          {grid.map(({ date, inMonth }, i) => {
            const state = getState(date, inMonth);
            const iso = toISODate(date);
            const college = bookings[iso];
            const isToday = isSameDay(date, today);
            const clickable = state === "available";

            const tile = (
              <button
                key={i}
                disabled={!clickable}
                onClick={() => clickable && onSelect(date)}
                className={cn(
                  "relative aspect-square sm:aspect-[5/4] rounded-xl text-sm font-medium transition-base flex flex-col items-center justify-center gap-1 group",
                  state === "outside" && "text-muted-foreground/40 cursor-default",
                  state === "past" && "text-muted-foreground/50 bg-surface-soft/40 cursor-not-allowed",
                  state === "blocked" && "bg-surface-muted text-muted-foreground cursor-not-allowed border border-border",
                  state === "booked" && "bg-destructive/8 text-destructive cursor-not-allowed border border-destructive/20",
                  state === "available" && "bg-success/8 text-foreground hover:bg-gradient-primary hover:text-primary-foreground hover:shadow-glow border border-success/20 hover:border-transparent cursor-pointer",
                  isToday && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                )}
              >
                <span className="text-base font-semibold">{date.getDate()}</span>
                {state === "available" && (
                  <span className="h-1 w-1 rounded-full bg-success group-hover:bg-primary-foreground/70" />
                )}
                {state === "booked" && (
                  <span className="text-[9px] uppercase tracking-wider font-bold opacity-70">Booked</span>
                )}
                {state === "blocked" && (
                  <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">Blocked</span>
                )}
                {showCollegeNames && college && (
                  <span className="text-[10px] font-medium truncate max-w-full px-1">{college}</span>
                )}
              </button>
            );

            if (state === "booked" && college) {
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>{tile}</TooltipTrigger>
                  <TooltipContent side="top" className="bg-foreground text-background border-0 px-3 py-1.5">
                    <p className="text-xs font-medium">Booked by: {college}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }
            return tile;
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 px-5 sm:px-6 py-4 border-t border-border bg-surface-soft/50 text-xs">
          <Legend dotClass="bg-success" label="Available" />
          <Legend dotClass="bg-destructive" label="Booked" />
          <Legend dotClass="bg-muted-foreground/40" label="Blocked" />
        </div>
      </div>
    </TooltipProvider>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", dotClass)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}