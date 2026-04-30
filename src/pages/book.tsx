import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { z } from "zod";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BookingCalendar, type BookingMap } from "@/components/booking/BookingCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/services/supabase/client";
import { BookingService } from "@/services/booking.service";
import { toast } from "sonner";
import { CalendarCheck, Lock, Mail, ArrowRight, X } from "lucide-react";
import { formatLong, toISODate } from "@/lib/date-utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  component: BookPage,
});

const schema = z.object({
  collegeName:   z.string().trim().min(2, "College name is required").max(150),
  contactPerson: z.string().trim().min(2, "Contact person is required").max(100),
  phone:         z.string().trim().min(7, "Valid phone required").max(20).regex(/^[+\d\s\-()]+$/, "Invalid phone"),
  whatsapp:      z.string().trim().max(20).regex(/^[+\d\s\-()]*$/, "Invalid number").optional().or(z.literal("")),
  email:         z.string().trim().email("Invalid email").max(200),
  notes:         z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

/* ─── Confetti burst (CSS-only, zero deps) ──────────────────────────────── */
const CONFETTI_COLORS = ["#6366f1","#22c55e","#f59e0b","#ec4899","#3b82f6","#a855f7"];

function Confetti() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 400}ms`,
    duration: `${900 + Math.random() * 600}ms`,
    size: `${6 + Math.random() * 6}px`,
    rotate: Math.random() > 0.5 ? "2px" : "50%",
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            top: 0,
            backgroundColor: p.color,
            borderRadius: p.rotate,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Checkmark ────────────────────────────────────────────────── */
function AnimatedCheckmark() {
  return (
    <div className="success-pop mx-auto mb-6 relative">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="drop-shadow-lg">
        <circle cx="40" cy="40" r="38" fill="oklch(0.7 0.17 152 / 0.12)" />
        <circle cx="40" cy="40" r="38" stroke="oklch(0.7 0.17 152)" strokeWidth="2.5" strokeDasharray="240" strokeDashoffset="240"
          style={{ animation: "check-draw 0.6s cubic-bezier(0.16,1,0.3,1) forwards" }} />
        <path d="M24 40l12 12 20-22" stroke="oklch(0.7 0.17 152)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          className="check-draw" />
      </svg>
    </div>
  );
}

/* ─── Full-Screen Modal ─────────────────────────────────────────────────── */
interface ModalProps { open: boolean; onClose: () => void; children: React.ReactNode; }

function Modal({ open, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{ animation: "modal-backdrop-in 220ms ease forwards" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true" role="dialog"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        style={{ animation: "modal-scale-in 240ms cubic-bezier(0.16,1,0.3,1) forwards" }}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/* ─── Book Page ─────────────────────────────────────────────────────────── */
function BookPage() {
  const [bookings,     setBookings]     = useState<BookingMap>({});
  const [blocked,      setBlocked]      = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [step,         setStep]         = useState<"closed"|"confirm"|"form"|"success">("closed");
  const [submitting,   setSubmitting]   = useState(false);
  const [shakeFields,  setShakeFields]  = useState<Set<keyof FormData>>(new Set());
  const [form,         setForm]         = useState<FormData>({ collegeName:"", contactPerson:"", phone:"", whatsapp:"", email:"", notes:"" });
  const [errors,       setErrors]       = useState<Partial<Record<keyof FormData, string>>>({});

  const load = useCallback(async () => {
    const data = await BookingService.getAvailability();
    setBookings(data.bookings);
    setBlocked(data.blocked);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleSelect(d: Date) { setSelectedDate(d); setStep("confirm"); }

  function fireEmail(payload: {
    collegeName: string; contactPerson: string; phone: string;
    email: string; bookingDate: string; notes?: string;
  }) {
    supabase.functions.invoke("send-booking-email", {
      body: { record: {
        college_name:    payload.collegeName,
        contact_person:  payload.contactPerson,
        phone:           payload.phone,
        email:           payload.email,
        booking_date:    payload.bookingDate,
        notes:           payload.notes || null,
      }},
    }).catch((err) => console.warn("[email] fire-and-forget failed:", err));
  }

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      const shaking = new Set<keyof FormData>();
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormData;
        errs[k] = issue.message;
        shaking.add(k);
      }
      setErrors(errs);
      /* Trigger shake animation, then clear it so it can re-trigger */
      setShakeFields(shaking);
      setTimeout(() => setShakeFields(new Set()), 400);
      return;
    }
    setErrors({});
    if (!selectedDate) return;
    setSubmitting(true);

    try {
      const isoDate = toISODate(selectedDate);

      const { error } = await supabase.from("bookings").insert([{
        college_name:    parsed.data.collegeName,
        contact_person:  parsed.data.contactPerson,
        phone:           parsed.data.phone,
        whatsapp:        parsed.data.whatsapp || null,
        email:           parsed.data.email,
        booking_date:    isoDate,
        notes:           parsed.data.notes || null,
      }]);

      if (error) throw new Error(error.message);

      /* Show success FIRST, then refresh + send email in background */
      setStep("success");
      load();
      fireEmail({
        collegeName:   parsed.data.collegeName,
        contactPerson: parsed.data.contactPerson,
        phone:         parsed.data.phone,
        email:         parsed.data.email,
        bookingDate:   isoDate,
        notes:         parsed.data.notes,
      });

    } catch (e: any) {
      if (e.message?.includes("23505") || e.message?.toLowerCase().includes("duplicate")) {
        toast.error("That date was just booked", { description: "Please pick another available date." });
        await load();
        setStep("closed");
      } else {
        toast.error("Booking failed", { description: e?.message ?? "Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setSelectedDate(null);
    setForm({ collegeName:"", contactPerson:"", phone:"", whatsapp:"", email:"", notes:"" });
    setErrors({});
    setStep("closed");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-12 pb-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Booking Calendar</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Pick a date for your training session
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Select an available date to book your dedicated training session. Hover any booked date to see which college reserved it.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
          <BookingCalendar bookings={bookings} blocked={blocked} onSelect={handleSelect} />
        </section>
      </main>
      <Footer />

      {/* ── Modal ── */}
      <Modal open={step !== "closed"} onClose={reset}>

        {/* ── Confirm Date ── */}
        {step === "confirm" && selectedDate && (
          <>
            <ModalHeader title="Confirm your date" onClose={reset} step={1} />
            <div className="p-6 space-y-5">
              <div className="rounded-2xl border border-border bg-surface-soft p-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft flex-shrink-0">
                    <CalendarCheck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">Selected date</div>
                    <div className="text-lg font-bold text-foreground leading-tight">{formatLong(selectedDate)}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2.5 text-sm text-muted-foreground border-t border-border pt-4">
                  <Lock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/60" />
                  <p>Once confirmed, this date is locked exclusively for your college.</p>
                </div>
              </div>
              <PremiumButton onClick={() => setStep("form")}>
                Proceed to Booking
              </PremiumButton>
            </div>
          </>
        )}

        {/* ── Booking Form ── */}
        {step === "form" && selectedDate && (
          <>
            <ModalHeader title="Booking details" subtitle={formatLong(selectedDate)} onClose={reset} step={2} />
            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={submit} className="space-y-4">
                <Field label="College Name" error={errors.collegeName} shake={shakeFields.has("collegeName")}>
                  <Input
                    value={form.collegeName}
                    onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                    placeholder="e.g. IIT Madras"
                    className={fieldCls(!!errors.collegeName)}
                  />
                </Field>
                <Field label="Contact Person" error={errors.contactPerson} shake={shakeFields.has("contactPerson")}>
                  <Input
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    placeholder="Full name"
                    className={fieldCls(!!errors.contactPerson)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" error={errors.phone} shake={shakeFields.has("phone")}>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 ..."
                      className={fieldCls(!!errors.phone)}
                    />
                  </Field>
                  <Field label="WhatsApp" error={errors.whatsapp} shake={shakeFields.has("whatsapp")}>
                    <Input
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="Optional"
                      className={fieldCls(!!errors.whatsapp)}
                    />
                  </Field>
                </div>
                <Field label="Email" error={errors.email} shake={shakeFields.has("email")}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@college.edu"
                    className={fieldCls(!!errors.email)}
                  />
                </Field>
                <Field label="Notes" error={errors.notes} shake={shakeFields.has("notes")}>
                  <Textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Anything we should know"
                    className={`resize-none ${fieldCls(!!errors.notes)}`}
                  />
                </Field>

                <div className="rounded-xl bg-surface-soft border border-border p-3 text-xs text-muted-foreground">
                  Booking for: <span className="font-semibold text-foreground">{formatLong(selectedDate)}</span>
                </div>

                <PremiumButton type="submit" loading={submitting}>
                  {submitting ? "Confirming…" : "Confirm Booking"}
                </PremiumButton>
              </form>
            </div>
          </>
        )}

        {/* ── Success ── */}
        {step === "success" && selectedDate && (
          <div className="relative p-8 text-center overflow-hidden">
            {/* Confetti burst */}
            <Confetti />

            <AnimatedCheckmark />

            <h3 className="text-2xl font-bold text-foreground tracking-tight">Booking Confirmed!</h3>
            <p className="mt-2 text-base font-semibold text-primary">{formatLong(selectedDate)}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Your training slot has been successfully reserved. Our team will contact you shortly.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground rounded-full bg-surface-soft px-4 py-2 border border-border">
              <Mail className="h-3.5 w-3.5" />
              Confirmation email sent
            </div>
            <div className="mt-7 flex flex-col gap-2.5 relative z-10">
              <PremiumButton onClick={reset}>Book another date</PremiumButton>
              <Button asChild variant="ghost" className="h-11 rounded-xl">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

/** Returns extra class names for an input based on error state */
function fieldCls(hasError: boolean) {
  return hasError
    ? "border-destructive focus-visible:ring-destructive/30 bg-destructive/5"
    : "focus-visible:ring-primary/25 focus-visible:border-primary/40";
}

/* ─── Premium Button ────────────────────────────────────────────────────── */
interface PremiumBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
}
function PremiumButton({ children, onClick, type = "button", loading }: PremiumBtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground font-semibold h-12 shadow-glow hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
          {children}
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </>
      )}
    </button>
  );
}

/* ─── Step Indicator ────────────────────────────────────────────────────── */
const STEPS = ["Pick Date", "Fill Details", "Confirm"];
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300
                ${done   ? "bg-success text-white scale-100" :
                  active ? "bg-primary text-primary-foreground shadow-glow scale-110" :
                           "bg-surface-muted text-muted-foreground border border-border"}`}
              >
                {done ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : num}
              </div>
              <span className={`text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-200 ${
                active ? "text-primary" : done ? "text-success" : "text-muted-foreground/50"
              }`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 h-px mx-1 mb-4 transition-all duration-500 ${done ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Modal Header ──────────────────────────────────────────────────────── */
function ModalHeader({ title, subtitle, onClose, step }: { title: string; subtitle?: string; onClose: () => void; step?: number }) {
  return (
    <div className="flex-shrink-0 border-b border-border">
      {step !== undefined && (
        <div className="px-6 pt-4 pb-3 border-b border-border/60 bg-surface-soft/50">
          <StepIndicator current={step} />
        </div>
      )}
      <div className="flex items-start justify-between gap-4 px-6 pt-4 pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-soft transition-base flex-shrink-0 mt-0.5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Field helper ──────────────────────────────────────────────────────── */
function Field({ label, error, shake, children }: { label: string; error?: string; shake?: boolean; children: React.ReactNode }) {
  return (
    <div className={`space-y-1.5 ${shake ? "input-shake" : ""}`}>
      <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}