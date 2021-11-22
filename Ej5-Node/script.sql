DROP DATABASE mensajeria;
CREATE DATABASE mensajeria;

SET GLOBAL time_zone = '-3:00';

create table Usuarios(
id int not null auto_increment,
nombre VARCHAR(100) not null,
correo VARCHAR(100) not null,
telefono VARCHAR(50),
activo boolean default(true),
primary key(id)
);

create table Mensajes(
id int not null auto_increment,
idOrigen int not null,
idDestino int not null,
mensaje text not null,
hora timestamp not null default(CURRENT_TIMESTAMP),
leido boolean default(false),
activo boolean default(true),
primary key(id),
foreign key (idOrigen) references usuarios(id) ON UPDATE CASCADE,
foreign key (idDestino) references usuarios(id) ON UPDATE CASCADE
);

INSERT INTO Usuarios (nombre,correo,telefono) values ("pablo","pablo@gmail.com", "123");
INSERT INTO Usuarios(nombre,correo,telefono) values ("dani","dani@gmail.com", "321");

INSERT INTO Mensajes (idOrigen,idDestino,mensaje) values (1,2,"mensaje");

SELECT * FROM Usuarios;
SELECT * from Mensajes;

SELECT * FROM Usuarios WHERE nombre LIKE "%da%";

SELECT U.nombre, M.mensaje, M.hora
FROM Mensajes AS M 
JOIN Usuarios AS U
ON M.idOrigen = U.id
WHERE idDestino = 1
AND leido = false; 