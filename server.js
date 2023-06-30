const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
// const users = require("./MOCK_DATA.json");

const app = express();

const PORT = 8000;

//Connection with Mongo

mongoose
  .connect("mongodb://127.0.0.1:27017/youtubeapp")
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.log("Mongo error", err));

//Creating schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

//Creating model
const User = mongoose.model("user", userSchema);

//middleware- plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`,
    (err, data) => {
      next();
    }
  );
  //next();
});

// //middleware 1
// app.use((req, res, next) => {
//   console.log("Hello from middleware 1");
//   req.myUsername = "piyushgarg.dev";
//   next();
//   // return res.json({ msg: "Hello from middware 1" });
// });
// //middleware 2
// app.use((req, res, next) => {
//   console.log("Hello from middleware 2", req.myUsername);
//   req.CreditCardnumber = "123";
//   next();
//   // return res.end("Hey");
// });

//routes
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
  <ul>
  ${allDbUsers
    .map((user) => `<li>${user.firstName}-${user.email}</li>`)
    .join("")}
  </ul>
  `;
  res.send(html);
});

//REST API
app.get("/api/users", async (req, res) => {
  //res.setHeader("X-MyName","Piyush-Garg"); //Custom Header
  //  console.log("I am in get route", req.myUsername);
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
});
//Dynamic Path Parametres
// app.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
//   return res.json(user);
// });

app.post("/api/users", async (req, res) => {
  //TODO Create new User
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all fields are required" });
  }

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  // console.log("result", result);
  return res.status(201).json({ msg: "success" });
  //Comment below code for MONGODB
  /*
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length });
  });
  */
  // console.log("Body", body);
  // return res.json({ status: "pending" });
});

// app.patch("api/users/:id", (req, res) => {
//   //TOOD: Edit the user with id
//   return res.json({ status: "pending" });
// });

// app.delete("api/users/:id", (req, res) => {
//   //TODO Create new User
//   return res.json({ status: "pending" });
// });

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    // const id = Number(req.params.id);
    // const user = users.find((user) => user.id === id);
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    //Edit user with id
    await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" });
    return res.json({ status: "Success" });
  })
  .delete(async (req, res) => {
    //delete user with id
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success" });
  });

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
