import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/services/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CalendarDays, ListChecks, Settings, LogOut, Trash2 } from "lucide-react";
import { BookingCalendar, type BookingMap } from "@/components/booking/BookingCalendar";
import { toast } from "sonner";
import { formatLong, toISODate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

type Booking = {
  id: string; booking_date: string; college_name: string; contact_person: string;
  phone: string; whatsapp: string | null; email: string; notes: string | null; created_at: string;
};

function AdminDashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [tab, setTab] = useState<"dashboard" | "bookings" | "calendar" | "settings">("dashboard");

  useEffect(() => {
    let mounted = true;
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { nav({ to: "/admin/login" }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
      if (!isAdmin) {
        const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true });
        if ((count ?? 0) === 0) {
          await supabase.from("user_roles").insert({ user_id: session.user.id, role: "admin" as any });
          if (!mounted) return;
          setAuthorized(true);
          await loadAll();
          setLoading(false);
          return;
        }
        toast.error("Not authorized", { description: "Your account doesn't have admin access." });
        await supabase.auth.signOut();
        nav({ to: "/admin/login" });
        return;
      }
      if (!mounted) return;
      setAuthorized(true);
      await loadAll();
      setLoading(false);
    }
    init();
    return () => { mounted = false; };
  }, [nav]);

  async function loadAll() {
    const [bRes, blRes] = await Promise.all([
      supabase.from("bookings").select("*").order("booking_date", { ascending: true }),
      supabase.from("blocked_dates").select("blocked_date").order("blocked_date"),
    ]);
    if (bRes.data) setBookings(bRes.data as any);
    if (blRes.data) setBlocked((blRes.data as any[]).map(r => r.blocked_date));
  }

  const bookingMap: BookingMap = useMemo(() => {
    const m: BookingMap = {};
    for (const b of bookings) m[b.booking_date] = b.college_name;
    return m;
  }, [bookings]);

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const upcoming = bookings.filter(b => new Date(b.booking_date) >= today);

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error("Failed", { description: error.message });
    toast.success("Booking deleted");
    await loadAll();
  }

  async function toggleBlock(date: Date) {
    const iso = toISODate(date);
    if (blocked.includes(iso)) {
      const { error } = await supabase.from("blocked_dates").delete().eq("blocked_date", iso);
      if (error) return toast.error("Failed", { description: error.message });
      toast.success("Date unblocked");
    } else {
      if (bookingMap[iso]) return toast.error("Cannot block a booked date");
      const { error } = await supabase.from("blocked_dates").insert({ blocked_date: iso });
      if (error) return toast.error("Failed", { description: error.message });
      toast.success("Date blocked");
    }
    await loadAll();
  }

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/admin/login" });
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!authorized) return null;

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings" as const, label: "Bookings", icon: ListChecks },
    { id: "calendar" as const, label: "Calendar", icon: CalendarDays },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface-soft flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="p-5 border-b border-border"><Logo /></div>
        <nav className="p-3 flex-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} className={cn("w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-base", tab === n.id ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-surface-soft hover:text-foreground")}>
              <n.icon className="h-4 w-4" />{n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start"><Link to="/">View site</Link></Button>
          <Button onClick={signOut} variant="ghost" className="w-full justify-start text-muted-foreground"><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden border-b border-border bg-card px-5 py-3 flex items-center justify-between">
          <Logo />
          <Button size="sm" variant="ghost" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
        </header>
        <div className="md:hidden border-b border-border bg-card px-3 py-2 flex gap-1 overflow-x-auto">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap", tab === n.id ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground")}>{n.label}</button>
          ))}
        </div>

        <main className="p-5 sm:p-8 max-w-6xl">
          {tab === "dashboard" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Overview of all bookings.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <Stat label="Total bookings" value={bookings.length} />
                <Stat label="Upcoming" value={upcoming.length} />
                <Stat label="Blocked dates" value={blocked.length} />
              </div>
              <div className="mt-8 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Recent bookings</h2>
                </div>
                <BookingsTable bookings={bookings.slice(0, 8)} onDelete={deleteBooking} compact />
              </div>
            </>
          )}

          {tab === "bookings" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Bookings</h1>
              <p className="text-sm text-muted-foreground mt-1">All bookings across all dates.</p>
              <div className="mt-6 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
                <BookingsTable bookings={bookings} onDelete={deleteBooking} />
              </div>
            </>
          )}

          {tab === "calendar" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Calendar</h1>
              <p className="text-sm text-muted-foreground mt-1">Click any date to block or unblock it.</p>
              <div className="mt-6">
                <BookingCalendar bookings={bookingMap} blocked={new Set(blocked)} onSelect={toggleBlock} showCollegeNames />
                <p className="mt-3 text-xs text-muted-foreground">Tip: Click an available date to block it. Click a blocked date to unblock.</p>
              </div>
            </>
          )}

          {tab === "settings" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Settings</h1>
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft max-w-xl">
                <h3 className="font-semibold text-foreground">Admin email</h3>
                <p className="text-sm text-muted-foreground mt-1">Booking notifications are sent to <span className="font-medium text-foreground">sanknoes.edu@gmail.com</span></p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="mt-2 text-3xl font-bold text-foreground tracking-tight">{value}</div>
    </div>
  );
}

function BookingsTable({ bookings, onDelete, compact }: { bookings: Booking[]; onDelete: (id: string) => void; compact?: boolean }) {
  if (bookings.length === 0) {
    return <div className="px-5 py-12 text-center text-sm text-muted-foreground">No bookings yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-soft/60">
          <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">College</th>
            <th className="px-5 py-3">Contact</th>
            {!compact && <th className="px-5 py-3">Email</th>}
            <th className="px-5 py-3 w-12" />
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="border-t border-border hover:bg-surface-soft/40 transition-base">
              <td className="px-5 py-3.5 text-sm font-medium text-foreground whitespace-nowrap">{formatLong(new Date(b.booking_date))}</td>
              <td className="px-5 py-3.5 text-sm text-foreground">{b.college_name}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{b.contact_person} · {b.phone}</td>
              {!compact && <td className="px-5 py-3.5 text-sm text-muted-foreground">{b.email}</td>}
              <td className="px-5 py-3.5 text-right">
                <button onClick={() => onDelete(b.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-base" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}