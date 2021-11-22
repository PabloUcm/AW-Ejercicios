"use strict";

const http = require("http");
const url = require("url");
const fs = require("fs").promises; // Si no usamos promesas, entonces, meter funcion callback (Código menos legible)

const DAO = require("./dao");
const dao = new DAO("localhost", "root", "", "mensajeria", 3307);

const servidor = http.createServer(function (request, response) {
  let method = request.method;
  let requestUrl = request.url;
  let pathname = url.parse(requestUrl, true).pathname;
  let query = url.parse(requestUrl, true).query;

  if (method === "GET" && pathname === "/index.html") {
    printIndex(response);
  } else if (method === "GET" && pathname === "/nuevo_usuario") {
    dao.insertarUsuario(query, cb_insertarUsuario);
    response.end();
  } else {
    response.statusCode = 404;
    response.end();
  }
});

servidor.listen(3000, function (err) {
  if (err) console.error(`Error al abrir el puerto 3000: ${err}`);
  else console.log("Servidor escuchando en el puerto 3000");
});

//Para el siguiente tema -> Usar Express.js
const printIndex = (response) => {
  fs.readFile(__dirname + "/index.html")
    .then((contents) => {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(200);
      response.end(contents);
    })
    .catch((err) => {
      response.writeHead(500);
      response.end(err);
    });
};

//Callbacks
function cb_insertarUsuario(err) {
  if (err) {
    console.log("ERROR EN LA INSERCIÓN DE USUARIO");
  } else {
    console.log("USUARIO INSERTADO CORRECTAMENTE");
  }
}

