import { validateMissionData, type MissionData, type Snapshot, type FieldNote } from '../lib/mission30.ts';

// PUBLIC CONTENT ONLY. Append verified aggregate snapshots and approved notes.
// An empty history means unpublished, not zero. See docs/mission30.md.
export const publishedMission: MissionData = {
  kind: 'published',
  label: 'Published progress',
  snapshots: [],
  notes: [],
};

// Everything below is illustrative and rendered ONLY on explicit preview routes.
const kickoff: Snapshot = {
  id: 'sample-nov-01', measuredAt: '2026-11-01T00:00:00+01:00',
  metrics: { contacted: 0, positiveReplies: 0, discoveryCalls: 0, committed: 0, onboarded: 0, activated: 0, paidEnrollments: 0 },
  countries: { NG: 0, US: 0 },
};
const weekOne: Snapshot = {
  id: 'sample-nov-07', measuredAt: '2026-11-07T00:00:00+01:00',
  metrics: { contacted: 54, positiveReplies: 14, discoveryCalls: 7, committed: 3, onboarded: 2, activated: 1, paidEnrollments: 0 },
  countries: { NG: 1, US: 0 },
};
const weekTwo: Snapshot = {
  id: 'sample-nov-14', measuredAt: '2026-11-14T00:00:00+01:00',
  metrics: { contacted: 121, positiveReplies: 32, discoveryCalls: 16, committed: 6, onboarded: 4, activated: 3, paidEnrollments: 1 },
  countries: { NG: 2, US: 1 },
};
const intro: FieldNote = {
  id: 'sample-kickoff', publishedAt: kickoff.measuredAt, cadence: 'Kickoff', author: 'Damilare & Ada',
  title: 'Starting with a blank page. And a big promise.',
  introduction: 'This is an illustrative opening entry. The mission starts with a simple question: can two people find 30 practitioners ready to launch with UniversityX in Q1 2027?',
  wins: 'The mission has a clear recruitment goal: 30 instructors committed to the Q1 2027 launch.',
  challenges: 'There are no recruitment results yet. Every conversation is still ahead of us.',
  experiments: 'Start with personal outreach and learn which invitation makes practitioners curious.',
  lessons: 'Interest is a starting point. A commitment means agreeing to launch with UniversityX in Q1 2027.',
};
const firstWeek: FieldNote = {
  id: 'sample-week-one', publishedAt: weekOne.measuredAt, cadence: 'Weekly', author: 'Ada',
  title: 'Three commitments. The conversations are taking shape.',
  introduction: 'In this sample week, 54 introductions turn into seven discovery calls and three commitments to launch in Q1 2027. Small numbers, useful signals.',
  wins: 'Three prospective instructors agree to join the Q1 2027 launch.',
  challenges: 'Interested practitioners need a clearer picture of the time involved before committing.',
  experiments: 'Discuss teaching interests and Q1 availability during discovery calls.',
  lessons: 'Specific examples of what learners will build make the teaching opportunity clearer.',
};
const secondWeek: FieldNote = {
  id: 'sample-week-two', publishedAt: weekTwo.measuredAt, cadence: 'Weekly', author: 'Damilare',
  title: 'Six commitments. Plenty still to figure out.',
  introduction: 'This illustrative checkpoint reaches 121 prospects, 16 discovery calls and six commitments to launch with UniversityX in Q1 2027.',
  wins: 'Six instructors agree to build toward the Q1 launch with us.',
  challenges: 'We still need to work through teaching schedules and support needs together.',
  experiments: 'Send a short outline of the next steps after each discovery call.',
  lessons: 'Being clear about the launch window helps people decide whether they can commit.',
};

export const missionPreviews: Record<'day-1' | 'week-2', MissionData> = {
  'day-1': { kind: 'illustrative', label: 'Day 1', asOf: kickoff.measuredAt, snapshots: [kickoff], notes: [intro] },
  'week-2': { kind: 'illustrative', label: 'Week 2', asOf: weekTwo.measuredAt, snapshots: [kickoff, weekOne, weekTwo], notes: [intro, firstWeek, secondWeek] },
};

validateMissionData(publishedMission);
Object.values(missionPreviews).forEach(validateMissionData);
