class DAOTasks {
  constructor(pool) {
    this.pool = pool;
  }

  getAllTasks(email, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error("Error de conexión a la base de datos"));
      else {
        connection.query(
          "SELECT T.id, T.text, T.done, TA.tag " +
            "FROM Task AS T " +
            "LEFT JOIN TaskTag AS TG ON T.id = TG.taskId " +
            "LEFT JOIN Tag AS TA ON TG.tagid = TA.id " +
            "WHERE T.user = ?",
          [email],
          function (err, rows) {
            connection.release();
            if (err) callback(new Error("Error de acceso a la base de datos"));
            else {
              const tasks = [];

              let actTask = null;
              rows.forEach((row) => {
                if (actTask != row.id) {
                  actTask = row.id;
                  tasks.push({
                    id: row.id,
                    text: row.text,
                    done: row.done,
                    tags: [],
                  });

                  if (row.tag) tasks[tasks.length - 1].tags.push(row.tag);
                } else {
                  tasks.find((el) => el.id == actTask).tags.push(row.tag);
                }
              });

              callback(null, tasks);
            }
          }
        );
      }
    });
  }

  insertTask(email, task, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error("Error de conexión a la base de datos"));
      else {
        connection.query(
          "INSERT INTO Task(user,text,done) VALUES(?,?,?)",
          [email, task.text, task.done],
          function (err, rows1) {
            if (err) {
              connection.release();
              callback(new Error("Error de acceso a la base de datos"));
            } else {
              const numTags = task.tags.length;
              if (numTags == 0) {
                connection.release();
                callback();
              } else {
                let query = "SELECT * FROM Tag WHERE UPPER(tag) = UPPER(?)";
                for (let i = 1; i < numTags; i++)
                  query += " OR UPPER(tag) = UPPER(?)";

                connection.query(query, task.tags, function (err, rows2) {
                  if (err) {
                    connection.release();
                    callback(new Error("Error de acceso a la base de datos"));
                  } else {
                    const tags_id = [];
                    rows2.forEach((row) => {
                      task.tags = task.tags.filter(
                        (tag) => tag.toUpperCase() != row.tag.toUpperCase()
                      );
                      tags_id.push(rows1.insertId, row.id);
                    });
                    const numNewTags = task.tags.length;

                    if (numNewTags > 0) {
                      query = "INSERT INTO Tag(tag) VALUES(?)";
                      for (let i = 1; i < numNewTags; i++) query += ",(?)";

                      connection.query(query, task.tags, function (err, rows3) {
                        if (err) {
                          connection.release();
                          callback(
                            new Error("Error de acceso a la base de datos")
                          );
                        } else {
                          query =
                            "INSERT INTO TaskTag(taskId,tagId) VALUES(?,?)";
                          for (let i = 1; i < numTags; i++) query += ",(?,?)";

                          for (let i = 0; i < numNewTags; i++) {
                            tags_id.push(rows1.insertId, rows3.insertId + i);
                          }

                          connection.query(query, tags_id, function (err) {
                            connection.release();
                            if (err)
                              callback(
                                new Error("Error de acceso a la base de datos")
                              );
                            else {
                              callback();
                            }
                          });
                        }
                      });
                    } else {
                      query = "INSERT INTO TaskTag(taskId,tagId) VALUES(?,?)";
                      for (let i = 1; i < tags_id.length / 2; i++)
                        query += ",(?,?)";

                      connection.query(query, tags_id, function (err) {
                        connection.release();
                        if (err)
                          callback(
                            new Error("Error de acceso a la base de datos")
                          );
                        else {
                          callback();
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        );
      }
    });
  }

  markTaskDone(idTask, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error("Error de conexión a la base de datos"));
      else {
        connection.query(
          "UPDATE Task SET done=true WHERE id=?",
          [idTask],
          function (err) {
            connection.release();
            if (err) callback(new Error("Error de acceso a la base de datos"));
            else callback();
          }
        );
      }
    });
  }

  deleteCompleted(email, callback) {
    this.pool.getConnection(function (err, connection) {
      if (err) callback(new Error("Error de conexión a la base de datos"));
      else {
        connection.query(
          "UPDATE Task " +
            "SET active = false " +
            "WHERE user = ? " +
            "AND done = true",
          [email],
          function (err) {
            connection.release();
            if (err) callback(new Error("Error de acceso a la base de datos"));
            else callback(null, "Se han borrado las tareas con éxito");
          }
        );
      }
    });
  }
}

module.exports = DAOTasks;
