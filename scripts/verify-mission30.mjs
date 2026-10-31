import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { campaign, getCampaignClock, latestSnapshot, orderedSnapshots, orderedNotes, validateMissionData } from '../src/lib/mission30.ts';
import { publishedMission, missionPreviews } from '../src/data/mission30.ts';

test('campaign uses an exact 61-day interval and Lagos midnight boundaries', () => {
  const start = Date.parse(campaign.start);
  const end = Date.parse(campaign.end);
  assert.equal((end - start) / 86_400_000, 61);
  assert.equal(new Date(start).toISOString(), '2026-10-31T23:00:00.000Z');
  assert.equal(new Date(end).toISOString(), '2026-12-31T23:00:00.000Z');
  assert.equal(getCampaignClock(start - 1).status, 'scheduled');
  assert.deepEqual(getCampaignClock(start), { status: 'active', days: 61, hours: 0, minutes: 0 });
  assert.equal(getCampaignClock(end - 1).status, 'active');
  assert.deepEqual(getCampaignClock(end), { status: 'ended', days: 0, hours: 0, minutes: 0 });
  assert.deepEqual(getCampaignClock(end + 86_400_000), getCampaignClock(end));
});

test('missing data stays distinct from zero and scenario clocks are frozen independently', () => {
  assert.equal(publishedMission.kind, 'published');
  assert.equal(publishedMission.asOf, undefined);
  assert.equal(latestSnapshot({ ...publishedMission, snapshots: [] }), undefined);
  assert.doesNotThrow(() => validateMissionData(publishedMission));
  assert.equal(getCampaignClock(Date.parse(missionPreviews['day-1'].asOf)).days, 61);
  assert.equal(getCampaignClock(Date.parse(missionPreviews['week-2'].asOf)).days, 48);
  assert.ok(Object.values(latestSnapshot(missionPreviews['day-1']).metrics).every(v => v === 0));
  assert.deepEqual(latestSnapshot(missionPreviews['week-2']).metrics, {
    contacted: 121, positiveReplies: 32, discoveryCalls: 16, committed: 6, onboarded: 4, activated: 3, paidEnrollments: 1,
  });
  assert.deepEqual(latestSnapshot(missionPreviews['week-2']).countries, { NG: 2, US: 1, GB: 0, CA: 0 });
});

test('history is ordered by measurement, independently of note publication', () => {
  const data = structuredClone(missionPreviews['week-2']);
  data.snapshots.reverse();
  assert.equal(latestSnapshot(data).metrics.contacted, 121);
  assert.deepEqual(orderedSnapshots(data).map(s => s.metrics.activated), [0, 1, 3]);
  assert.equal(orderedNotes(data)[0].id, 'sample-week-two');
  data.notes[2].publishedAt = '2026-11-13T18:00:00+01:00';
  assert.equal(latestSnapshot(data).measuredAt, '2026-11-14T00:00:00+01:00');
});

test('validation rejects malformed public data and accepts corrected totals', () => {
  for (const mutate of [
    d => { d.snapshots[2].metrics.contacted = -1; },
    d => { d.snapshots[2].metrics.activated = 3.5; },
    d => { d.snapshots[2].metrics.paidEnrollments = 4; },
    d => { d.snapshots[2].countries.NG = 3; },
    d => { d.snapshots[2].id = d.snapshots[0].id; },
    d => { d.notes[0].id = d.snapshots[0].id; },
    d => { d.snapshots[2].measuredAt = d.snapshots[0].measuredAt; },
    d => { d.snapshots[2].measuredAt = '2026-11-31T00:00:00+01:00'; },
    d => { d.snapshots[2].measuredAt = '2026-11-14'; },
    d => { d.snapshots[2].measuredAt = '2027-01-02T00:00:00+01:00'; },
    d => { d.notes[0].publishedAt = '2026-11-15T00:00:00+01:00'; },
    d => { d.notes[0].lessons = ''; },
    d => { d.asOf = undefined; },
  ]) {
    const data = structuredClone(missionPreviews['week-2']);
    mutate(data);
    assert.throws(() => validateMissionData(data), /Mission 30/);
  }
  const correction = structuredClone(missionPreviews['week-2']);
  correction.snapshots[2].metrics = { ...correction.snapshots[0].metrics };
  correction.snapshots[2].countries = { ...correction.snapshots[0].countries };
  assert.doesNotThrow(() => validateMissionData(correction));
});

if (process.argv.includes('--built')) {
  const html = path => readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');
  test('built public page never includes illustrative data or notes', () => {
    const page = html('mission30');
    if (!publishedMission.snapshots.length) {
      const scoreboard = page.match(/id="progress"[\s\S]*?<\/section>/)?.[0];
      assert.ok(scoreboard);
      assert.equal((scoreboard.match(/<strong\b[^>]*>0<\/strong>/g) ?? []).length, 4);
    } else {
      assert.match(page, /Published metrics/);
    }
    assert.doesNotMatch(page, /sample-week|sample-kickoff|121 prospects|data-frozen-time=|Illustrative preview/);
    assert.match(page, /href="\/teach\/#apply-to-teach"/);
    assert.match(page, /mission30-social.png/);
    assert.doesNotMatch(page, /name="robots" content="noindex/);
  });
  test('preview output is labeled, non-indexed, accessible and uses frozen dates', () => {
    for (const scenario of ['day-1', 'week-2']) {
      const page = html(`mission30/preview/${scenario}`);
      assert.match(page, /Illustrative preview — not actual results/);
      assert.match(page, /name="robots" content="noindex, nofollow"/);
      assert.match(page, /Illustrative field note/);
      assert.match(page, /Illustrative metrics/);
      assert.match(page, /mission30-preview-social.png/);
      assert.match(page, /data-frozen-time="2026-11-/);
      assert.ok(page.includes(`/mission30/preview/${scenario}`));
      assert.match(page, /href="\/mission30\/"/);
    }
    const weekTwoPage = html('mission30/preview/week-2');
    assert.match(weekTwoPage, /Six commitments/);
    assert.match(weekTwoPage, /THE INSTRUCTOR ROLL CALL[\s\S]*?>6<\/span>[\s\S]*?instructors committed/);
    assert.doesNotMatch(weekTwoPage, /instructors activated|Instructors to activate/);
    const sitemap = readdirSync(new URL('../dist/', import.meta.url)).filter(f => /^sitemap.*\.xml$/.test(f)).map(f => readFileSync(new URL(`../dist/${f}`, import.meta.url), 'utf8')).join('');
    assert.match(sitemap, /\/mission30\//);
    assert.doesNotMatch(sitemap, /\/mission30\/preview\//);
    for (const name of ['mission30-social.png', 'mission30-preview-social.png']) {
      const png = readFileSync(new URL(`../dist/images/${name}`, import.meta.url));
      assert.equal(png.readUInt32BE(16), 1200);
      assert.equal(png.readUInt32BE(20), 630);
    }
  });
}
