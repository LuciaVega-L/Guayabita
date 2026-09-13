// datos iniciales del juego
let cantJugadores;
let cuotaInicial;
let jugadores = [];

document.getElementById("btnJugar").addEventListener("click", function (){
    cantJugadores=document.getElementById("cantJugadores").value;
    cuotaInicial=document.getElementById("cuotaInicial").value;

    let turnoJugadoresFinales=jugadoresFinales(cantJugadores);

})

//lanzar dado
function lanzarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

//jugadres iniciales
function jugadoresFinales(cantJugadores) {
    for (let i = 0; i < cantJugadores; i++) {
        jugadores.push({ id: i, resultadoDado: lanzarDado() });
    }
    return calcularOrdenDeTiro(jugadores);
}

//turno de cada jugador
function turnoJugador(jugadores) {
    let resultadoJugadoresIniciales = [];
    let jugadorInicial=jugadores[0];
    for(let i=1;i<jugadores.length;i++){
        if(jugadorInicial.resultadoDado<jugadores[i].resultadoDado){
            jugadorInicial=jugadores[i];
            resultadoJugadoresIniciales.length=0;
            resultadoJugadoresIniciales.push(jugadorInicial); 
        }else if(jugadorInicial.resultadoDado===jugadores[i].resultadoDado){
            if(!resultadoJugadoresIniciales.includes(jugadorInicial)){
                resultadoJugadoresIniciales.push(jugadorInicial);
            }
            resultadoJugadoresIniciales.push(jugadores[i]);
        }
    }
   if(resultadoJugadoresIniciales.length>1){
       let jugadoresEmpatados=[];
        for(let i=0;i<resultadoJugadoresIniciales.length;i++){
            jugadoresEmpatados.push({ id: resultadoJugadoresIniciales[i].id, resultadoDado: lanzarDado() })
        }return turnoJugador(jugadoresEmpatados);
    }else{
        return [jugadorInicial];
    }
}

function calcularOrdenDeTiro(jugadores) {
    let ordenado = [...jugadores].sort((a, b) => b.resultadoDado - a.resultadoDado);

    let maxDado = ordenado[0].resultadoDado;
    let empatadosPrimerLugar = ordenado.filter(j => j.resultadoDado === maxDado);

    if (empatadosPrimerLugar.length > 1) {
        let ganadorPrimerLugar = turnoJugador(empatadosPrimerLugar);
        ordenado = ordenado.filter(j => j.id !== ganadorPrimerLugar[0].id);
        ordenado.unshift(jugadores.find(j => j.id === ganadorPrimerLugar[0].id));
    }

    document.getElementById("resultadoJugadorInicial").innerHTML =
        "El jugador inicial es: " + ordenado[0].id;

    return ordenado;
}


function jugar(){

}

