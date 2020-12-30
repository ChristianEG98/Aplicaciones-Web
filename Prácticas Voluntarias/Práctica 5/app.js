"use strict";

const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const express_session = require("express-session");
const express_mysql_session = require("express-mysql-session");
const session = require("express-session");
const DAOUsers = require("./DAOUsers");
const { nextTick } = require("process");

//Crear un servidor Express.js
const app = express();

//Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);

//Crear una instancia de DAOUsers
const daoU = new DAOUsers(pool);

//Middleware express-session y express-mysql-session
const MySQLStore = express_mysql_session(express_session);

//Crear una instancia de MySQLStore
const sessionStore = new MySQLStore({
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

//Creación de un middleware de sesión
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

//Añadirlo a la cadena de caracteres de middleware de la aplicación
app.use(middlewareSession);

//Creación de un middleware para comprobar currentUser y poder usar el email del usuario logueado
const middlewareCurrentUser = function(request, response, next){
    if(request.session.currentUser){
        response.locals.userEmail = request.session.currentUser;
        next();
    }
    else{
        response.redirect("/login");
    }
}

//Arrancar el servidor
app.listen(config.port, function(err){
    if(err){
        console.log("ERROR al iniciar el servidor");
    }
    else{
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

//Configurar EJS como motor de plantillas
app.set("view engine", "ejs");

//Definir el directorio de plantillas
app.set("views", path.join(__dirname, "views"));

//Recursos estáticos
const recursosEstaticos = path.join(__dirname, "public");
app.use(express.static(recursosEstaticos));

app.use(bodyParser.urlencoded({extended: false}));

//Listado de tareas
app.get("/tasks", middlewareCurrentUser, function(request, response){
    daoT.getAllTasks(response.locals.userEmail, function(err, result){
        if(err){
            console.log("Error al leer las tareas");
        }
        else{
            response.render("tasks", {taskList: result, correo: response.locals.userEmail});
            console.log("Se han podido leer las tareas");
        }
    });
});

//Añadir tareas
app.post("/addTask", middlewareCurrentUser, function(request, response){
    let task = utils.createTask(request.body.textoNota);
    daoT.insertTask(response.locals.userEmail, task, function(err, result){
        if(err){
            console.log("Error al insertar una nueva tarea");
        }
        else{   
            response.redirect("/tasks");
            console.log("Se ha podido crear la tarea");
        }
    });
});

//Marcar tarea como finalizada
app.get("/finish/:id", function(request, response) {
    daoT.markTaskDone(request.params.id, function(err){
        if(err){
            console.log("Error al marcar una tarea como finalizada");
        }else{
            response.redirect("/tasks");
            console.log("Se ha podido marcar como finalizada una tarea");
        }
    });
});

//Eliminar tareas completadas
app.get("/deletedCompleted", middlewareCurrentUser, function(request, response) {
    daoT.deleteCompleted(response.locals.userEmail, function(err){
        if(err){
            console.log("Error al eliminar las tareas finalizadas");
        }else{
            response.redirect("/tasks");
            console.log("Se ha podido eliminar todas las tareas finalizadas");
        }
    });
});

//Manejador de ruta para /login
app.get("/login", function(request, response){
    response.status(200);
    response.render("login", {errorMsg:null});
});

//Formulario de comprobación de inicio de sesión
app.post("/login", function(request, response){
    daoU.isUserCorrect(request.body.correo,
        request.body.password, function (error, ok){
        if (error) { // error de acceso a la base de datos
            response.status(500);
            response.render("login", {errorMsg:"Error interno de acceso a la base de datos"});
        }
        else if (ok){
            request.session.currentUser = request.body.correo;
            response.redirect("/tasks");
        } 
        else{
            response.status(200);
            response.render("login", {errorMsg:"Email y/o contraseña no válidos"});
        }
    });
});

//Manejador de ruta para /logout en el momento de Desconectar
app.get("/logout", function(request, response){
    request.session.destroy();
    response.redirect("/login");
});

//Manejador de ruta de /imagenUsuario
app.get("/imagenUsuario", middlewareCurrentUser, function(request, response){
    daoU.getUserImageName(response.locals.userEmail, function(err, ok){
        if(err){
            console.log("Error al buscar la imagen del usuario");
        }
        else if(ok){
            response.sendFile(path.join(__dirname, "profile_imgs", ok));
        }
        else{
            response.sendFile(path.join(__dirname, "public/img", "NoPerfil.png"));
        }
    });
});