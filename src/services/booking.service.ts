import { supabase } from "./supabase/client";

export interface BookingPayload {
  collegeName: string;
  contactPerson: string;
  phone: string;
  whatsapp?: string;
  email: string;
  notes?: string;
  bookingDate: string; // ISO date string YYYY-MM-DD
}

export const BookingService = {
  async getAvailability() {
    const [bRes, blRes] = await Promise.all([
      supabase.from("bookings").select("booking_date, college_name"),
      supabase.from("blocked_dates").select("blocked_date"),
    ]);

    const bookings: Record<string, string> = {};
    if (bRes.data) {
      for (const r of bRes.data as any[]) {
        bookings[r.booking_date] = r.college_name;
      }
    }

    const blocked = new Set<string>();
    if (blRes.data) {
      for (const r of blRes.data as any[]) {
        blocked.add(r.blocked_date);
      }
    }

    return { bookings, blocked };
  },

  async createBooking(payload: BookingPayload) {
    const { error, data } = await supabase.from("bookings").insert([
      {
        booking_date: payload.bookingDate,
        college_name: payload.collegeName,
        contact_person: payload.contactPerson,
        phone: payload.phone,
        whatsapp: payload.whatsapp || null,
        email: payload.email,
        notes: payload.notes || null,
      }
    ]);

    if (error) {
      if (error.code === "23505" || /duplicate/i.test(error.message)) {
        throw new Error("SLOT_TAKEN");
      }
      throw new Error(error.message);
    }

    return data;
  },
};
