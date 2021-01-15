"use strict";

class modelQuestion {

    constructor(pool) {
        this.pool = pool;
    }

    getAllQuestions(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT pregunta.id_pregunta AS id_pregunta, nombre_tema, correo, titulo, cuerpo, nombre, fecha FROM pregunta LEFT JOIN usuario ON pregunta.id_correo = usuario.correo LEFT JOIN tema ON pregunta.id_pregunta = tema.id_pregunta",
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let questions = [];
                                var numPreguntas = 0;
                                var texto;
                                for (let i of rows) {
                                    //Si supera los 150 caracteres, cortamos la cadena
                                    if (i.cuerpo.length > 150) {
                                        texto = i.cuerpo.substring(0, 150) + "...";
                                    }
                                    else {
                                        texto = i.cuerpo;
                                    }
                                    if (!questions[i.id_pregunta]) {
                                        questions[i.id_pregunta] = { id: i.id_pregunta, correo: i.correo, titulo: i.titulo, cuerpo: texto, nombre: i.nombre, fecha: i.fecha, temas: [] };
                                        numPreguntas++;
                                    }
                                    if (i.nombre_tema) {
                                        questions[i.id_pregunta].temas.push(i.nombre_tema);
                                    }
                                }
                            callback(null, questions, numPreguntas);
                        }
                    }
                });
            }
        });
    }

    submitQuestion(email, titulo, cuerpo, etiquetas, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                let temas = [];
                //Busca por @ y cuando lo detecta, lo sustituye por un espacio
                temas = etiquetas.replace(RegExp("/@[a-z]+/gi"), " ").split("@");
                //Separa por espacios lo almacenado en lo anterior
                temas = { tags: temas.slice(1) };
                if (temas.tags.length > 5) {
                    callback(new Error("No puedes introducir más de 5 etiquetas"), false);
                }
                else {
                    var f = new Date();
                    var fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
                    connection.query("INSERT INTO pregunta (id_correo, titulo, cuerpo, fecha) VALUES (?, ?, ?, ?)",
                    [email, titulo, cuerpo, fecha],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            for (let i = 0; i < etiquetas.length; i++) {
                                connection.query("INSERT INTO tema(id_pregunta, nombre_tema) VALUES (?, ?)",
                                [result.insertId, temas.tags[i]]);
                                };
                            }
                        callback(null, true);
                    });
                }
            }
        });
    }

    filterByTag(nombreTag, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT pregunta.id_pregunta AS id_pregunta, nombre_tema, correo, titulo, cuerpo, nombre, fecha FROM pregunta LEFT JOIN usuario ON pregunta.id_correo = usuario.correo LEFT JOIN tema ON pregunta.id_pregunta = tema.id_pregunta WHERE nombre_tema = ?",
                    [nombreTag],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            }
                            else {
                                var numPreguntas = 0;
                                let questions = [];
                                var texto;
                                for (let i of rows) {
                                    if (i.cuerpo.length > 150) {
                                        texto = i.cuerpo.substring(0, 150) + "...";
                                    }
                                    else {
                                        texto = i.cuerpo;
                                    }
                                    if (!questions[i.id_pregunta]) {
                                        questions[i.id_pregunta] = { id: i.id_pregunta, correo: i.correo, titulo: i.titulo, cuerpo: texto, nombre: i.nombre, fecha: i.fecha, temas: [] };
                                        numPreguntas++;
                                    }
                                    if (i.nombre_tema) {
                                        questions[i.id_pregunta].temas.push(i.nombre_tema);
                                    }
                                }
                                callback(null, questions, numPreguntas);
                            }
                        }
                    });
            }
        });
    }

    filterByText(texto, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT pregunta.id_pregunta AS id_pregunta, nombre_tema, correo, titulo, cuerpo, nombre, fecha FROM pregunta LEFT JOIN usuario ON pregunta.id_correo = usuario.correo LEFT JOIN tema ON pregunta.id_pregunta = tema.id_pregunta WHERE titulo LIKE ? OR cuerpo LIKE ?",
                    ["%" + texto + "%", "%" + texto + "%"],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let questions = [];
                                var numPreguntas = 0;
                                var texto;
                                for (let i of rows) {
                                    if (i.cuerpo.length > 150) {
                                        texto = i.cuerpo.substring(0, 150) + "...";
                                    }
                                    else {
                                        texto = i.cuerpo;
                                    }
                                    if (!questions[i.id_pregunta]) {
                                        questions[i.id_pregunta] = { id: i.id_pregunta, correo: i.correo, titulo: i.titulo, cuerpo: texto, nombre: i.nombre, fecha: i.fecha, temas: [] };
                                        numPreguntas++;
                                    }
                                    if (i.nombre_tema) {
                                        questions[i.id_pregunta].temas.push(i.nombre_tema);
                                    }
                                }
                            callback(null, questions, numPreguntas);
                        }
                    }
                });
            }
        });
    }

    questionsNoAnswer(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT pregunta.id_pregunta AS id_pregunta, nombre_tema, correo, titulo, cuerpo, nombre, fecha FROM pregunta LEFT JOIN usuario ON pregunta.id_correo = usuario.correo LEFT JOIN tema ON pregunta.id_pregunta = tema.id_pregunta WHERE NOT EXISTS(SELECT respuesta.id_pregunta FROM respuesta WHERE pregunta.id_pregunta=respuesta.id_pregunta)",
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let questions = [];
                                var numPreguntas = 0;
                                var texto;
                                for (let i of rows) {
                                    if (i.cuerpo.length > 150) {
                                        texto = i.cuerpo.substring(0, 150) + "...";
                                    }
                                    else {
                                        texto = i.cuerpo;
                                    }
                                    if (!questions[i.id_pregunta]) {
                                        questions[i.id_pregunta] = { id: i.id_pregunta, correo: i.correo, titulo: i.titulo, cuerpo: texto, nombre: i.nombre, fecha: i.fecha, temas: [] };
                                        numPreguntas++;
                                    }
                                    if (i.nombre_tema) {
                                        questions[i.id_pregunta].temas.push(i.nombre_tema);
                                    }
                                }
                            callback(null, questions, numPreguntas);
                        }
                    }
                });
            }
        });
    }

    getQuestion(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT pregunta.id_pregunta AS id_pregunta, nombre_tema, correo, titulo, cuerpo, nombre, fecha, visitas, votos_positivos, votos_negativos FROM pregunta LEFT JOIN usuario ON pregunta.id_correo = usuario.correo LEFT JOIN tema ON pregunta.id_pregunta = tema.id_pregunta WHERE pregunta.id_pregunta = ?",
                    [id],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let questions = [];
                                var votos = 0;
                                for (let i of rows) {
                                    if (!questions[i.id_pregunta]) {
                                        votos = i.votos_positivos - i.votos_negativos;
                                        questions[i.id_pregunta] = { id: i.id_pregunta, correo: i.correo, titulo: i.titulo, cuerpo: i.cuerpo, nombre: i.nombre, fecha: i.fecha, numVisitas: i.visitas, totalVotos: votos, temas: [] }
                                    }
                                    if (i.nombre_tema) {
                                        questions[i.id_pregunta].temas.push(i.nombre_tema);
                                    }
                                }
                                connection.query("UPDATE pregunta SET visitas = visitas + 1 WHERE pregunta.id_pregunta = ?",
                                [id],
                                function (err) {
                                    if (err) {
                                        console.log("No se ha podido incrementar el número de visitas");
                                    }
                                    else {
                                        console.log("Visita sumada a la pregunta");
                                    }
                                });
                            callback(null, questions);
                        }
                    }
                });
            }
        });
    }

    getAnswers(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT id_correo, nombre, id_respuesta, cuerpo, votos_positivos, votos_negativos, fecha FROM respuesta LEFT JOIN usuario ON respuesta.id_correo = usuario.correo WHERE id_pregunta = ?",
                    [id],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let answers = [];
                                var votos = 0;
                                var numRespuestas = 0;
                                for (let i of rows) {
                                    if (!answers[i.id_respuesta]) {
                                        votos = i.votos_positivos - i.votos_negativos;
                                        answers[i.id_respuesta] = { id: i.id_respuesta, correo: i.id_correo, cuerpo: i.cuerpo, votos_positivos: i.votos_positivos, votos_negativos: i.votos_negativos, fecha: i.fecha, totalVotos: votos, nombre: i.nombre };
                                        numRespuestas++;
                                    }
                                }
                            callback(null, answers, numRespuestas);
                        }
                    }
                });
            }
        });
    }

    submitAnswer(id, correo, cuerpo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                var f = new Date();
                var fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
                connection.query("INSERT INTO respuesta (id_pregunta, id_correo, cuerpo, fecha) VALUES (?, ?, ?, ?)",
                    [id, correo, cuerpo, fecha],
                    function (err) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            callback(null);
                        }
                });
            }
        });
    }

    votePositive(id, tipo, correo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                //Preguntas
                if (tipo == "pregunta") {
                    connection.query("SELECT votado FROM vota WHERE id_pregunta = ? AND correo = ?",
                        [id, correo],
                        function (err, resultado_vota) {
                            if (err) {
                                callback(new Error("Error al acceder a la tabla de votos"));
                            }
                            else {
                                if (resultado_vota == "") {
                                    connection.query("UPDATE pregunta SET votos_positivos = votos_positivos + 1 WHERE id_pregunta = ?",
                                        [id],
                                        function (err) {
                                            if (err) {
                                                callback(new Error("Error al actualizar el número de votos positivos"));
                                            }
                                            else {
                                                connection.query("INSERT INTO vota (id_pregunta, correo, votado) VALUES (?, ?, ?)",
                                                    [id, correo, "1"],
                                                    function (err) {
                                                        if (err) {
                                                            callback(new Error("Error al insertar el voto único en la base de datos"));
                                                        }
                                                        else {
                                                            callback(null);
                                                        }
                                                    });
                                            }
                                        });
                                }
                                else {
                                    callback(null); //Devolver null para que no lo coja el middlewareError500
                                }
                            }
                        });
                }
                //Respuestas
                else {
                    connection.query("SELECT votado FROM vota WHERE id_respuesta = ? AND correo = ?",
                        [id, correo],
                        function (err, resultado_vota) {
                            if (err) {
                                callback(new Error("Error al acceder a la tabla de votos"));
                            }
                            else {
                                if (resultado_vota == "") {
                                    connection.query("UPDATE respuesta SET votos_positivos = votos_positivos + 1 WHERE id_respuesta = ?",
                                        [id],
                                        function (err) {
                                            if (err) {
                                                callback(new Error("Error al actualizar el número de votos positivos"));
                                            }
                                            else {
                                                connection.query("INSERT INTO vota (id_respuesta, correo, votado) VALUES (?, ?, ?)",
                                                    [id, correo, "1"],
                                                    function (err) {
                                                        if (err) {
                                                            callback(new Error("Error al insertar el voto único en la base de datos"));
                                                        }
                                                        else {
                                                            callback(null);
                                                        }
                                                    });
                                            }
                                        });
                                }
                                else {
                                    callback(null);
                                }
                            }
                        });
                }
            }
        });
    }

    voteNegative(id, tipo, correo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                //Preguntas
                if (tipo == "pregunta") {
                    connection.query("SELECT votado FROM vota WHERE id_pregunta = ? AND correo = ?",
                        [id, correo],
                        function (err, resultado_vota) {
                            if (err) {
                                callback(new Error("Error al acceder a la tabla de votos"));
                            }
                            else {
                                if (resultado_vota == "") {
                                    connection.query("UPDATE pregunta SET votos_negativos = votos_negativos + 1 WHERE id_pregunta = ?",
                                        [id],
                                        function (err) {
                                            if (err) {
                                                callback(new Error("Error al actualizar el número de votos positivos"));
                                            }
                                            else {
                                                connection.query("INSERT INTO vota (id_pregunta, correo, votado) VALUES (?, ?, ?)",
                                                    [id, correo, "1"],
                                                    function (err) {
                                                        if (err) {
                                                            callback(new Error("Error al insertar el voto único en la base de datos"));
                                                        }
                                                        else {
                                                            callback(null);
                                                        }
                                                    });
                                            }
                                        });
                                }
                                else {
                                    callback(null);
                                }
                            }
                        });
                }
                //Respuestas
                else {
                    connection.query("SELECT votado FROM vota WHERE id_respuesta = ? AND correo = ?",
                        [id, correo],
                        function (err, resultado_vota) {
                            if (err) {
                                callback(new Error("Error al acceder a la tabla de votos"));
                            }
                            else {
                                if (resultado_vota == "") {
                                    connection.query("UPDATE respuesta SET votos_negativos = votos_negativos + 1 WHERE id_respuesta = ?",
                                        [id],
                                        function (err) {
                                            if (err) {
                                                callback(new Error("Error al actualizar el número de votos positivos"));
                                            }
                                            else {
                                                connection.query("INSERT INTO vota (id_respuesta, correo, votado) VALUES (?, ?, ?)",
                                                    [id, correo, "1"],
                                                    function (err) {
                                                        if (err) {
                                                            callback(new Error("Error al insertar el voto único en la base de datos"));
                                                        }
                                                        else {
                                                            callback(null);
                                                        }
                                                    });
                                            }
                                        });
                                }
                                else {
                                    callback(null);
                                }
                            }
                        });
                }
            }
        });
    }
}



module.exports = modelQuestion;