const mysql = require("mysql");

class DAO {
  constructor(host, user, password, database,port) {
    this.pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port
    });
    console.log(this.pool);
  }

  async insertarUsuario(usuario, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error());
      else {
        connection.query(
          "INSERT INTO Usuarios(nombre,correo,telefono) VALUES(?,?,?)",
          [usuario.nombre, usuario.correo, usuario.telefono],
          function (err, rows) {
            connection.release();
            if (err) callback(new Error());
            else {
              usuario.id = rows.insertId;
              callback();
            }
          }
        );
      }
    });
  }

  async enviarMensaje(usuarioOrigen, usuarioDestino, mensaje, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error());
      else {
        connection.query(
          "INSERT INTO Mensajes(idOrigen,idDestino,mensaje) VALUES(?,?,?)",
          [usuarioOrigen.id, usuarioDestino.id, mensaje],
          function (err, rows) {
            connection.release();
            if (err) callback(new Error());
            else callback();
          }
        );
      }
    });
  }

  async bandejaEntrada(usuario, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error(""));
      else {
        connection.query(
          "SELECT U.nombre, M.mensaje, M.hora " +
            "FROM Mensajes as M " +
            "JOIN Usuarios as U " +
            "ON M.idOrigen = U.id " +
            "WHERE idDestino = ? " +
            "AND leido = false",
          [usuario.id],
          function (err, rows) {
            connection.release();
            if (err) callback(new Error());
            else {
              const mensajes = [];
              rows.forEach((row) => {
                mensajes.push({
                  nombre: row.nombre,
                  mensaje: row.mensaje,
                  hora: row.hora,
                });
              });
              callback(null, mensajes);
            }
          }
        );
      }
    });
  }

  async buscarUsuario(str, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error());
      else {
        connection.query(
          'SELECT * FROM Usuarios WHERE upper(nombre) LIKE "%"' + "?" + '"%"',
          [str],
          function (err, rows) {
            connection.release();
            if (err) callback(new Error());
            else {
              const usuarios = [];
              rows.forEach((row) => {
                usuarios.push({
                  id: row.id,
                  nombre: row.nombre,
                  correo: row.correo,
                  telefono: row.telefono,
                  activo: row.activo,
                });
              });
              console.log(usuarios);
              callback(null, usuarios);
            }
          }
        );
      }
    });
  }

  async terminarConexion(callback) {
    this.pool.end(function (err) {
      if (err) callback(new Error());
      else callback();
    });
  }
}

module.exports = DAO;
