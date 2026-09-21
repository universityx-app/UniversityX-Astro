const baseUrl = process.env.POCKETBASE_URL?.replace(/\/$/, '');
const superuserToken = process.env.POCKETBASE_SUPERUSER_TOKEN;
const acknowledged = process.env.COHORT_ACCESS_TEST_ACK === '1';

if (!baseUrl || !superuserToken || !acknowledged) {
  console.error(
    'Refusing to run. Set POCKETBASE_URL, POCKETBASE_SUPERUSER_TOKEN, and COHORT_ACCESS_TEST_ACK=1 for a non-production test deployment.',
  );
  process.exit(1);
}

const collection = 'Cohort_Payment_Registrations';
const endpoint = `${baseUrl}/api/collections/${collection}/records`;
const testSuffix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
const validPayload = {
  cohort_slug: 'build-and-ship-ai-applications-with-python',
  full_name: `Access test ${testSuffix}`,
  email: `cohort-access-${testSuffix}@example.com`,
  whatsapp_number: '+2348000000000',
  payment_option: 'full',
  current_role: 'Automated access-rule test',
  python_experience: 'Beginner',
  learning_goal: 'Verify collection access controls',
};

let createdId;

async function request(url, options = {}, authenticated = false) {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  if (authenticated) headers.set('Authorization', superuserToken);
  return fetch(url, { ...options, headers });
}

async function expectAllowed(label, response) {
  if (!response.ok) {
    throw new Error(`${label} unexpectedly failed (${response.status}): ${await response.text()}`);
  }
  console.log(`PASS ${label}`);
  return response.json();
}

async function expectDenied(label, response) {
  if (response.ok) {
    throw new Error(`${label} unexpectedly succeeded (${response.status}).`);
  }
  console.log(`PASS ${label} denied (${response.status})`);
}

try {
  await expectDenied(
    'anonymous invalid create',
    await request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, email: 'not-an-email' }),
    }),
  );

  await expectDenied(
    'anonymous status injection',
    await request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, payment_verification_status: 'verified' }),
    }),
  );

  const created = await expectAllowed(
    'anonymous valid create',
    await request(endpoint, { method: 'POST', body: JSON.stringify(validPayload) }),
  );
  createdId = created.id;

  if (created.payment_verification_status !== 'unverified') {
    throw new Error('Server did not initialize payment_verification_status to unverified.');
  }
  console.log('PASS server default is unverified');

  await expectDenied('anonymous list', await request(endpoint));
  await expectDenied('anonymous view', await request(`${endpoint}/${createdId}`));
  await expectDenied(
    'anonymous update',
    await request(`${endpoint}/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({ full_name: 'Unauthorized update' }),
    }),
  );
  await expectDenied(
    'anonymous status change',
    await request(`${endpoint}/${createdId}`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_verification_status: 'verified' }),
    }),
  );
  await expectDenied(
    'anonymous delete',
    await request(`${endpoint}/${createdId}`, { method: 'DELETE' }),
  );

  const updated = await expectAllowed(
    'trusted administration status update',
    await request(
      `${endpoint}/${createdId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ payment_verification_status: 'verified' }),
      },
      true,
    ),
  );
  if (updated.payment_verification_status !== 'verified') {
    throw new Error('Trusted status update did not persist.');
  }
  console.log('PASS trusted status is verified');
  console.log('\nAll cohort registration access checks passed.');
} finally {
  if (createdId) {
    const cleanup = await request(`${endpoint}/${createdId}`, { method: 'DELETE' }, true);
    if (!cleanup.ok) {
      console.error(`WARNING test record cleanup failed (${cleanup.status}).`);
    }
  }
}
