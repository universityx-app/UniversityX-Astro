// Deploy this trusted PocketBase hook with the collection schema.
// The public client intentionally omits payment_verification_status.
onRecordCreateRequest((event) => {
  event.record.set("payment_verification_status", "unverified");
  return event.next();
}, "Cohort_Payment_Registrations");
