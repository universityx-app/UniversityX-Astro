export const campaign = {
  start: '2026-11-01T00:00:00+01:00',
  end: '2027-01-01T00:00:00+01:00',
  timeZone: 'Africa/Lagos',
  target: 30,
  prospectTarget: 300,
  weeklyOutreachTarget: 35,
  dailyOutreachTarget: 4,
  paidTarget: 5,
} as const;

export const countries = [
  { code: 'NG', name: 'Nigeria', target: 18 },
  { code: 'US', name: 'United States', target: 5 },
  { code: 'GB', name: 'United Kingdom', target: 4 },
  { code: 'CA', name: 'Canada', target: 3 },
] as const;

export const stages = [
  { key: 'contacted', label: 'Contacted', description: 'Unique prospects contacted about teaching.' },
  { key: 'positiveReplies', label: 'Positive replies', description: 'Prospects who expressed interest in teaching.' },
  { key: 'discoveryCalls', label: 'Discovery calls', description: 'Interested prospects who completed a discovery call.' },
  { key: 'committed', label: 'Committed', description: 'Instructors who agreed to launch with UniversityX in Q1 2027.' },
  { key: 'onboarded', label: 'Onboarded', description: 'Committed instructors who completed onboarding.' },
  { key: 'activated', label: 'Activated', description: 'Onboarded instructors with an approved, enrollment-ready course or cohort.' },
  { key: 'paidEnrollments', label: 'Generating paid enrollments', description: 'Activated instructors with at least one paid enrollment.' },
] as const;

export type CountryCode = typeof countries[number]['code'];
export type Metrics = Record<typeof stages[number]['key'], number>;
export interface Snapshot {
  id: string;
  measuredAt: string;
  metrics: Metrics;
  countries: Record<CountryCode, number>;
}
export interface FieldNote {
  id: string;
  publishedAt: string;
  cadence: 'Kickoff' | 'Daily' | 'Weekly';
  author: 'Damilare' | 'Ada' | 'Damilare & Ada';
  title: string;
  introduction: string;
  wins: string;
  challenges: string;
  experiments: string;
  lessons: string;
}
export interface MissionData {
  kind: 'published' | 'illustrative';
  label: string;
  asOf?: string;
  snapshots: Snapshot[];
  notes: FieldNote[];
}

export function getCampaignClock(now: number) {
  const start = Date.parse(campaign.start);
  const end = Date.parse(campaign.end);
  const remainingMinutes = Math.max(0, Math.ceil((end - now) / 60_000));
  return {
    status: now < start ? 'scheduled' : now < end ? 'active' : 'ended',
    days: Math.floor(remainingMinutes / 1440),
    hours: Math.floor((remainingMinutes % 1440) / 60),
    minutes: remainingMinutes % 60,
  };
}

export function formatMissionDate(value: string, short = false) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: campaign.timeZone, day: 'numeric', month: short ? 'short' : 'long',
    ...(short ? {} : { year: 'numeric' as const }),
  }).format(new Date(value));
}

// Timestamps must include their offset; reject normalized dates such as February 30.
function timestamp(value: string): number {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/.exec(value);
  const time = Date.parse(value);
  if (!match || !Number.isFinite(time) || Number(match[2]) > 23 || Number(match[3]) > 59 || Number(match[4]) > 59 || new Date(`${match[1]}T00:00:00Z`).toISOString().slice(0, 10) !== match[1]) {
    throw new Error(`Mission 30: invalid timestamp ${value}`);
  }
  return time;
}

export function validateMissionData(data: MissionData): void {
  if (data.kind !== 'published' && data.kind !== 'illustrative') throw new Error('Mission 30: invalid data kind');
  if (data.kind === 'illustrative' && !data.asOf) throw new Error('Mission 30: preview requires a frozen date');
  if (data.kind === 'published' && data.asOf) throw new Error('Mission 30: published clock must be live');
  const ceiling = data.asOf ? timestamp(data.asOf) : Infinity;
  const ids = new Set<string>();
  const dates = new Set<number>();
  const unique = (id: string) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) throw new Error(`Mission 30: invalid or duplicate id ${id}`);
    ids.add(id);
  };
  for (const snapshot of data.snapshots) {
    unique(snapshot.id);
    const measured = timestamp(snapshot.measuredAt);
    if (measured < Date.parse(campaign.start) || measured > Date.parse(campaign.end) || measured > ceiling || dates.has(measured)) throw new Error('Mission 30: invalid or duplicate observation date');
    dates.add(measured);
    let previous = Infinity;
    for (const stage of stages) {
      const count = snapshot.metrics[stage.key];
      if (!Number.isSafeInteger(count) || count < 0 || count > previous) throw new Error(`Mission 30: inconsistent funnel at ${stage.key}`);
      previous = count;
    }
    let total = 0;
    for (const country of countries) {
      const count = snapshot.countries[country.code];
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Mission 30: invalid country count');
      total += count;
    }
    if (total !== snapshot.metrics.activated) throw new Error('Mission 30: country totals must match activations');
  }
  for (const note of data.notes) {
    unique(note.id);
    if (timestamp(note.publishedAt) > ceiling) throw new Error('Mission 30: note is newer than preview date');
    for (const key of ['title', 'introduction', 'wins', 'challenges', 'experiments', 'lessons'] as const) {
      if (!note[key]?.trim()) throw new Error(`Mission 30: note is missing ${key}`);
    }
    if (!['Damilare', 'Ada', 'Damilare & Ada'].includes(note.author) || !['Kickoff', 'Daily', 'Weekly'].includes(note.cadence)) throw new Error('Mission 30: invalid note author or cadence');
  }
}

export function orderedSnapshots(data: MissionData) {
  return [...data.snapshots].sort((a, b) => Date.parse(a.measuredAt) - Date.parse(b.measuredAt));
}

export function latestSnapshot(data: MissionData): Snapshot | undefined {
  return orderedSnapshots(data).at(-1);
}

export function orderedNotes(data: MissionData) {
  return [...data.notes].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
