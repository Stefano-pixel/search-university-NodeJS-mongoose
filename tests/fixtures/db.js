const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const getCreatedUserModel = require("../../src/mongoose/User");
const getCreatedUniversityModel = require("../../src/mongoose/University");
const jwtSecret = process.env.JWT_SECRET;

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  user: "Stefano81",
  email: "Setefano81@gmail.com",
  password: "code_12_2_1",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, jwtSecret),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  user: "Antonio90",
  email: "Antonio898@gmail.com",
  password: "codice123rr",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, "secretcode"),
    },
  ],
};

const universityOneId = new mongoose.Types.ObjectId();
const universityOne = {
  _id: universityOneId,
  name: "Sapienza",
  country: "Italy",
  user: userOneId,
};

const universityTwoId = new mongoose.Types.ObjectId();
const universityTwo = {
  _id: universityTwoId,
  name: "Harvard",
  country: "US",
  user: userOneId,
};

const setupDatabase = async () => {
  const user = getCreatedUserModel();
  const university = getCreatedUniversityModel();

  await user.deleteMany();
  await university.deleteMany();
  await new user(userOne).save();
  await new user(userTwo).save();
  await new university(universityOne).save();
  await new university(universityTwo).save();
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  universityOne,
  universityOneId,
  universityTwo,
  universityTwoId,
  setupDatabase,
};
