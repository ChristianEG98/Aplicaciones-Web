"use strict"


$(function(){
    let listaTags = [];

    $("#nombreTarea").on("change", function(){
        $("#nombreTask").text($(this).val());
    });

    $("#añadirTag").on("click", function(){
        let tag = $('#nuevoTagTarea').val();
        if(tag === ""){
            alert("No puede introducir un tag vacio");
        }
        else if(listaTags.includes("@" + tag)){
            alert("El tag no puede repetirse");
        }
        else{
            listaTags.push("@" + tag);
            let nuevoElemento = $("<li class='tag'>" + tag + "</li>");
            $("#listaTags").append(nuevoElemento);
        }
        $("#nuevoTagTarea").val("");
        event.preventDefault();
    });

    $("#listaTags").on("click", "li", function(event){
        $(event.target).remove();
        listaTags.splice(listaTags.indexOf(("@" + $(event.target).text().replace(/ /g, "_"))), 1);
    });

    $("#añadir_nota_nueva").on("click", function(){
        let textoNota = $("#nombreTask").text();
        if(!textoNota || textoNota === ""){
            alert("El nombre de la tarea no puede estar vacio");
        }
        else{
            $("#taskHidden").val(`${textoNota} ${listaTags.slice(0, listaTags.length).join(" ")}`);
        }
    });
});