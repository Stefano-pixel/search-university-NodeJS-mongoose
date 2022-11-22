const mongoose = require("mongoose");
const getMongooseConnection = require("./mongoose_connect");
const { Schema } = mongoose;

const universitySchema = new Schema({
  name: String,
  country: String,
  user: mongoose.ObjectId,
});

function getCreatedUniversityModel() {
  const connection = getMongooseConnection();
  const University = connection.model("University", universitySchema);
  return University;
}

module.exports = getCreatedUniversityModel;
