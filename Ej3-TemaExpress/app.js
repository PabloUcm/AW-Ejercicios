const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const url = require("url");
const DAOTasks = require("../../AW-P3/DAOTasks");

const app = express();

let nombre = "usuario";
let password = "1234";
let usuario_identificado = false;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

const identificacionRequerida = (request, response, next) => {
  let pathname = url.parse(request.url, true).pathname;

  if (usuario_identificado) next();
  else if (pathname === "/login" || pathname === "/") {
    next();
  } else {
    response.status(401);
    response.end();
  }
};

app.use(identificacionRequerida);

app.get("/", function (request, response) {
  response.redirect("login");
});

app.get("/login", function (request, response) {
  response.render("login.ejs");
});

app.get("/inicio", function (request, response) {
  response.render("inicio.ejs");
});

app.get("/secreto", function (request, response) {
  response.render("secreto.ejs");
});

app.get("/otro_secreto", function (request, response) {
  response.render("otro_secreto.ejs");
});

app.get("/publico", function (request, response) {
  response.render("publico.ejs");
});

app.post("/login", function (request, response) {
  if (request.body.nombre === nombre && request.body.password === password) {
    usuario_identificado = true;
    response.redirect("inicio");
  } else {
    usuario_identificado = false;
    response.redirect("login");
  }
});

app.listen(3000, function (err) {
  if (err) {
    console.log("No se pudo inicializar el servidor: " + err.message);
  } else {
    console.log("Servidor arrancado en el puerto 3000");
  }
});
