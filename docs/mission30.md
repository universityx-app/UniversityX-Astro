# Publishing Mission 30 updates

The public dashboard is `/mission30/`. It is a static Astro page using the normal site build and deployment. There is no recruitment database connection or browser publishing tool.

The campaign recruits 30 instructors across Nigeria and the United States from November 1, 2026 to January 1, 2027 for launches in Q1 2027 (January–March). The main count, seats, and percentage use `metrics.committed`: instructors who have agreed to launch with UniversityX in that window. A completed course, onboarding, pricing, or a published enrollment page is not required to count a commitment.

The initial qualified outreach target is 100 prospects, with rounded planning averages of approximately 12 people per week and 2 per day. These are goals, not caps or a promised conversion rate. Keep the Week 2 illustrative snapshot at 121 contacts and six commitments; exceeding the initial outreach goal is valid.

Allocate initial outreach 70% to Nigeria (70 prospects) and 30% to the United States (30 prospects). These shares are not instructor quotas or reported country results. Nigeria is the home market; the United States tests interest in the model in another market. The campaign country fields now contain only `NG` and `US`; removed countries had zero counts in the illustrative fixtures, and production history is still empty.

The early validation sought is independent instructors in Lagos and New York successfully teaching the same UniversityX course to their respective audiences. Recruitment alone does not validate that model. Pricing, learner demand, and instructor economics must be tested separately in each market. Use “courses” for learning content, “workshops” for focused practical sessions, and “live courses” for structured learning with an instructor and other learners.

The instructor offer includes workshops and live courses. Instructors can use or adapt existing resources, bring their own course, or co-create with UniversityX. Describe shared curriculum and AI support as a model being explored. Recruitment commitments alone do not demonstrate that curriculum reuse or the learning experience works; launches and later outcomes will inform that assessment.

## Add a verified snapshot

Edit `publishedMission` in `src/data/mission30.ts`. Append to `snapshots`; do not replace the history. Empty history means **unpublished** in the data. The scoreboard displays zero defaults until a snapshot is published and shows the measurement date once one is available. Add a zero snapshot only when that is a verified measurement.

```ts
{
  id: 'verified-2026-11-01',
  measuredAt: '2026-11-01T09:00:00+01:00',
  metrics: {
    contacted: 0, positiveReplies: 0, discoveryCalls: 0,
    committed: 0, onboarded: 0, activated: 0, paidEnrollments: 0,
  },
  countries: { NG: 0, US: 0 },
}
```

This is a format example, not permission to publish unverified zeros. Use an offset-bearing timestamp for when the counts were measured, not when the file was edited. Snapshots must fall within the campaign interval. The page chooses the latest measurement even if entries are out of order.

Count unique instructors cumulatively at each stage. Each later stage is a subset of the preceding one: contacted → positive replies → completed discovery calls → committed → onboarding complete → activated → at least one paid enrollment. Multiple calls or purchases do not increase a person's count. Assign each activated instructor to one campaign country, consistently, so country totals equal activations. Targets are goals rather than hard caps.

The existing downstream fields (`onboarded`, `activated`, `paidEnrollments`, and the country activation split) remain in the data format for compatibility but do not drive the campaign goal or appear in the scoreboard. Activation tracks a later milestone: completed onboarding, an approved workshop or live course with curriculum and pricing, and a published enrollment page. The paid-enrollment metric counts instructors, not payments or revenue. These are not recruitment requirements for Mission 30.

Correct historical errors explicitly and describe significant corrections in a field note. Validation allows decreases between snapshots. Do not create new observations by copying a stale count to a newer date.

## Publish a daily or weekly field note

Append an entry to `publishedMission.notes` with `id`, `publishedAt`, `cadence` (`Daily`, `Weekly`, or `Kickoff`), `author` (`Damilare`, `Ada`, or `Damilare & Ada`), `title`, `introduction`, `wins`, `challenges`, `experiments`, and `lessons`. All prose fields are plain text. Notes sort newest first and have linkable IDs. Use unique lowercase IDs separated by hyphens across both notes and snapshots.

Only put approved, publication-ready prose in this file. There is no draft/scheduling mechanism: entries are published on deployment. Keep drafts, names of prospects, contact information, conversations, credentials, and private records outside the website repository. Before deploying, review every change for accuracy and public suitability. Publishing a note does not update the displayed metrics measurement date.

## Preview and verify

- `/mission30/preview/day-1/`: all-zero illustrative launch, frozen at November 1, 2026.
- `/mission30/preview/week-2/`: illustrative progress, frozen at November 14, 2026.

Never copy sample fixtures into the published dataset. Preview routes have their own labels, social card and `noindex, nofollow`, and are excluded from the sitemap. They remain publicly accessible URLs, not private drafts. Production and previews share the same presentation without a public scenario switcher.

The live clock uses midnight **Africa/Lagos (UTC+1)** from November 1, 2026 to January 1, 2027: exactly 61 elapsed days. It runs on the visitor's clock, uses minute precision, and clamps to zero after the deadline. Without JavaScript, the explicit deadline remains visible. Preview clocks are frozen.

Run with Node 22.21+ (the existing local version):

```text
npm run test:mission30
npm run check
npm run build
npm run test:mission30 -- --built
```

The tests cover unpublished versus confirmed-zero data, preview isolation, date validation, and generated output. They support adding verified production updates without changing the tests. Browser review should cover all three routes at 360, 390, 768 and 1440 pixels, keyboard use, no-JavaScript content, copy/share fallback and reduced motion.

Deploy through the existing site workflow after review. No hosting configuration or secrets are needed. If a future data source is connected, adapt its **approved aggregate output** to `MissionData` at build time; keep private recruitment records outside the public page.

Social cards are code-authored and contain goals, not results. Regenerate with `node scripts/generate-mission30-social.mjs` using the existing Sharp package if the campaign identity changes.
