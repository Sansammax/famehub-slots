# Final Setup Steps: Training Center Booking System

Now that the codebase is fully refactored, you need to configure your Supabase project to automatically send emails when a new booking is created. Follow these exact steps to get everything running in production.

## Step 1: Deploy the Edge Function
You need to push the updated email function to your live Supabase project.

1. Open your terminal in the project root (`d:\day-slot-booker-phas1`).
2. Log in to the Supabase CLI if you haven't already:
   ```bash
   npx supabase login
   ```
3. Link your local project to your remote Supabase project:
   ```bash
   npx supabase link --project-ref <YOUR-PROJECT-REF>
   ```
   *(You can find your project ref in your Supabase Dashboard URL: `https://supabase.com/dashboard/project/<PROJECT-REF>`)*
4. Deploy the function:
   ```bash
   npx supabase functions deploy send-booking-email --no-verify-jwt
   ```

## Step 2: Set the Resend API Key
The Edge Function needs your Resend API key to send emails.

1. In your terminal, run:
   ```bash
   npx supabase secrets set RESEND_API_KEY=your_actual_resend_api_key_here
   ```

## Step 3: Create the Database Webhook (Crucial)
This tells the database to automatically trigger the email function whenever a new row is added to the `bookings` table.

1. Go to your **Supabase Dashboard**.
2. Navigate to **Database** (the table icon on the left menu) → **Webhooks**.
3. Click **Create Webhook**.
4. Configure it exactly like this:
   * **Name:** `Send Booking Email`
   * **Table:** `bookings`
   * **Events:** Check the `Insert` box only.
   * **Type:** `HTTP Request`
   * **Method:** `POST`
   * **URL:** `https://<YOUR-PROJECT-REF>.supabase.co/functions/v1/send-booking-email`
5. Under **HTTP Headers**, add:
   * **Header:** `Authorization`
   * **Value:** `Bearer <YOUR-ANON-KEY>`
     *(Find your anon key in Settings → API)*
6. Click **Save Webhook**.

## Step 4: Test the Flow
1. Start your local development server:
   ```bash
   npm run dev
   ```
2. Go to the booking page (`http://localhost:8080/book`).
3. Select an available date and submit the form.
4. **Verify Database:** Check your Supabase Dashboard to ensure the booking was inserted into the `bookings` table.
5. **Verify Email:** Check your email inbox to ensure the confirmation email was sent successfully. (You can also check the Edge Function Logs in the Supabase Dashboard if the email doesn't arrive).
