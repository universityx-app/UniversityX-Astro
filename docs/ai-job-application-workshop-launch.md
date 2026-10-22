# AI Job Application Assistant workshop launch

Route: `/workshop/build-an-ai-job-application-assistant-with-python/`

Free live session with Abasiodiong Udofia: **Saturday, October 24, 2026, 4:00 PM WAT**, lasting 60 minutes. Both countdowns use `2026-10-24T16:00:00+01:00` (15:00 UTC). The build uses pasted CV/job-description text. Confirmation links to the existing workshop WhatsApp group.

## PocketBase registration

The frontend uses the existing `PUBLIC_POCKETBASE_URL`. No new frontend environment variables or authentication credentials are required.

Registrations use `Build_an_AI_Job_Application_Assistant_with_Python`, the existing collection renamed by the owner from `AI_Customer_Support_Agent_Workshop`. Both workshop forms now target the renamed collection; no new collection, schema import, or migration is needed. This frontend change does not modify records or access rules.

The form retains required first/last name, email, Python experience, and cohort interest; optional WhatsApp number and referral code. Analytics retain the job-application workshop slug. The registration payload does not store a workshop identifier, so records from the two pages share the same collection without a per-workshop field.

## Launch checks

- Run `npm run check` and `npm run build`.
- On a non-production PocketBase instance, verify a valid registration targets `Build_an_AI_Job_Application_Assistant_with_Python`. Exercise optional WhatsApp, validation errors, and a failed submission followed by a successful retry.
- Check confirmation, the WhatsApp link, `?ref=...` capture, and PostHog events using the new workshop slug.
- Inspect desktop/mobile layouts, keyboard focus and FAQ controls, and both countdowns before and after the start time. The hero retains the reference markup/classes; copy and artwork are the permitted differences.
- Verify the new listing card has no rating, both workshop forms target the renamed collection, and the instructor's original description remains intact on the older page.
- Confirm canonical/social metadata, sitemap inclusion, and the October 31 cohort link/date.

Implementation validation passed Astro check and production build. A local mocked-script check covers registration states, countdowns, analytics, and generated markup. Browser visual checks and live PocketBase access-rule checks remain outstanding because those environments were unavailable. No production test registrations were created.

## Cover artwork

Saved asset: [`public/images/ai-job-application-workshop-cover.png`](../public/images/ai-job-application-workshop-cover.png). Replaced the generated illustration with the owner-provided `Downloads/Build an AI Job Application Assistant with Python.png`, copied without modification. The hero, workshop listing, and social metadata reference this asset.
