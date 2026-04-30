-- Fix RLS for user_roles and blocked_dates to allow admin management

-- 1. Fix user_roles policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow first user to become admin" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Allow users to see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow the first user to become an admin (bootstrap)
CREATE POLICY "Allow first user to become admin"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.user_roles)
);

-- Allow admins to manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));


-- 2. Fix blocked_dates policies
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view blocked dates" ON public.blocked_dates;
DROP POLICY IF EXISTS "Admins can insert blocked dates" ON public.blocked_dates;
DROP POLICY IF EXISTS "Admins can delete blocked dates" ON public.blocked_dates;
DROP POLICY IF EXISTS "Admins can manage blocked dates" ON public.blocked_dates;

-- Anyone can see blocked dates
CREATE POLICY "Anyone can view blocked dates"
ON public.blocked_dates FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can manage blocked dates
CREATE POLICY "Admins can manage blocked dates"
ON public.blocked_dates FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
