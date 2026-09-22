// @ts-nocheck
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "Cohort_Payment_Registrations",
    listRule: null,
    viewRule: null,
    createRule: "@request.body.payment_verification_status:isset = false",
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "cohort_slug", type: "text", required: true, min: 1, max: 180 },
      { name: "full_name", type: "text", required: true, presentable: true, min: 2, max: 120 },
      { name: "email", type: "email", required: true, presentable: true },
      { name: "whatsapp_number", type: "text", required: true, min: 7, max: 40 },
      { name: "payment_option", type: "select", required: true, maxSelect: 1, values: ["full", "installment"] },
      { name: "current_role", type: "text", max: 160 },
      { name: "python_experience", type: "text", max: 160 },
      { name: "learning_goal", type: "text", max: 600 },
      {
        name: "payment_verification_status",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["unverified", "verified", "mismatch"],
      },
    ],
  });

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("Cohort_Payment_Registrations");
  app.delete(collection);
});
