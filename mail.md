# How the Mailing System Works

The FameHub booking platform uses an automated, non-blocking email system powered by **Supabase Edge Functions** and the **Resend API**.

---

## 🏗 Architecture Overview

1.  **Trigger**: After a successful database insertion in the `bookings` table, the frontend calls the `fireEmail()` function.
2.  **Edge Function**: The frontend makes a secure request to the Supabase Edge Function named `send-booking-email`.
3.  **Email Provider**: The Edge Function acts as a bridge and communicates with **Resend** (a modern email API) to deliver the actual emails.
4.  **Recipients**: Two separate emails are generated:
    *   **Client Email**: A confirmation sent to the college representative.
    *   **Admin Email**: A notification sent to the FameHub team (`sanknoes.edu@gmail.com`).

---

## ⚡ Key Features

*   **Non-Blocking UX**: The platform shows the "Success" screen immediately. It doesn't wait for the email to finish sending, ensuring a snappy user experience.
*   **Security**: Sensitive API keys (like the Resend Key) are stored safely in Supabase Secrets, never exposed to the browser.
*   **Responsive HTML**: The emails are formatted with clean, professional HTML that works across all mail clients (Gmail, Outlook, etc.).

---

## ⚙️ Configuration & Setup

To make the email system work in production, you must set up your **Resend API Key**:

### 1. Get a Resend API Key
1.  Sign up at [resend.com](https://resend.com).
2.  Create an API Key.
3.  (Optional) Verify your domain (e.g., `famehub.in`) to send from a custom address instead of `onboarding@resend.dev`.

### 2. Add Secret to Supabase
Run this command in your terminal (using the Supabase CLI) or add it in the Supabase Dashboard under **Edge Functions > Secrets**:

```bash
supabase secrets set RESEND_API_KEY=re_your_actual_key_here
```

### 3. Edge Function Code
The source code for the email logic is located at:
`supabase/functions/send-booking-email/index.ts`

---

## 📝 Email Content

### Client Confirmation
*   **Subject**: Booking Confirmed – FAMEHUB Training
*   **Details**: Includes College Name, Contact Person, and the specifically booked date.

### Admin Notification
*   **Subject**: New Booking Received 🚀
*   **Details**: Full lead information including Phone, Email, and any additional Notes provided by the user.
