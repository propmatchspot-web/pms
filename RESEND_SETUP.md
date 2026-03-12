# Resend & Supabase Setup Guide

Since you have already **verified your domain**, here are the next steps to get the emailing system working.

## Step 1: Get Your API Key
1.  Go to the [Resend Dashboard](https://resend.com/api-keys).
2.  Click **Create API Key**.
3.  Name it (e.g., "Supabase Connection").
4.  **Copy the key** (starts with `re_...`). You won't be able to see it again.

## Step 2: Save Key in Supabase (Local Dev)
1.  Open your project's `.env` file in the root directory.
2.  Add this line at the bottom:
    ```env
    RESEND_API_KEY=re_123456789_your_key_here
    ```

## Step 3: Save Key in Supabase (Production)
If you are deploying this to a live Supabase project:
1.  Go to your **Supabase Dashboard** > **Settings** > **Edge Functions**.
2.  Add a new secret named `RESEND_API_KEY` and paste your key there.

## Step 4: Deploy the Backend Function
I will create a file called `supabase/functions/send-marketing-email/index.ts`. You will need to deploy this to Supabase.

**Command to run in terminal:**
```bash
npx supabase functions deploy send-marketing-email --no-verify-jwt
```
*(If you don't have the Supabase CLI installed, I can provide instructions for that too, or we can just run it locally first).*
