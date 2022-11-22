const tap = require("tap");
const bcrypt = require("bcryptjs");
const request = require("supertest");
const initApplication = require("../src/app");
const getCreatedUserModel = require("../src/mongoose/User");
const getMongooseConnection = require("../src/mongoose/mongoose_connect.js");
const { userOne, setupDatabase } = require("./fixtures/db");
const getCreatedUniversityModel = require("../src/mongoose/University");

function setupServer() {
  let app = initApplication(null);
  let server = app.listen();
  return [app, server];
}

tap.test("Get user by userId", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();
  t.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });
  let userId = userOne._id.toString();
  const response = await request(app)
    .get("/user")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .query({ user: userId })
    .expect(200);

  t.equal(response.body, true);
  t.end();
});

tap.test("Register new user", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  t.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });
  await request(app)
    .post("/user/register")
    .send({
      user: "mario88",
      email: "mario88@gmail.com",
      password: "code_122W_2",
    })
    .expect(201);

  //check user saved
  const User = getCreatedUserModel();
  const userFromDb = await User.find({ user: "mario88" });
  t.has(userFromDb[0], {
    user: "mario88",
    email: "mario88@gmail.com",
  });
  t.end();
});

tap.test("Login", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  t.teardown(async () => {
    await server.close();
    await getMongooseConnection().close();
  });

  const response = await request(app)
    .post("/user/login")
    .send({
      user: userOne.user,
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  //check user saved
  const User = getCreatedUserModel();
  const userFromDb = await User.find({ user: userOne.user });
  //check the new token generated
  t.equal(userFromDb[0].tokens[1].token, response.body.token);
  t.end();
});

tap.test("Logout", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  tap.teardown(() => {
    server.close();
    getMongooseConnection().close();
  });
  await request(app)
    .post("/user/logout")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      user: userOne.user,
      email: userOne.email,
      password: userOne.password,
    })
    .expect({
      logout: true,
    });

  //Check if the tokens list for the user is empty
  let user = getCreatedUserModel();
  const userFromDb = await user.findById(userOne._id);
  t.equal(userFromDb.tokens.length, 0);
});

tap.test("Delete user with associated universities", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  tap.teardown(async () => {
    await server.close();
    await getMongooseConnection().close();
  });

  const response = await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  //check if there isn't the user deleted
  let User = getCreatedUserModel();
  const user = await User.findById(userOne._id);
  t.equal(user, null);

  //check if the universities linked to the user were deleted
  let University = getCreatedUniversityModel();
  const listUniversity = await University.find({ user: userOne._id });
  t.equal(listUniversity.length, 0);

  t.end();
});

tap.test("Patch user with associated universities", async (t) => {
  const [app, server] = setupServer();
  await setupDatabase();

  tap.teardown(async () => {
    await server.close();
    await getMongooseConnection().close();
  });

  const userToSend = {
    user: "stefanomod",
    email: "stefanomod88@gmail.com",
    password: "ciao1234_as",
  };
  const response = await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(userToSend)
    .expect(200);

  //check the user
  let User = getCreatedUserModel();
  const user = await User.findById(userOne._id);
  t.has(user, {
    user: "stefanomod",
    email: "stefanomod88@gmail.com",
  });

  //check if the user's password is changed
  let isPassEqual = await bcrypt.compare("ciao1234_as", user.password);
  t.equal(isPassEqual, true);
});
