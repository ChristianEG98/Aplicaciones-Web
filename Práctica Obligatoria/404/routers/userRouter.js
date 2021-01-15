"user strict";

const express = require("express");
var userRouter = express.Router();
const controllerUser = require("../controllers/controllerUser");

//Creación de un middleware de control de acceso con el email y el nombre del usuario
const middlewareCurrentUser = function(request, response, next){
    if(request.session.currentUser && request.session.currentName){
        response.locals.userEmail = request.session.currentUser;
        response.locals.userName = request.session.currentName;
        next();
    }
    else{
        response.redirect("/login");
    }
}

//Manejador de ruta para /
userRouter.get("/", controllerUser.inicio);

//Manejador de ruta para login
userRouter.get("/login", controllerUser.login);

//Manejador de ruta para el formulario de login
userRouter.post("/login", controllerUser.comprobarLogin);

////Manejador de ruta para registro
userRouter.get("/registro", controllerUser.registro);

//Manejador de ruta para el formulario de registro
userRouter.post("/registro", controllerUser.comprobarRegistro);

//Manejador de ruta para cerrar sesión
userRouter.get("/logout", middlewareCurrentUser, controllerUser.logout);

//Manejador de ruta para la pantalla principal
userRouter.get("/index", middlewareCurrentUser, controllerUser.index);

//Manejador de ruta para las imágenes de usuario
userRouter.get("/imagenUsuario", middlewareCurrentUser, controllerUser.imagenUsuario);

// //Manejador de ruta para la imagen de perfil de las preguntas
userRouter.get("/imagenUsuario/:correo", controllerUser.mostrarImagenUsuarioEspecifica);

//Manejador de ruta para el perfil del usuario actual
userRouter.get("/perfil", middlewareCurrentUser, controllerUser.mostrarPerfil);

//Manejador de ruta para otros usuarios
userRouter.get("/perfil/:correo", middlewareCurrentUser, controllerUser.mostrarPerfilEspecifico);

//Manejador de ruta para la vista de todos los usuarios
userRouter.get("/usuarios", middlewareCurrentUser, controllerUser.listarUsuarios);

//Manejador de ruta para filtrar por nombre de usuario
userRouter.post("/usuarios/filtrar", middlewareCurrentUser, controllerUser.filtrarUsuariosPorNombre);

module.exports = userRouter;