const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth.js");
const getCreatedUniversityModel = require("../mongoose/University");
const router = new express.Router();

//This get service returns all the universities stored in the db
router.get("/universities", auth, async (req, res) => {
  try {
    //Fills the list: listUniversity, with all the objects
    //stored in the db
    let University = getCreatedUniversityModel();
    const listUniversity = await University.find({ user: req.query.user });
    res.status(200).send(listUniversity);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//This post service stores all the new universities inserted
//from the user
router.post("/university", auth, async (req, res, next) => {
  try {
    const listUniversity = req.body;
    let University = getCreatedUniversityModel();
    await listUniversity.forEach((uniParam) => {
      var uniToSave = new University({
        name: uniParam.name,
        country: uniParam.country,
        user: new mongoose.Types.ObjectId(uniParam.user),
      });
      uniToSave.save();
    });
    res.status(200).json({ created: true });
  } catch (e) {
    console.log("post university-------------------------");
    console.log(e);
    res.status(400).send(e);
  }
});

//This patch service changes update the objects stored
// in the db
router.patch("/university", auth, async (req, res, next) => {
  try {
    //The list: listUniversity, contains lists with length = 2
    //the first element of every list is the old value the second
    //element of every list is the new value
    const listUniversity = req.body;
    const listUpdateProblems = [];

    let University = getCreatedUniversityModel();
    for (const uni of listUniversity) {
      const data = await University.updateOne(
        { name: uni[0].name },
        uni[1]
      ).exec();

      //Checks if the document was found but nothing was modified then push in the
      //list the id and the proper state
      if (data.matchedCount > 0 && data.modifiedCount == 0) {
        listUpdateProblems.push(
          "id: " + uni[0].id + " - " + "FOUND_NOT_UPDATED"
        );
        continue;
      }

      //If nothing was found then push in the list the id of the document and the proper state
      if (data.matchedCount == 0) {
        listUpdateProblems.push("id: " + uni[0].id + " - " + "NOT_FOUND");
      }
    }
    res.status(200).json({ update: true });
  } catch (e) {
    console.log("patch university----------------------");
    console.log(e);
    res.status(400).send(e);
  }
});

//This delete service deletes all the universities passed
router.delete("/university", auth, async (req, res, next) => {
  try {
    const listUniversity = req.body;
    const listDeleteProblems = [];

    let University = getCreatedUniversityModel();
    for (const uni of listUniversity) {
      const data = await University.deleteOne({ _id: uni._id }).exec();

      //If the university wasn't deleted then insert in the list in order to take track of
      //the universities not deleted
      if (data.deletedCount == 0)
        listDeleteProblems.push("id: " + uni.id + " - NOT DELETED");
    }
    if (listDeleteProblems.length > 0) {
      res.status(400).send({ delete: false });
    } else {
      res.status(200).send({ delete: true });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
