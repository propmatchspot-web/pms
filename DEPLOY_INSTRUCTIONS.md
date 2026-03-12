# How to Deploy the Email Function

**1. Open your Terminal**
- In VS Code, look at the top menu bar.
- Click **Terminal** -> **New Terminal**.
- Or press `Ctrl` + `~` (the key above Tab).

**2. Login to Supabase CLI**
Copy and paste this command, then press Enter:
```powershell
npx supabase login
```
- It will ask you to press Enter to open a browser.
- Log in to Supabase in the browser.
- It might automatically login, or ask you to copy a token. If it gives a token, paste it into the terminal.

**3. Link Your Project**
Copy and paste this command:
```powershell
npx supabase link --project-ref bolltbelnkxrosiudosi
```
*(I found this ID from your Supabase URL)*
- It might ask for your database password.
- **Tip:** If you don't know your database password, you can go to [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> Database -> "Reset database password" to set a new one.

**4. Deploy the Function**
Finally, run this command to push the code I wrote to the cloud:
```powershell
npx supabase functions deploy send-marketing-email --no-verify-jwt
```

**5. Test It**
- Go to your app's **Admin Panel** -> **Marketing**.
- Type a subject and body.
- Click "Send Test to Me".
