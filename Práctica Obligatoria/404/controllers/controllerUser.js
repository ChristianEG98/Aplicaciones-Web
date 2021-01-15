"use strict";

const path = require("path");
const mysql = require("mysql");
const config = require("../config");
var modelUser = require("../models/modelUser");

//Crear el pool de conexiones
const pool = mysql.createPool(config.mysqlConfig);
var daoU = new modelUser(pool);

module.exports = {

    //Función que redirige de "/" a /login
    inicio: function(request, response){
        response.redirect("/login");
        response.status(200);
    },

    //Función que muestra la vista de login
    login: function (request, response){
        response.render("signIn", {errorMsg:null});
        response.status(200);
    },

    //Función de comrpobación para el formulario de login
    comprobarLogin: function(request, response, next){
        daoU.isUserCorrect(request.body.correo, request.body.contraseña, function (err, ok){
            if (err) {
                next(err);
                response.render("signIn", {errorMsg: err});
            }
            else if (ok){
                request.session.currentUser = request.body.correo;
                daoU.getUserName(request.body.correo, function(error, usuario){
                    if(error){
                        response.render("signIn", {errorMsg:"El usuario no está registrado"});
                    }
                    else{
                        request.session.currentName = usuario;
                        response.redirect("/index");
                        response.status(200);
                    }
                });
            } 
            else{
                response.render("signIn", {errorMsg:"Email y/o contraseña no válidos"});
            }
        });
    },

    //Función para mostrar la vista de registro
    registro: function(request, response){
        response.render("signUp");
        response.status(200);
    },

    //Función para comprobar el formulario de registro
    comprobarRegistro: function(request, response, next){
        if(request.body.correo != "" && request.body.contraseña != "" && request.body.contraseñaComprobación != "" && request.body.nombre != ""){
            if(request.body.contraseña == request.body.contraseñaComprobación){
                daoU.userSignUp(request.body.correo, request.body.contraseña, request.body.nombre, request.body.fotoPerfil, function (err, ok){
                    if (err) {
                        next(err);
                        response.render("signUp", {errorMsg:err});
                    }
                    else if (ok){
                        response.redirect("/login");
                        response.status(200);
                    } 
                    else{
                        response.render("signUp", {errorMsg:"Datos introducidos no válidos"});
                    }
                });
            }
            else{
                response.render("signUp", {errorMsg:"Las contraseñas no coinciden"});
            }
        }
        else{
            response.render("signUp", {errorMsg:"No has rellenado todos los campos necesarios"});
        }
    },

    //Función para desconectarse
    logout: function(request, response){
        request.session.destroy();
        response.redirect("/login");
        response.status(200);
    },

    //Función para mostrar la vista principal
    index: function(request, response){
        response.render("mainScreen");
        response.status(200);
    },

    //Función para mostrar la imagen de usuario del usuario logueado
    imagenUsuario: function(request, response, next){
        daoU.getUserImageName(response.locals.userEmail, function(err, imagenDevuelta){
            if(err){
                next(err);
                console.log("Error al buscar la imagen del usuario");
            }
            else if(imagenDevuelta){
                response.sendFile(path.join(__dirname, "../public/profile_imgs", imagenDevuelta));
                response.status(200);
            }
            else{
                console.log("Imagen no encontrada");
            }
        });
    },

    //Función para mostrar la imagen de perfil de cualquier otro usuario en el sistema
    mostrarImagenUsuarioEspecifica: function (request, response, next){
        daoU.getUserImageName(request.params.correo, function (err, imagenDevuelta) {
            if (err){
                next(err);
                console.log("Error al buscar la imagen del usuario");
            }
            else if (imagenDevuelta) {
                response.sendFile(path.join(__dirname, "../public/profile_imgs", imagenDevuelta));
                response.status(200);
            }
            else {
                console.log("Imagen no encontrada");
            }
        });
    },

    //Función para mostrar el perfil del usuario logueado
    mostrarPerfil: function(request, response, next){ 
        daoU.getUserInfo(response.locals.userEmail, function(err, infoDevuelta){
            if(err){
                next(err);
                console.log("Error al obtener la información del usuario");
            }
            else{
                daoU.medallasByUser(response.locals.userEmail, function(err, medallas_oro, medallas_plata, medallas_bronce){
                    if(err){
                        console.log("Error al obtener las medallas del usuario");
                    }
                    else{
                        response.render("perfilScreen", {info: infoDevuelta, medallas_oro, medallas_plata, medallas_bronce});
                        response.status(200);
                    }
                });
            }
        });
    },

    //Función para mostrar el perfil de un usuario registrado en el sistema
    mostrarPerfilEspecifico: function(request, response, next){
        daoU.getUserInfo(request.params.correo, function(err, infoDevuelta){
            if(err){
                next(err);
                console.log("Error al obtener la información del usuario");
            }
            else{
                daoU.medallasByUser(request.params.correo, function(err, medallas_oro, medallas_plata, medallas_bronce){
                    if(err){
                        console.log("Error al obtener las medallas del usuario");
                    }
                    else{
                        response.render("perfilScreen", {info: infoDevuelta, medallas_oro, medallas_plata, medallas_bronce});
                        response.status(200);
                    }
                });
            }
        });
    },

    //Función para listar todos los usuarios
    listarUsuarios: function(request, response, next){
        var tituloPagina = "Usuarios";
        daoU.getAllUserInfo(function(err, users){
            if(err){
                next(err);
                console.log("No se han podido leer los usuarios");
            }
            else{
                response.render("usuariosScreen", {userList: users, tituloPagina});
                console.log("Se han podido filtrar los usuarios");
                response.status(200);
            }
        });
    },

    //Función para filtrar por nombre los usuarios
    filtrarUsuariosPorNombre: function(request, response, next){
        var tituloPagina = "Usuarios filtrados for [" + request.body.filtrar + "]";
        daoU.filterByName(request.body.filtrar, function(err, users){
            if(err){
                next(err);
                console.log("No se han podido leer los usuarios");
            }
            else{
                response.render("usuariosScreen", {userList: users, tituloPagina});
                console.log("Se han podido filtrar los usuarios");
                response.status(200);
            }
        });
    },

};