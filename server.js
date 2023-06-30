const express = require("express");
//const mongoose = require("mongoose");
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");
const userRouter = require("./routes/user");

// const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

//Connections

connectMongoDb("mongodb://127.0.0.1:27017/youtubeapp").then(() =>
  console.log("MongoDB connected")
);

app.use(express.urlencoded({ extended: false }));

app.use(logReqRes("log.txt"));

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
