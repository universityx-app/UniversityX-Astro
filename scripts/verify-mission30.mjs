import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { campaign, countries, stages, getCampaignClock, latestSnapshot, orderedSnapshots, orderedNotes, validateMissionData } from '../src/lib/mission30.ts';
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
  assert.deepEqual(latestSnapshot(missionPreviews['week-2']).countries, { NG: 2, US: 1 });
  assert.deepEqual(countries.map(({ code, outreachShare }) => [code, outreachShare]), [['NG', 70], ['US', 30]]);
});

test('November 2 recruitment counts include pre-launch replies without requiring a dispatch', () => {
  const snapshot = publishedMission.snapshots.find(s => s.id === 'verified-nov-02');
  assert.ok(snapshot);
  assert.deepEqual(snapshot.metrics, {
    contacted: 7, positiveReplies: 3, discoveryCalls: 0, committed: 0, onboarded: 0, activated: 0, paidEnrollments: 0,
  });
  const countersOnly = { ...publishedMission, snapshots: [snapshot], notes: [] };
  assert.doesNotThrow(() => validateMissionData(countersOnly));
  assert.equal(latestSnapshot(countersOnly).measuredAt, '2026-11-02T00:00:00+01:00');
  assert.equal(stages.find(stage => stage.key === 'positiveReplies').label, 'Replies');
  assert.equal(stages.find(stage => stage.key === 'positiveReplies').description, 'Unique prospects who have responded to our outreach.');
});

test('published field notes allow one weekly Saturday dispatch in Lagos, independently of counters', () => {
  const data = structuredClone(publishedMission);
  const snapshotBefore = latestSnapshot(data);
  const note = { ...missionPreviews['week-2'].notes[1], id: 'test-weekly-dispatch', publishedAt: '2026-11-06T23:00:00Z' };
  data.notes = [note];
  assert.doesNotThrow(() => validateMissionData(data)); // Saturday midnight in Lagos, Friday UTC.
  assert.deepEqual(latestSnapshot(data), snapshotBefore);
  for (const publishedAt of ['2026-11-06T22:59:59Z', '2026-11-07T23:00:00Z']) {
    note.publishedAt = publishedAt;
    assert.throws(() => validateMissionData(data), /Saturday dispatches/);
  }
  note.publishedAt = '2026-11-07T12:00:00+01:00';
  note.cadence = 'Daily';
  assert.throws(() => validateMissionData(data), /Saturday dispatches/);
  note.cadence = 'Weekly';
  data.notes.push({ ...note, id: 'test-second-dispatch', publishedAt: '2026-11-07T18:00:00+01:00' });
  assert.throws(() => validateMissionData(data), /one published dispatch/);
  data.notes[1].publishedAt = '2026-11-14T18:00:00+01:00';
  assert.doesNotThrow(() => validateMissionData(data));
  assert.deepEqual(latestSnapshot(data), snapshotBefore);
  assert.doesNotThrow(() => validateMissionData(missionPreviews['day-1']));
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
  test('campaign routes use two markets with clear teaching terminology', () => {
    for (const path of ['mission30', 'mission30/preview/day-1', 'mission30/preview/week-2']) {
      const page = html(path);
      assert.match(page, /30 Instructors\. 2 Countries\. One Mission\./);
      const missionContent = page.match(/<main id="mission-main">([\s\S]*?)<\/main>/)?.[1]?.replace(/<[^>]*>/g, ' ');
      assert.ok(missionContent);
      assert.doesNotMatch(missionContent, /4 Countries|four countries|United Kingdom|Canada|London|\bcohorts?\b|\bintensives?\b/i);
    }
    const teachPage = html('teach');
    // The shared navigation may still link to /cohorts; check visible text, not URL paths.
    const teachContent = teachPage.match(/<h1[\s\S]*?<footer/)?.[0]?.replace(/<[^>]*>/g, ' ');
    assert.ok(teachContent);
    assert.match(teachContent, /workshops.*live courses/i);
    assert.doesNotMatch(teachContent, /\bcohorts?\b|\bintensives?\b/i);
  });
  test('built public page never includes illustrative data or notes', () => {
    const page = html('mission30');
    const scoreboard = page.match(/id="progress"[\s\S]*?<\/section>/)?.[0];
    assert.ok(scoreboard);
    const counts = [...scoreboard.matchAll(/<strong\b[^>]*>(\d+)<\/strong>/g)].map(match => Number(match[1]));
    const metrics = latestSnapshot(publishedMission)?.metrics;
    assert.deepEqual(counts, ['contacted', 'positiveReplies', 'discoveryCalls', 'committed'].map(key => metrics?.[key] ?? 0));
    assert.match(scoreboard, />Replies<\/h3>/);
    assert.match(scoreboard, /Unique prospects who have responded to our outreach\./);
    assert.doesNotMatch(scoreboard, /Positive replies/);
    const fieldNotes = page.match(/id="field-notes"[\s\S]*?<\/section>/)?.[0];
    assert.ok(fieldNotes);
    assert.match(fieldNotes, /Weekly dispatches every Saturday/);
    assert.doesNotMatch(fieldNotes, /Daily or weekly/);
    if (!publishedMission.notes.length) {
      assert.match(fieldNotes, /Saturday, November 7, 2026/);
      assert.doesNotMatch(fieldNotes, /<article\b/);
    }
    if (!publishedMission.snapshots.length) {
      const scoreboard = page.match(/id="progress"[\s\S]*?<\/section>/)?.[0];
      assert.ok(scoreboard);
      assert.equal((scoreboard.match(/<strong\b[^>]*>0<\/strong>/g) ?? []).length, 4);
    } else {
      assert.match(page, /Published metrics/);
    }
    assert.doesNotMatch(page, /sample-week|sample-kickoff|121 prospects|data-frozen-time=|Illustrative preview/);
    assert.match(page, /href="\/teach\/#apply-to-teach"/);
    assert.match(page, /mission30-social\.png/);
    assert.doesNotMatch(page, /name="robots" content="noindex/);
  });
  test('preview output is labeled, non-indexed, accessible and uses frozen dates', () => {
    for (const scenario of ['day-1', 'week-2']) {
      const page = html(`mission30/preview/${scenario}`);
      assert.match(page, /Illustrative preview — not actual results/);
      assert.match(page, /name="robots" content="noindex, nofollow"/);
      assert.match(page, /Illustrative field note/);
      assert.match(page, /Illustrative metrics/);
      assert.match(page, /mission30-preview-social\.png/);
      assert.match(page, /data-frozen-time="2026-11-/);
      assert.ok(page.includes(`/mission30/preview/${scenario}`));
      assert.match(page, /href="\/mission30\/"/);
    }
    const weekTwoPage = html('mission30/preview/week-2');
    assert.match(weekTwoPage, /Six commitments/);
    assert.match(weekTwoPage, />6<\/span>[\s\S]*?instructors committed/);
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
