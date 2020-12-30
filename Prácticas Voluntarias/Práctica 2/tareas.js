let listaTareas = [
    {text: "Preparar práctica AW", tags: ["AW","practica"]},
    {text: "Mirar fechas congreso", done: true, tags: []},
    {text: "Ir al supermercado", tags: ["personal"]},
    {text: "Mudanza", done: false, tags: ["personal"]},
];

/* Primero hacemos un filter sobre el array de tareas, que nos devuelve otro array solo
con aquellos elementos que tienen el atributo done distinto de true, y después con map
obtenemos un array final solo con los atributos text de los elementos del array anterior */
function getToDoTasks(tasks){
    return tasks.filter(n => n.done !== true).map(n => n.text)
}

/* Con indexOf sobre el array de tags, comprobamos si la etiqueta que le hemos
pasado es algun elemento del array desde el elemento 0 del mismo */
function findByTag(tasks, tag){
    return tasks.filter(n => n.tags.indexOf(tag, 0) != -1)
}

/* Con indexOf sobre el array de tags, comprobamos si la etiqueta que le hemos
pasado es algun elemento del array desde el elemento 0 del mismo, y con some */
function findByTags(tasks, tags){
    return tasks.filter(n => n.tags.some( m => tags.indexOf(m, 0) > -1 ));
}

/* Filtramos aquellos elementos que tienen el atributo done a true y devolvemos la
longitud del array resultante */
function countDone(tasks){
    return tasks.filter(n => n.done === true).length
}

/* Con el primer indexOf sobre la cadena que le hemos pasado, comprobamos sí hay algún @,
si no lo hay, devolvemos la tarea sin tags, aplicandole trim() para eliminar espacios en
blanco sobrantes. Si por el contrario, sí ha encontrado algún @: primero aplicamos trim(),
después con replace eliminamos el caracter @ y lo convertimos en espacio, y guardamos el
resultado en tarea. */
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