"use strict";

const path = require("path");
const mysql = require("mysql");
const config = require("../config");
var modelQuestion = require("../models/modelQuestion");

//Crear el pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);

var daoQ = new modelQuestion(pool);

module.exports = {
    //Funcion que muestra la vista para formular una pregunta
    formular: function (request, response) {
        response.render("formularScreen");
        response.status(200);
    },

    //Función que comprueba el formulario de nueva pregunta
    comprobarFormular: function (request, response, next) {
        if(request.body.tituloPregunta != "" && request.body.cuerpoPregunta != "") {
            daoQ.submitQuestion(response.locals.userEmail, request.body.tituloPregunta, request.body.cuerpoPregunta, request.body.tagsPregunta, function (err, ok) {
                if (err) {
                    next(err);
                    response.render("formularScreen", { errorMsg: err });
                }
                else if (ok) {
                    response.redirect("/index");
                    response.status(200);
                }
                else {
                    response.render("formularScreen", { errorMsg: "Datos introducidos no válidos" });
                }
            });
        }
        else {
            response.render("formularScreen", { errorMsg: "No has rellenado todos los campos necesarios" });
        }
    },

    //Función que muestra todas las preguntas
    mostrarPreguntas: function (request, response, next) {
        var tituloPagina = "Todas las preguntas";
        daoQ.getAllQuestions(function (err, result, cantidadPreguntas) {
            if (err) {
                next(err);
                console.log("Error al leer las preguntas");
            }
            else {
                response.render("preguntasScreen", { questionList: result, cantidadPreguntas, tituloPagina });
                console.log("Se han podido leer las preguntas");
                response.status(200);
            }
        })
    },

    //Función que muestra las preguntas que están sin responder
    mostrarPreguntasSinResponder: function (request, response, next) {
        var tituloPagina = "Preguntas sin responder";
        daoQ.questionsNoAnswer(function (err, result, cantidadPreguntas) {
            if (err) {
                next(err);
                console.log("Error al leer las preguntas sin respuesta");
            }
            else {
                response.render("preguntasScreen", { questionList: result, cantidadPreguntas, tituloPagina });
                console.log("Se han podido leer las preguntas sin respuesta");
                response.status(200);
            }
        });
    },

    //Función que muestra una pregunta específica y sus respuestas
     mostrarPreguntaEspecifica: function (request, response, next) {
        daoQ.getQuestion(request.params.id_pregunta, function (err, question) {
            if (err) {
                next(err);
                console.log("No se ha podido leer la pregunta");
            }
            else {
                daoQ.getAnswers(request.params.id_pregunta, function (err, answers, cantidadRespuestas) {
                    if (err) {
                        console.log("No se ha podido leer las respuestas");
                    }
                    else {
                        response.render("respuestasScreen", { questionList: question, answerList: answers, cantidadRespuestas });
                        console.log("Se ha podido leer la pregunta");
                        response.status(200);
                    }
                })
            }
        })
    }, 

    //Función para subir una nueva respuesta
    subirRespuesta: function (request, response, next) {
        daoQ.submitAnswer(request.params.id_pregunta, response.locals.userEmail, request.body.textorespuesta, function (err) {
            if (err) {
                next(err);
                console.log("Error al introducir la nueva respuesta");
            }
            else {
                response.redirect("/preguntas");
                console.log("Se ha podido introducir la respuesta");
                response.status(200);
            }
        });
    },

    //Función para filtrar las preguntas por texto
    filtrarPreguntasPorTexto: function (request, response, next) {
        var tituloPagina = "Resultados de la búsqueda: " + request.body.busqueda;
        daoQ.filterByText(request.body.busqueda, function (err, result, cantidadPreguntas) {
            if (err) {
                next(err);
                console.log("Error al filtrar preguntas por texto");
            }
            else if(result){
                response.render("preguntasScreen", { questionList: result, cantidadPreguntas, tituloPagina });
                console.log("Se han podido filtrar las preguntas por texto");
                response.status(200);
            }
            else{
                cantidadPreguntas = 0;
                response.render("preguntasScreen", { questionList: result, cantidadPreguntas, tituloPagina });
                console.log("Se han podido filtrar, pero no hay ninguna pregunta que cumpla esa condición");
                response.status(200);
            }
        });
    },

    //Función que permite filtrar las preguntas por etiquetas
    filtrarPreguntasPorEtiqueta: function (request, response, next) {
        var tituloPagina = "Preguntas con la etiqueta [" + request.params.nombre_tema + "]";
        daoQ.filterByTag(request.params.nombre_tema, function (err, result, cantidadPreguntas) {
            if (err) {
                next(err);
                console.log("Error al leer el tag de la pregunta");
            }
            else {
                response.render("preguntasScreen", { questionList: result, cantidadPreguntas, tituloPagina });
                console.log("Se han podido filtrar las preguntas por tag");
                response.status(200);
            }
        });
    },

    //Función para votar positivo una pregunta o una respuestas
    votarPositivo: function (request, response, next) {
        daoQ.votePositive(request.params.id, request.params.tipo, response.locals.userEmail, function (err) {
            if (err) {
                next(err);
                console.log("Error al votar positivo");
                response.redirect("/preguntas");
            }
            else {
                console.log("Voto correcto añadido");
                response.redirect("/preguntas");
                response.status(200);
            }
        });
    },

    //Función para votar negativo una pregunta o una respuestas
    votarNegativo: function (request, response, next) {
        daoQ.voteNegative(request.params.id, request.params.tipo, response.locals.userEmail, function (err) {
            if (err) {
                next(err);
                console.log("Error al votar negativo");
                response.redirect("/preguntas");
            }
            else {
                console.log("Voto negativo añadido");
                response.redirect("/preguntas");
                response.status(200);
            }
        });
    },

}