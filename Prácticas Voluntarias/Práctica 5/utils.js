"use strict"


function getToDoTasks(tasks){
    return tasks.filter(n => n.done !== true).map(n => n.text)
}


function findByTag(tasks, tag){
    return tasks.filter(n => n.tags.indexOf(tag, 0) != -1)
}


function findByTags(tasks, tags){
    return tasks.filter(n => n.tags.some( m => tags.indexOf(m, 0) > -1 ));
}


function countDone(tasks){
    return tasks.filter(n => n.done === true).length
}

function createTask(text){
    let tarea;
  	let tarea_encontrada = text.indexOf("@");
	
	if(tarea_encontrada === -1)
     	tarea ={ text: text, tags:[] };
  	else{
		text = text.trim();
        let aux = text.substring(0, tarea_encontrada);
		tarea = text.replace(RegExp("/@[a-z]+/gi"), " ").substring(tarea_encontrada -1, text.length).split(" @");
        tarea = {text: aux.trim(), tags: tarea.slice(1)};
    }
	return tarea;
}

module.exports = {
    getToDoTasks,
    findByTag,
    findByTags,
    countDone,
    createTask,
}