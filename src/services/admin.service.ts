import { supabase } from "./supabase/client";
import { toISODate } from "@/lib/date-utils";

export const AdminService = {
  async getAllData() {
    const [bRes, blRes] = await Promise.all([
      supabase.from("bookings").select("*").order("booking_date", { ascending: true }),
      supabase.from("blocked_dates").select("blocked_date").order("blocked_date"),
    ]);
    return {
      bookings: (bRes.data || []) as any[],
      blocked: (blRes.data || []).map((r: any) => r.blocked_date),
    };
  },

  async deleteBooking(id: string) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async toggleBlockDate(date: Date, isBlocked: boolean) {
    const iso = toISODate(date);
    if (isBlocked) {
      const { error } = await supabase.from("blocked_dates").delete().eq("blocked_date", iso);
      if (error) throw new Error(error.message);
      return "unblocked";
    } else {
      const { error } = await supabase.from("blocked_dates").insert({ blocked_date: iso });
      if (error) throw new Error(error.message);
      return "blocked";
    }
  }
};
