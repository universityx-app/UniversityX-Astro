# AI cohort launch configuration

The Astro site remains a static marketing frontend. For this launch, it sends learners to Paystack-hosted payment pages and records a short post-payment registration in PocketBase for manual reconciliation.

## Build-time variables

Set these variables for the production Astro build:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_PAYSTACK_FULL_PAYMENT_URL` | Paystack Payment Page for the ₦20,000 full payment |
| `PUBLIC_PAYSTACK_INSTALLMENT_PAYMENT_URL` | Paystack Payment Page for the first ₦10,500 installment |
| `PUBLIC_POCKETBASE_URL` | Existing PocketBase public API origin |

The two payment URLs must use HTTPS and have a `paystack.com` host (including Paystack subdomains). A missing or invalid URL leaves that payment option unavailable instead of exposing a broken checkout.

Configure each Paystack page to return to the cohort enrollment route:

- full payment: `/cohort/build-and-ship-ai-applications-with-python/enrollment/?payment_option=full`
- installment: `/cohort/build-and-ship-ai-applications-with-python/enrollment/?payment_option=installment`

The query value is only a reconciliation hint. The Astro site never claims that it verifies a Paystack payment.

## PocketBase collection

Copy the current-version PocketBase migration [`202609210001_create_cohort_payment_registrations.js`](./pocketbase/202609210001_create_cohort_payment_registrations.js) into the PocketBase application's `pb_migrations` directory, then deploy the trusted hook [`cohort-payment-registration.pb.js`](./pocketbase/cohort-payment-registration.pb.js) in its `pb_hooks` directory. The root [`cohort_payment_registrations_schema.json`](../cohort_payment_registrations_schema.json) is also included as a flattened-schema reference for dashboard/API import workflows.

The collection is `Cohort_Payment_Registrations`. Its access policy is deliberately narrow:

- anonymous valid creates are allowed;
- anonymous list, view, update, and delete are denied;
- a create request containing `payment_verification_status` is denied;
- the trusted PocketBase hook sets every new record to `unverified`;
- only authenticated PocketBase administration can change the verification status.

Astro sends only the cohort slug, learner details, payment option, and optional answers. It never sends `payment_verification_status`.

## Access-rule verification

Run the destructive integration check only against an approved non-production PocketBase deployment:

```powershell
$env:POCKETBASE_URL = "https://your-test-pocketbase.example"
$env:POCKETBASE_SUPERUSER_TOKEN = "a-short-lived-superuser-token"
$env:COHORT_ACCESS_TEST_ACK = "1"
npm run test:cohort-access
```

The script creates and removes one test registration. It verifies valid anonymous create, server-side `unverified` initialization, rejection of invalid/status-injected creates, denial of public list/view/update/status-change/delete, and a trusted status update.

Do not run it against production learner data. Do not commit the superuser token.

## Scholarship

The existing `/scholarship/` form remains separate. It continues to use its current collection and clearly states that support is limited, partial, and not guaranteed.
