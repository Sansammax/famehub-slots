# Fixing Admin Blocking Error (RLS Policy Fix)

If you are seeing a "Failed: new row violates row-level security policy" error when trying to block dates in the admin panel, follow these steps to fix your Supabase database permissions.

### Step 1: Open Supabase Dashboard
Go to your project at [database.supabase.com](https://database.supabase.com) and select your project.

### Step 2: Open SQL Editor
Click on the **SQL Editor** tab in the left sidebar (the `>_` icon).

### Step 3: Create a New Query
Click **+ New query** to open a fresh SQL editor window.

### Step 4: Copy and Paste the Fix SQL
Paste the following code into the editor:

```sql
-- 1. Allow the first user ever to become an admin (Bootstrap)
CREATE POLICY "Allow first user to become admin"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.user_roles)
);

-- 2. Allow admins to manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Allow admins to manage blocked dates
CREATE POLICY "Admins can manage blocked dates"
ON public.blocked_dates FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

### Step 5: Run the Query
Click the **Run** button at the bottom right. You should see a "Success" message.

### Step 6: Verify in Admin Panel
1. Go back to your application at `http://localhost:8080/admin`.
2. **Log out** and **Log in** again (this ensures your session is correctly linked to the new admin role).
3. Try blocking a date again. It should now work perfectly!

---

### Why did this happen?
The database was set to "Secure by Default." Even though the code tried to make you an admin, the database was rejecting the request because it didn't have a specific policy allowing a new user to "claim" the admin role. These SQL commands create a "bridge" that allows the first user to become an admin securely.
