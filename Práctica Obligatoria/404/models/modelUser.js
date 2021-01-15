"use strict";

class modelUser {

    constructor(pool){
        this.pool = pool;
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT * FROM usuario WHERE correo = ? AND contraseña = ?",
                [email, password],
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
                            callback(null, true);
                        }
                    }
                });
            }
        });
    }

    userSignUp(email, password, username, profileImg, callback){
        this.pool.getConnection(function(err, connection){
            let profile;
            var random = (Math.floor(Math.random()*2)); //Elige un número aleatorio entre 0 y 2
            if(profileImg == ""){
                profile = ["defecto1.png", "defecto2.png", "defecto3.png"];
                profileImg = profile[random]; //Asigna al usuario la imagen en la posición del random anterior
            }
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                var f = new Date();
                var fecha = f.getDate()+"/"+(f.getMonth()+1)+"/"+f.getFullYear();
                connection.query("INSERT INTO usuario (nombre, correo, contraseña, foto_perfil, fecha_registro) VALUES (?, ?, ?, ?, ?)",
                [username, email, password, profileImg, fecha],
                function(err){
                    connection.release();
                    if(err){
                        callback(new Error("Ya existe un usuario registrado con ese correo electrónico"), false);
                    }
                    else{
                        callback(null, true);
                    }
                        
                });
            }
        });
    }

    getUserImageName(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT foto_perfil FROM usuario WHERE correo = ?",
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
                            callback(null, rows[0].foto_perfil);
                        }
                    }
                });
            }
        });
    }

    getUserName(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT nombre FROM usuario WHERE correo = ?",
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
                            callback(null, rows[0].nombre);
                        }
                    }
                });
            }
        });
    }

    getUserInfo(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT nombre, correo, reputacion, fecha_registro, COUNT(pregunta.id_pregunta) AS num_preguntas, SUM(votos_positivos) AS positivos_p, SUM(votos_negativos) AS negativos_p FROM usuario LEFT JOIN pregunta ON pregunta.id_correo = usuario.correo WHERE correo = ?",
                [email],
                function(err, user){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        connection.query("SELECT COUNT(respuesta.id_respuesta) AS num_respuestas, SUM(votos_positivos) AS positivos_r, SUM(votos_negativos) AS negativos_r FROM usuario LEFT JOIN respuesta ON respuesta.id_correo = usuario.correo WHERE correo = ?",
                        [email],
                        function(err, result){
                            if(err){
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else{
                                let info = [];
                                //Calculamos la reputación del usuario y la actualizamos en la base de datos
                                var rep = (user[0].positivos_p + result[0].positivos_r)*10 - (user[0].negativos_p + result[0].negativos_r)*2;
                                if(rep < 1){
                                    rep = 1;
                                }
                                connection.query("UPDATE usuario SET reputacion = ? WHERE correo = ?",
                                [rep, email],
                                function(err){
                                    if(err){
                                        callback(new Error("Error de actualización de la base de datos"));
                                    }
                                    else{
                                        info[0] = {nombre: user[0].nombre, correo: user[0].correo, reputacion: rep, fecha: user[0].fecha_registro, num_preguntas: user[0].num_preguntas, num_respuestas: result[0].num_respuestas}
                                        callback(null, info[0]);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    getAllUserInfo(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base datos"));
            }
            else{
                connection.query("SELECT num.nombre AS nombre, num.correo AS correo, num.reputacion AS reputacion, num.nombre_tema AS etiqueta, MAX(num) as numVecesEtiqueta FROM (SELECT usuario.correo, usuario.reputacion, nombre_tema,usuario.nombre , COUNT(nombre_tema) AS num FROM tema LEFT JOIN pregunta ON pregunta.id_pregunta = tema.id_pregunta   LEFT JOIN usuario ON pregunta.id_correo= usuario.correo GROUP BY usuario.nombre, nombre_tema ORDER BY num DESC) AS num GROUP BY num.nombre ORDER BY numVecesEtiqueta DESC",
                function(err, users){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null, users);
                    }
                });
            }
        });
    }

    filterByName(texto, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base datos"));
            }
            else{
                connection.query("SELECT num.nombre AS nombre, num.correo AS correo, num.reputacion AS reputacion, num.nombre_tema AS etiqueta, MAX(num) as numVecesEtiqueta FROM (SELECT usuario.correo, usuario.reputacion, nombre_tema,usuario.nombre , COUNT(nombre_tema) AS num FROM tema LEFT JOIN pregunta ON pregunta.id_pregunta = tema.id_pregunta   LEFT JOIN usuario ON pregunta.id_correo= usuario.correo GROUP BY usuario.nombre, nombre_tema ORDER BY num DESC) AS num WHERE num.nombre LIKE ? GROUP BY num.nombre",
                ["%"+texto+"%"],
                function(err, users){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null, users);
                    }
                });
            }
        });
    }

    medallasByUser(correo, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("SELECT visitas, SUM(pregunta.votos_positivos - pregunta.votos_negativos)AS votos_pregunta FROM pregunta WHERE id_correo = ? GROUP BY id_pregunta",
                [correo],
                function(err, medallas){
                    //medallas lleva las visitas y los votos de las preguntas
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        connection.query("SELECT SUM(respuesta.votos_positivos - respuesta.votos_negativos)AS votos_respuesta FROM respuesta WHERE id_correo = ? GROUP BY id_respuesta",
                        [correo],
                        function(err, votos_respuestas){
                            //Lo hacemos en dos queries porque puede haber un número distinto de respuestas que de preguntas o tener un indice diferente
                            connection.release();
                            if(err){
                                callback(new Error("Error de acceso a la base de datos"));
                            }
                            else{
                                let medallas_oro = [];
                                let medallas_plata = [];
                                let medallas_bronce = [];
                                //Visitas preguntas
                                medallas.forEach(function(v, i){
                                    if(v.visitas >= 6){
                                        medallas_oro.push("Pregunta famosa");
                                    }
                                    else if(v.visitas >= 4 && v.visitas < 6){
                                        medallas_plata.push("Pregunta destacada");
                                    }
                                    else if(v.visitas >= 2 && v.visitas < 4){
                                        medallas_bronce.push("Pregunta popular");
                                    }
                                });
                                //Votos preguntas
                                medallas.forEach(function(v, i){
                                    if(v.votos_pregunta >= 6){
                                        medallas_oro.push("Excelente pregunta");
                                    }
                                    else if(v.votos_pregunta >= 4 && v.votos_pregunta < 6){
                                        medallas_plata.push("Buena pregunta");
                                    }
                                    else if(v.votos_pregunta >= 2 && v.votos_pregunta < 4){
                                        medallas_bronce.push("Pregunta interesante");
                                    }
                                    else if(v.votos_pregunta == 1 && v.votos_pregunta < 2){
                                        medallas_bronce.push("Estudiante");
                                    }
                                });
                                //Votos respuestas
                                votos_respuestas.forEach(function(v, i){
                                    if(v.votos_respuesta >= 6){
                                        medallas_oro.push("Excelente respuesta");
                                    }
                                    else if(v.votos_respuesta >= 4 && v.votos_respuesta < 6){
                                        medallas_plata.push("Buena respuesta");
                                    }
                                    else if(v.votos_respuesta >= 2 && v.votos_respuesta < 4){
                                        medallas_bronce.push("Respuesta interesante");
                                    }
                                });
                                callback(null, medallas_oro, medallas_plata, medallas_bronce);
                            }  
                        });
                    }
                });
            }
        });
    }

}

module.exports = modelUser;