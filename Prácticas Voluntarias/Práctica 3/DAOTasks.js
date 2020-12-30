"use strict";

class DAOTasks {

    constructor(pool){
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT id, text, done, tag FROM task LEFT JOIN tag ON id = taskId WHERE user = ?",
                [email],
                function(err, rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(rows.length === 0){
                            callback(null, false);
                        }
                        else{
                            let i = 0;
                            let task = [];
                            let aux;

                            while(i < rows.length){
                                aux = [];
                                while(i + 1 < rows.length && rows[i].id === rows[i + 1].id){
                                    aux.push(rows[i].tag);
                                    i++;
                                }
                                aux.push(rows[i].tag);
                                if(rows[i].tag === null){
                                    task.push([rows[i].id, rows[i].text, rows[i].done]);
                                }
                                else{
                                    task.push([rows[i].id, rows[i].text, rows[i].done, aux]);
                                }
                                i++;
                            }
                            callback(null, task);
                        }
                    }
                });
            }
        })
    }

    insertTask(email, task, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("INSERT INTO task (user, text, done) VALUES (?, ?, ?)",
                [email, task.text, task.done],
                function(err, result){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        if(task.tags.length > 0){
                            for(let i = 0; i < task.tags.length; i++){
                                connection.query("INSERT INTO tag (taskId, tag) VALUES (?, ?)",
                                [result.insertId, task.tags[i]],
                                function(err){
                                    if(err){
                                        callback(new Error("Error de acceso a la base de datos"));
                                    }
                                    else{
                                        callback(null);
                                    }
                                });
                            }
                        }
                        else{
                            callback(null);
                        }
                    }
                });
            }
        });
    }

    markTaskDone(idTask, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("UPDATE task SET done = 1 WHERE id = ?",
                [idTask],
                function(err){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null);
                    }
                });
            }
        });
    }

    deleteCompleted(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("DELETE FROM task WHERE user = ? AND done = 1",
                [email],
                function(err){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null);
                    }
                });
            }
        });
    }

}

module.exports = DAOTasks;