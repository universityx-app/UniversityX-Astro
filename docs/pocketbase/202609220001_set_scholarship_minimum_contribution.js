// @ts-nocheck
migrate((app) => {
  const collection = app.findCollectionByNameOrId(
    "UniversityX_Access_Scholarships",
  );
  const amountField = collection.fields.getByName(
    "Amount_Able_To_Contribute",
  );

  amountField.required = true;
  amountField.min = 10000;
  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId(
    "UniversityX_Access_Scholarships",
  );
  const amountField = collection.fields.getByName(
    "Amount_Able_To_Contribute",
  );

  amountField.required = true;
  amountField.min = 0;
  app.save(collection);
});
