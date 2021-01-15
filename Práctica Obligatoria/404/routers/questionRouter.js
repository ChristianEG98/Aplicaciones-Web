"user strict";

const express = require("express");
var questionRouter = express.Router();
const controllerQuestion = require("../controllers/controllerQuestion");

//Creación de un middleware de control de acceso con el email y el nombre del usuario
const middlewareCurrentUser = function (request, response, next) {
    if (request.session.currentUser && request.session.currentName) {
        response.locals.userEmail = request.session.currentUser;
        response.locals.userName = request.session.currentName;
        next();
    }
    else {
        response.redirect("/login");
    }
}

//Manejador de ruta para la vista de preguntas
questionRouter.get("/", middlewareCurrentUser, controllerQuestion.mostrarPreguntas);

//Manejador de ruta para formular pregunta
questionRouter.get("/formular", middlewareCurrentUser, controllerQuestion.formular);

//Formulario de nueva pregunta
questionRouter.post("/nuevaPregunta", middlewareCurrentUser, controllerQuestion.comprobarFormular);

//Manejador de ruta para las preguntas sin responder
questionRouter.get("/sin_responder", middlewareCurrentUser, controllerQuestion.mostrarPreguntasSinResponder);

//Manejador de ruta para ver una pregunta y sus respuestas
questionRouter.get("/:id_pregunta", middlewareCurrentUser, controllerQuestion.mostrarPreguntaEspecifica);

//Manejador de ruta para subir una respuesta
questionRouter.post("/subirRespuesta/:id_pregunta", middlewareCurrentUser, controllerQuestion.subirRespuesta);

//Manejador de ruta para filtrar por texto
questionRouter.post("/preguntasFiltradas", middlewareCurrentUser, controllerQuestion.filtrarPreguntasPorTexto);

//Manejador de ruta para filtrar por tag
questionRouter.get("/filtrar_etiquetas/:nombre_tema", middlewareCurrentUser, controllerQuestion.filtrarPreguntasPorEtiqueta);

//Manejador de ruta para votar positivo
questionRouter.post("/votar_positivo/:tipo/:id", middlewareCurrentUser, controllerQuestion.votarPositivo);

//Manejador de ruta para votar negativo
questionRouter.post("/votar_negativo/:tipo/:id", middlewareCurrentUser, controllerQuestion.votarNegativo);

module.exports=questionRouter;