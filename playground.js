const mongoose = require("mongoose");
// const {
//   userOneId,
//   userOne,
//   userTwo,
//   userTwoId,
//   setupDatabase,
// } = require("./fixtures/db");
const getMongooseConnection = require("./src/mongoose/mongoose_connect.js");
const getCreatedUserModel = require("./src/mongoose/User");
const mongoDbUrlTest = "mongodb://127.0.0.1:27017/university-database-test";
const mongoDbUrlDev = "mongodb://127.0.0.1:27017/university-database-dev";

async function fun() {
  // const user = getCreatedUserModel();
  // console.log("1-----------------");
  // const usersFromDb = await user.find({ user: "stefanomod" }).exec();
  // console.log("2-------------------");
  // console.log(usersFromDb);
  // console.log("3--------------------");
  // console.log(mongoose.connection.base.connections.length);
  // console.log("4--------------------");
  // getMongooseConnection().close();
  // console.log(mongoose.connection.base.connections.length);
  // console.log("5--------------------");
  const conn = mongoose.createConnection(
    mongoDbUrlTest,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) console.log(error);
    }
  );
  conn.close();
  const conn2 = mongoose.createConnection(
    mongoDbUrlDev,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) console.log(error);
    }
  );
  conn2.close();
  //mongoose.connection.base.connections.shift();
  mongoose.connection.base.connections.splice(1, 1);
  console.log(mongoose.connection.base.connections);
}

fun();
