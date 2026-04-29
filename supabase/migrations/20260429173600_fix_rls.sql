-- Re-ensure bookings table structure matches expectations exactly
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_date DATE NOT NULL UNIQUE,
    college_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure RLS is active
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public inserts" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read" ON public.bookings;
DROP POLICY IF EXISTS "Allow insert" ON public.bookings;
DROP POLICY IF EXISTS "Allow read" ON public.bookings;

-- 1. Create INSERT policy as requested
CREATE POLICY "Allow insert"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Create SELECT policy as requested
CREATE POLICY "Allow read"
ON public.bookings
FOR SELECT
TO public
USING (true);
