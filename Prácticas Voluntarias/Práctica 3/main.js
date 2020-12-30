"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

//Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database    
});

let daoUser = new DAOUsers(pool);
let daoTasks = new DAOTasks(pool);

let task = {
    text: "Ir al gimnasio",
    done: false,
    tags:["sano", "fitness"]
}

//Definiciones de las funciones callback
function cb_isUserCorrect(err, result){
    if(err){
        console.log(err.message);
    }
    else if(result){
        console.log("Usuario y contraseña correctos");
    }
    else{
        console.log("Usuario y/o constraseña incorrectos");
    }
    pool.end();
}

function cb_getUserImageName(err, result){
    if(err){
        console.log(err.message);
    }
    else{
        console.log(result);
    }
    pool.end();
}

function cb_getAllTasks(err, result){
    if(err){
        console.log(err.message);
    }
    else{
        console.log(result);
    }
    pool.end();
}

function cb_tasks(err){
    if(err){
        console.log(err.message);
    }
    pool.end();
}

//Uso de los métodos de la clase DAOUsers
daoUser.isUserCorrect("usuario@ucm.es", "mipass", cb_isUserCorrect);
daoUser.getUserImageName("usuario@ucm.es", cb_getUserImageName);

//Uso de los métodos de la clase DAOTasks
daoTasks.getAllTasks("usuario@ucm.es", cb_getAllTasks);
daoTasks.insertTask("usuario@ucm.es", task, cb_tasks);
daoTasks.markTaskDone(1, cb_tasks);
daoTasks.deleteCompleted("usuario@ucm.es", cb_tasks);