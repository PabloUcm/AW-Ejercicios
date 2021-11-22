const mysql = require("mysql");

class DAO{

    constructor(host, user, password, database) {
        this.pool = mysql.createPool({
            host,
            user,
            password,
            database
          });
     }

    insertarUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error());
            else {
              connection.query("INSERT INTO Usuario(nombre,correo,telefono) VALUES(?,?,?)",
              [usuario.nombre,usuario.correo,usuario.telefono],
              function(err, rows){
                connection.release();
                if(err) callback(new Error()); 
                else{
                    usuario.id = rows.insertId;
                    callback()
                }
              });
            }
        }
        );
    }

   enviarMensaje(usuarioOrigen, usuarioDestino, mensaje, callback){ 
        this.pool.getConnection(function (err, connection) {
            if (err) callback(new Error());
            else {
            const date = new Date();
            const fecha = `${date.getDate()+1}-${date.getMonth()}-${date.getDay} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds}`; 
            connection.query("INSERT INTO Mensajes(idOrigen,idDestino,mensaje,hora,leido) VALUES(?,?,?,?,?)",
            [usuarioOrigen.id,usuarioDestino.id,mensaje,fecha,false],
            function(err, rows){
                connection.release();
                if(err) callback(new Error()); 
                else callback()
            });
        }
    }
    ); }
    bandejaEntrada(usuario, callback) { this.pool.getConnection(function (err, connection) {
        if (err) callback(new Error());
        else {
        connection.query("SELECT idOrigen, mensaje, hora FROM Mensajes WHERE idDestino = ? AND leido = false",
        [usuario.id],
        function(err, rows1){
            if(err) {
                connection.release();
                callback(new Error()); 
            }    
            else {
                rows1.forEach(row => {
                    connection.query("SELECT nombre FROM Usuario WHERE id = ?",
                    [row.idOrigen],
                    function(err, rows2){
                        if(err) {
                            connection.release();
                            callback(new Error()); 
                        }    
                        else {
                            const messages = [];
                            rows2.forEach(row => {
                                messages.push({
                                    nombre: row.nombre,
                                    mensaje: 
                                })
                            })
                        }
                    });
                })
            }
        });
    } 
}
    buscarUsuario(str, callback){ … }
    terminarConexion(callback) { … }
}

module.exports = DAO;
