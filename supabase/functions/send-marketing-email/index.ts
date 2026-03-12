
// Follow this setup guide to integrate the Deno runtime for Supabase Edge Functions: https://supabase.com/docs/guides/functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { subject, html, type, recipient, target } = await req.json();

        if (!RESEND_API_KEY) {
            return new Response(JSON.stringify({ error: "Configuration Error: RESEND_API_KEY is missing in Supabase Secrets." }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        let to = [];
        let bcc = [];

        if (type === 'fetch_contacts') {
            // New Action: List all contacts from Resend so admin can select them
            console.log("Fetching contacts list for selection...");
            let allContacts: any[] = [];
            let debugLog: string[] = [];

            // 1. Fetch from Generic 'contacts' endpoint (often where main list lives)
            try {
                const globalContactsRes = await fetch("https://api.resend.com/contacts", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
                });
                const globalData = await globalContactsRes.json();
                if (globalData.data) {
                    allContacts = [...allContacts, ...globalData.data];
                    debugLog.push(`Found ${globalData.data.length} contacts in global list.`);
                }
            } catch (e: any) {
                console.error("Error fetching global contacts:", e);
                debugLog.push(`Error fetching global: ${e.message}`);
            }

            // 2. Fetch from Specific Audiences (iterate ALL of them)
            try {
                const audienceRes = await fetch("https://api.resend.com/audiences", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
                });
                const audienceData = await audienceRes.json();

                if (audienceData.data && audienceData.data.length > 0) {
                    debugLog.push(`Found ${audienceData.data.length} audiences.`);
                    for (const audience of audienceData.data) {
                        try {
                            const contactsRes = await fetch(`https://api.resend.com/audiences/${audience.id}/contacts`, {
                                method: "GET",
                                headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
                            });
                            const contactsData = await contactsRes.json();
                            if (contactsData.data) {
                                allContacts = [...allContacts, ...contactsData.data];
                                debugLog.push(`Audience ${audience.name || audience.id}: Found ${contactsData.data.length} contacts.`);
                            }
                        } catch (e: any) {
                            console.error(`Error fetching contacts for audience ${audience.id}:`, e);
                            debugLog.push(`Error fetching audience ${audience.id}: ${e.message}`);
                        }
                    }
                } else {
                    debugLog.push("No specific audiences found.");
                }
            } catch (e: any) {
                debugLog.push(`Error fetching audiences: ${e.message}`);
            }

            // Deduplicate by email
            const uniqueContacts = Array.from(new Map(allContacts.map(item => [item.email, item])).values());
            console.log(`returning ${uniqueContacts.length} unique contacts`);

            return new Response(JSON.stringify({
                contacts: uniqueContacts,
                debug: debugLog
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });

        } else if (type === 'test') {
            // Test Mode: Send only to admin
            to = ["admin@propmatchspot.com"];
        } else {
            // Campaign Mode: Determine Source

            // If explicit recipients provided (Manual Selection Mode), use them
            if (recipient && Array.isArray(recipient) && recipient.length > 0) {
                console.log(`Using ${recipient.length} manually selected recipients.`);
                bcc = recipient;
            } else if (target === 'resend_contacts') {
                // FETCH FROM RESEND AUDIENCE (External 7000+ list)
                console.log("Fetching contacts from Resend Audience...");

                // 1. Get Audience ID (if needed) or just list contacts
                // For simplicity/robustness, we fetch contacts directly if possible, or list audiences first.
                // We'll try listing audiences to find the default one.
                const audienceRes = await fetch("https://api.resend.com/audiences", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
                });
                const audienceData = await audienceRes.json();

                let allContacts = [];

                if (audienceData.data && audienceData.data.length > 0) {
                    const audienceId = audienceData.data[0].id;
                    const contactsRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
                    });
                    const contactsData = await contactsRes.json();
                    if (contactsData.data) {
                        allContacts = contactsData.data.map(c => c.email);
                    }
                } else {
                    // Fallback: Try generic contacts endpoint if available or audience empty
                    const contactsRes = await fetch(`https://api.resend.com/contacts`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
                    });
                    const contactsData = await contactsRes.json();
                    if (contactsData.data) {
                        allContacts = contactsData.data.map(c => c.email);
                    }
                }
                bcc = allContacts;
            } else {
                // FETCH FROM SUPABASE DB (App Users)
                // Initialize Supabase Client
                const supabase = createClient(
                    SUPABASE_URL ?? '',
                    SUPABASE_ANON_KEY ?? ''
                );

                // Fetch emails
                const { data: profiles, error } = await supabase
                    .from('profiles')
                    .select('email')
                    .not('email', 'is', null); // Ensure we get valid emails

                if (error) throw error;
                // Extract emails
                bcc = profiles.map(p => p.email);
            }

            if (bcc.length === 0) {
                return new Response(JSON.stringify({ message: "No subscribers found to send to." }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 200,
                });
            }

            // SAFETY: In production, send to 'bcc' to hide emails from each other
            // 'to' field must have at least one valid email. Usually we put the sender or a 'noreply' there.
            to = ["admin@propmatchspot.com"];

            // Resend has a limit (usually 50) for BCC per request.

            // We must batch the requests.
            const BATCH_SIZE = 50;
            const batches = [];
            for (let i = 0; i < bcc.length; i += BATCH_SIZE) {
                batches.push(bcc.slice(i, i + BATCH_SIZE));
            }

            console.log(`Sending to ${bcc.length} users in ${batches.length} batches.`);

            // Loop through batches and send
            // Note: In Edge Functions, be careful of timeouts for very large lists (7000+).
            // For 7000, this loop might take ~30-60s, which is risky. 
            // Ideally, offload to a queue, but for now we attempt sequential batching.
            const results = [];
            for (const batch of batches) {
                const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                        from: "Prop Match Spot <info@propmatchspot.com>", // Updated to verified domain
                        to: to,
                        bcc: batch, // Current batch
                        subject: subject,
                        html: html,
                    }),
                });
                const json = await res.json();
                results.push(json);
            }

            return new Response(JSON.stringify({ message: "Campaign sent", batches: results.length, count: bcc.length, success: true }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }
    } catch (error) {
        // Return 200 even on error so client can read the message
        return new Response(JSON.stringify({ error: error.message, success: false }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200, // Return 200 to avoid FunctionsHttpError hiding the body
        });
    }
});
