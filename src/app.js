const express = require("express");
const univeristyRouter = require("./routers/university.js");
const userRouter = require("./routers/user.js");
const app = express();
const getMongooseConnection = require("./mongoose/mongoose_connect.js");
app.use(express.json());
app.use(univeristyRouter);
app.use(userRouter);

const appListenFunction = (app, port) => {
  if (
    app !== null &&
    app !== undefined &&
    port !== null &&
    port !== undefined
  ) {
    app.listen(port, () => {
      console.log("Server is up on port " + port);
    });
  }
  return app;
};

function initApplication(port) {
  try {
    const res = getMongooseConnection();
    var application = app;
    if (port) {
      application = appListenFunction(app, port);
    }
    return application;
  } catch (error) {
    console.log(error);
  }
}

module.exports = initApplication;
