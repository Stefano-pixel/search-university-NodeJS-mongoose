const request = require("supertest");
const initApplication = require("../src/app");
const tap = require("tap");
const getCreatedUniversityModel = require("../src/mongoose/University");
const getMongooseConnection = require("../src/mongoose/mongoose_connect.js");
const {
  userOne,
  userOneId,
  universityOne,
  universityTwo,
  setupDatabase,
} = require("./fixtures/db");

function setupServer() {
  let app = initApplication(null);
  let server = app.listen();
  return [app, server];
}

tap.test("Get all universities", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  t.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });
  let userId = userOne._id.toString();
  const response = await request(app)
    .get("/universities")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .query({ user: userId })
    .expect(200);

  //check universities
  const listUniversities = response.body;
  t.has(listUniversities[0], {
    name: universityOne.name,
    country: universityOne.country,
  });

  t.has(listUniversities[1], {
    name: universityTwo.name,
    country: universityTwo.country,
  });

  t.end();
});

tap.test("Save universities", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  t.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });
  let userId = userOne._id.toString();
  await request(app)
    .post("/university")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send([
      {
        name: "Bocconi",
        country: "Italy",
        user: userId,
      },
    ])
    .expect(200);

  //check if the university was saved
  const University = await getCreatedUniversityModel();
  const uniFromDb = await University.find({ name: "Bocconi" });
  let isObject = false;
  if (uniFromDb) isObject = true;
  t.equal(isObject, true);

  t.end();
});

tap.test("Patch university", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  t.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });

  await request(app)
    .patch("/university")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send([
      [
        universityOne,
        {
          name: universityOne.name + "mod",
          country: universityOne.country + "mod",
          user: userOneId,
        },
      ],
      [
        universityTwo,
        {
          name: universityTwo.name + "mod",
          country: universityTwo.country + "mod",
          user: userOneId,
        },
      ],
    ])
    .expect(200);

  //checks if the universities were update
  let University = getCreatedUniversityModel();
  let listUniversities = await University.find({});

  t.has(listUniversities[0], {
    name: universityOne.name + "mod",
    country: universityOne.country + "mod",
    user: userOneId,
  });

  t.has(listUniversities[1], {
    name: universityTwo.name + "mod",
    country: universityTwo.country + "mod",
    user: userOneId,
  });

  t.end();
});

tap.test("Delete university", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  t.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });

  await request(app)
    .delete("/university")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send([universityTwo])
    .expect(200);

  const University = getCreatedUniversityModel();
  const listUniFound = await University.find(universityTwo);
  t.equal(listUniFound.length, 0);
});
