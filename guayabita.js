// datos iniciales del juego
let cantJugadores;
let cuotaInicial;
let jugadores = [];
cantJugadores=document.getElementById("cantJugadores").value;
cuotaInicial=document.getElementById("cuotaInicial").value;
resultadoJugadorInicial=document.getElementById("resultadoJugadorInicial").value;

//lanzar dado
function lanzarDado() {
    let dado = Math.floor(Math.random() * 6) + 1;
    return dado;
}



//turno de cada jugador
function turnoJugador(cantJugadores) {
    resultadojugadoresIniciales=[];
    turnoJugadoresFinal=[];
    for(let i=0;i<=cantJugadores;i++){
        jugadores.push({id: i, resultadoDado: lanzarDado()});
    }
   for(let i=1;i<jugadores.length;i++){
    let jugadorInicial=jugadores[0].id;
    for(let i=1;i<jugadores.length-1;i++){
        if(jugadorInicial.resultadoDado<jugadores[i].resultadoDado){
            jugadorInicial=jugadores[i].id; 
            resultadoJugadoresIniciales.clear();
            resultadoJugadoresIniciales.push(jugadorInicial); 
            turnoJugadoresFinal.unshift(jugadores[i].id);
        }else if(jugadorInicial.resultadoDado==jugadores[i].resultadoDado){
            resultadoJugadoresIniciales.push(jugadorInicial);
            resultadoJugadoresIniciales.push(jugadores[i].id);
        }
   }
   if(resultadoJugadoresIniciales.length>1){
        turnoJugador(resultadoJugadoresIniciales.length);
   }
}
}
