const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();

const PORT = 8000;

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
app.get("/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});

//REST API
app.get("/api/users", (req, res) => {
  //  console.log("I am in get route", req.myUsername);
  return res.json(users);
});
//Dynamic Path Parametres
// app.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const user = users.find((user) => user.id === id);
//   return res.json(user);
// });

app.post("/api/users", (req, res) => {
  //TODO Create new User
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length });
  });
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
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    //Edit user with id
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    //delete user with id
    return res.json({ status: "pending" });
  });

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
