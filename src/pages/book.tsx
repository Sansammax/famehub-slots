import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BookingCalendar, type BookingMap } from "@/components/booking/BookingCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { supabase } from "@/services/supabase/client";
import { BookingService } from "@/services/booking.service";
import { toast } from "sonner";
import { CalendarCheck, Lock, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { formatLong, toISODate } from "@/lib/date-utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  component: BookPage,
});

const schema = z.object({
  collegeName: z.string().trim().min(2, "College name is required").max(150),
  contactPerson: z.string().trim().min(2, "Contact person is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20).regex(/^[+\d\s\-()]+$/, "Invalid phone"),
  whatsapp: z.string().trim().max(20).regex(/^[+\d\s\-()]*$/, "Invalid number").optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(200),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

function BookPage() {
  const [bookings, setBookings] = useState<BookingMap>({});
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [step, setStep] = useState<"closed" | "confirm" | "form" | "success">("closed");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({ collegeName: "", contactPerson: "", phone: "", whatsapp: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  async function load() {
    const data = await BookingService.getAvailability();
    setBookings(data.bookings);
    setBlocked(data.blocked);
  }

  useEffect(() => { load(); }, []);

  function handleSelect(d: Date) {
    setSelectedDate(d);
    setStep("confirm");
  }

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    console.log("BOOK BUTTON CLICKED");
    
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormData, string>> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as keyof FormData] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    if (!selectedDate) return;
    setSubmitting(true);
    
    try {
      const isoDate = toISODate(selectedDate);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            college_name: parsed.data.collegeName,
            contact_person: parsed.data.contactPerson,
            phone: parsed.data.phone,
            whatsapp: parsed.data.whatsapp || null,
            email: parsed.data.email,
            booking_date: isoDate,
            notes: parsed.data.notes || null
          }
        ]);

      console.log("INSERT DATA:", data);
      console.log("INSERT ERROR:", error);

      if (error) {
        throw new Error(error.message);
      }

      setStep("success");
      // Only update UI by fetching fresh data from DB
      await load();
    } catch (e: any) {
      console.error("Booking error caught:", e);
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
    setForm({ collegeName: "", contactPerson: "", phone: "", whatsapp: "", email: "", notes: "" });
    setErrors({});
    setStep("closed");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-12 pb-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary mb-2">Booking Calendar</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Pick a date for your training session</h1>
            <p className="mt-3 text-muted-foreground">One slot per day. Once a date is taken, it's locked. Hover any booked date to see which college reserved it.</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-16">
          <BookingCalendar bookings={bookings} blocked={blocked} onSelect={handleSelect} />
        </section>
      </main>
      <Footer />

      <Sheet open={step !== "closed"} onOpenChange={(o) => !o && reset()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {step === "confirm" && selectedDate && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">Confirm your date</SheetTitle>
                <SheetDescription>Review the slot before filling out details.</SheetDescription>
              </SheetHeader>
              <div className="mt-6 rounded-2xl border border-border bg-surface-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Selected date</div>
                    <div className="font-semibold text-foreground">{formatLong(selectedDate)}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>Only one slot is available per day. Once confirmed, this date is locked.</p>
                </div>
              </div>
              <Button onClick={() => setStep("form")} className="mt-6 w-full bg-gradient-primary text-primary-foreground shadow-glow h-11">
                Proceed to Booking <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          )}

          {step === "form" && selectedDate && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">Booking details</SheetTitle>
                <SheetDescription>{formatLong(selectedDate)}</SheetDescription>
              </SheetHeader>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="College Name" error={errors.collegeName}>
                  <Input value={form.collegeName} onChange={e => setForm({ ...form, collegeName: e.target.value })} placeholder="e.g. IIT Madras" />
                </Field>
                <Field label="Contact Person" error={errors.contactPerson}>
                  <Input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} placeholder="Full name" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" error={errors.phone}>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." />
                  </Field>
                  <Field label="WhatsApp" error={errors.whatsapp}>
                    <Input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="Optional" />
                  </Field>
                </div>
                <Field label="Email" error={errors.email}>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@college.edu" />
                </Field>
                <Field label="Notes" error={errors.notes}>
                  <Textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Anything we should know" />
                </Field>
                <div className="rounded-xl bg-surface-soft border border-border p-3 text-xs text-muted-foreground">
                  Selected date: <span className="font-semibold text-foreground">{formatLong(selectedDate)}</span>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-gradient-primary text-primary-foreground shadow-glow h-11">
                  {submitting ? "Confirming…" : "Confirm Booking"}
                </Button>
              </form>
            </>
          )}

          {step === "success" && selectedDate && (
            <div className="py-10 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">Your training slot is confirmed</h3>
              <p className="mt-2 text-sm text-muted-foreground">{formatLong(selectedDate)}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground rounded-full bg-surface-soft px-3 py-1.5 border border-border">
                <Mail className="h-3.5 w-3.5" /> A confirmation email has been sent
              </div>
              <div className="mt-8 flex flex-col gap-2">
                <Button onClick={reset} className="bg-gradient-primary text-primary-foreground">Book another date</Button>
                <Button asChild variant="ghost"><Link to="/">Back to home</Link></Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground uppercase tracking-wide">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}