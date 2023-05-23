const mongoose = require("mongoose");
const mongoDbUrl = process.env.MONGODB_URL;

function getMongooseConnection() {
  let mongooseConnection = getMongooseConnection.mongooseConnection;
  if (
    mongooseConnection &&
    (mongooseConnection.readyState == 1 || mongooseConnection.readyState == 2)
  ) {
    return mongooseConnection;
  } else {
    getMongooseConnection.mongooseConnection = mongoose.createConnection(
      mongoDbUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (error) => {
        if (error) console.error(error);
      }
    );
    // if (mongooseConnection) {
    //   mongoose.connection.base.connections.splice(1, 1);
    // }
    return getMongooseConnection.mongooseConnection;
  }
}

module.exports = getMongooseConnection;
