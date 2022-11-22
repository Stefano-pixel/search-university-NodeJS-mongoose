const express = require("express");
const getCreatedUserModel = require("../mongoose/User.js");
const auth = require("../middleware/auth.js");

const router = new express.Router();

//This service get the user for a given user code passed from the URL
router.get("/user", auth, async (req, res) => {
  try {
    let User = getCreatedUserModel();
    const users = await User.find({ _id: req.query.user });
    res.status(200).send(users.length > 0);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//Creates a new user and saves it on db
router.post("/user/register", async (req, res, next) => {
  try {
    let User = getCreatedUserModel();
    const user = new User({
      user: req.body.user,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//This service does the login, so generetes a new web token, and retunrs
//the id of the user that has done login, and the jwt generated for that user
router.post("/user/login", async (req, res) => {
  try {
    let User = getCreatedUserModel();
    const userFound = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const id = userFound._id;
    const token = await userFound.generateAuthToken();
    res.send({ id, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//This service does the logout, so it deletes the token, passed in the header,
// from the array of tokens of the user
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ logout: true });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//Deletes the user with associated universities
router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

//It's possible to modify user email or password of the user
router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["user", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
