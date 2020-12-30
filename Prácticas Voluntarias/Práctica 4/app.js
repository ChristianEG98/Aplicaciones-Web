"use strict";

const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

//Crear un servidor Express.js
const app = express();

//Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);

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
app.get("/tasks", function(request, response){
    daoT.getAllTasks("usuario@ucm.es", function(err, result){
        if(err){
            console.log("Error al leer las tareas");
        }
        else{
            response.render("tasks", {taskList: result});
            console.log("Se han podido leer las tareas");
        }
    });
});

//Añadir tareas
app.post("/addTask", function(request, response){
    let task = utils.createTask(request.body.textoNota);
    daoT.insertTask("usuario@ucm.es", task, function(err, result){
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
app.get("/deletedCompleted", function(request, response) {
    daoT.deleteCompleted("usuario@ucm.es", function(err){
        if(err){
            console.log("Error al eliminar las tareas finalizadas");
        }else{
            response.redirect("/tasks");
            console.log("Se ha podido eliminar todas las tareas finalizadas");
        }
    });
});