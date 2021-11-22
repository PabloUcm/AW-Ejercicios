const path = require("path");
const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql");
const url = require("url");

const config = require(path.join(__dirname, "config.js"));
const app = express();

app.use(morgan("dev"));
app.use("/public/css", express.static(path.join(__dirname, "public", "css")));
app.use("/public/img", express.static(path.join(__dirname, "public", "img")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
});

const DAOTasks = require(path.join(__dirname, "DAOTasks"));
let daoTask = new DAOTasks(pool);

app.get("/tasks", function (request, response) {
  const tasks = daoTask.getAllTasks("pablo@gmail.com", (err, result) => {
    if (err) console.log(err.message);
    else if (result) {
      result.forEach((element) => {
        console.log(element);
      });

      response.render("tasks.ejs", { tasks: result });
    }

    response.end();
  });
});

app.post("/addTask", function (request, response) {
  response.end();
});

app.listen(config.port, function (err) {
  if (err) {
    console.log("No se pudo inicializar el servidor: " + err.message);
  } else {
    console.log(`Servidor arrancado en el puerto ${config.port}`);
  }
});

function cb_getAllTasks(err, result, response) {
  if (err) console.log(err.message);
  else if (result) {
    result.forEach((element) => {
      console.log(element);
    });
  }
}
