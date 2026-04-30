import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@famehub.in",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 99445 96956",
    sub: "Mon–Fri, 9 AM – 6 PM IST",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "1st Floor, Vijay Tower, 17/2, Tank St, Hosur, Tamil Nadu 635109",
    sub: "India",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "< 24 hours",
    sub: "For all enquiries",
  },
];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", college: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageShell
      eyebrow="Contact Us"
      title="Let's talk about your college."
      subtitle="Whether you're exploring training options or ready to book — our team is here to help."
    >
      <div className="mt-8 grid gap-10 lg:grid-cols-5">
        {/* Contact details */}
        <div className="lg:col-span-2 space-y-4">
          {contactDetails.map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                <c.icon className="h-4.5 w-4.5 text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{c.label}</p>
                <p className="font-semibold text-foreground text-sm">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            {submitted ? (
              <div className="text-center py-10">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Message sent!</h3>
                <p className="text-muted-foreground text-sm">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Please Enter Your Name"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Please Enter Your Email"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-base"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-college" className="block text-sm font-medium text-foreground mb-1.5">
                    College / Institution
                  </label>
                  <input
                    id="contact-college"
                    type="text"
                    value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })}
                    placeholder="Please Enter Your College Name"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-base"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your training needs, batch size, preferred dates..."
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-base resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated hover:opacity-95 transition-base h-12"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
