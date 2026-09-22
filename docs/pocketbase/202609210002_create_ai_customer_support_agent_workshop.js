// @ts-nocheck
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "AI_Customer_Support_Agent_Workshop",
    listRule: null,
    viewRule: null,
    createRule: "",
    updateRule: null,
    deleteRule: null,
    fields: [
      {
        name: "first_name",
        type: "text",
        required: true,
        presentable: true,
        min: 1,
        max: 80,
      },
      {
        name: "last_name",
        type: "text",
        required: true,
        min: 1,
        max: 80,
      },
      {
        name: "email",
        type: "email",
        required: true,
        presentable: true,
      },
      {
        name: "whatsapp_number",
        type: "text",
        required: false,
        min: 7,
        max: 40,
      },
      {
        name: "python_experience",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["Beginner", "Intermediate", "Advanced"],
      },
      {
        name: "cohort_interest",
        type: "select",
        required: true,
        maxSelect: 1,
        values: ["Yes", "Maybe", "No"],
      },
      {
        name: "referral_code",
        type: "text",
        required: false,
        max: 120,
      },
    ],
  });

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId(
    "AI_Customer_Support_Agent_Workshop",
  );
  app.delete(collection);
});
