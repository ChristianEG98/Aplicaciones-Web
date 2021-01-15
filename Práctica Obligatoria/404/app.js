"use strict";

const mysql = require("mysql");
const config = require("./config");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const express_session = require("express-session");
const express_mysql_session = require("express-mysql-session");
const session = require("express-session");
const morgan = require("morgan");

const userRouter = require("./routers/userRouter");
const questionRouter=require("./routers/questionRouter");

//Crear un servidor Express.js
const app = express();

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

//Añade a la cadena de middlewares de la aplicación
app.use(middlewareSession);
app.use(morgan("dev"));

//Arrancar el servidor
app.listen(config.port, function(err){
    if(err){
        console.log("Error al iniciar el servidor");
    }
    else{
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

//Configurar EJS como motor de plantillas
app.set("view engine", "ejs");

//Definir el directorio de plantillas
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended: false}));

//Recursos estáticos
const recursosEstaticos = path.join(__dirname, "public");
app.use(express.static(recursosEstaticos));

//Manejador de ruta para todas las vistas, esta barra no la tiene en cuenta, solo las que hay dentro de userRouter
app.use("/", userRouter);

//Manejador de ruta para todas las vistas, esta barra no la tiene en cuenta, solo las que hay dentro de questionRouter
app.use("/preguntas", questionRouter);

//Middleware para tratar el error 404
app.use(middlewareError404);

//Middleware para tratar el error 500
app.use(middlewareError500);

//Manejador de ruta para el error 500
function middlewareError500(error, request, response, next) {
    response.status(500);
    response.render("error500", {mensaje: error.message, pila: error.stack});
}

//Manejador de ruta para el error 404
function middlewareError404(request, response){    
    response.status(404);
    response.render("error404", { url: request.url }); 
}