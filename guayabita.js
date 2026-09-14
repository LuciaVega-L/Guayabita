// datos iniciales del juego
let cantJugadores;
let cuotaInicial;
let jugadores = [];
let pote;
let turnoJugadoresFinales=[]
let turnoActual = 0;

document.getElementById("btnJugar").addEventListener("click", function (){
    cantJugadores = document.getElementById("cantJugadores").value;
    cuotaInicial = document.getElementById("cuotaInicial").value;
    jugadores = [];
    turnoActual = 0;
    pote = Number(cuotaInicial) * Number(cantJugadores);

    turnoJugadoresFinales = jugadoresFinales(cantJugadores); // ahora SÍ ya está asignado al llegar aquí

    document.getElementById("decidirApostar").style.display = "block";
    jugar();
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
    document.getElementById("resultadoJugadorInicial").innerHTML = "El jugador inicial es: " + ordenado[0].id;
    return ordenado;
}
//empear jugar
function jugar(){
    if(turnoActual >= turnoJugadoresFinales.length){
        document.getElementById("textoDecidirApostar")
            ? document.getElementById("textoDecidirApostar").innerHTML = "Ronda terminada."
            : null;
        return;
    }

    let jugadorActual = turnoJugadoresFinales[turnoActual];
    jugadorActual.resultadoDado = lanzarDado();

    if(jugadorActual.resultadoDado===1 || jugadorActual.resultadoDado===6){
        document.getElementById("pierdeTurno").innerHTML = "El jugador: " + jugadorActual.id + " perdio el turno! debe poner cuota adicional\nEsta es igual a la cuota inicial!";
        pote += Number(cuotaInicial);

        turnoActual++;
        jugar();
    }else{
        document.getElementById("textoDecidirApostar").innerHTML = "Jugador "+jugadorActual.id + " Desea apostar?";
    }
}

document.getElementById("btnDecidirApostar").addEventListener("click", function(){
    let jugadorActual = turnoJugadoresFinales[turnoActual];
    let opcionElegida = document.querySelector('input[name="inputApostar"]:checked');

    if(!opcionElegida) return;

    let desicion = opcionElegida.value;

    if(desicion==="si"){
        document.getElementById("zonaCantidadApostar").style.display = "block";
    }else{
        turnoActual++;
        jugar();
    }
})

document.getElementById("btnConfirmarApuesta").addEventListener("click", function(){
    let jugadorActual = turnoJugadoresFinales[turnoActual];
    apostar(jugadorActual);
})

//apostar
function apostar(jugador){
    let cantApuesta = Number(document.getElementById("cantidadApostar").value);
    if(cantApuesta > pote || cantApuesta <= 0 || !cantApuesta){
        document.getElementById("alertaPote").innerHTML="La cantidad a apostar puede ser una fraccion o total del pote, No mayor\nVuelva a ingresar";
        return;
    }

    let apostoTodo = (cantApuesta === pote);
    let tiroApuesta = lanzarDado();

    if(tiroApuesta > jugador.resultadoDado){
        pote -= cantApuesta;
        if(apostoTodo){

            document.getElementById("alertaPote").innerHTML =
                "GUAYABITA! El jugador " + jugador.id + " se comio la guayabita, sacando " + tiroApuesta +
                " y limpiando el pote entero ($" + cantApuesta + "). Todos deben volver a poner la cuota inicial.";
            iniciarNuevaRonda();
            return;
        }else{
            document.getElementById("alertaPote").innerHTML = "Ganaste! sacaste " + tiroApuesta + ", te llevas $" + cantApuesta + " del pote.";
        }
    }else{
        pote += cantApuesta;
        document.getElementById("alertaPote").innerHTML = "Perdiste, sacaste " + tiroApuesta + ", pones $" + cantApuesta + " al pote.";
    }
    turnoActual++;
    jugar();
}

function iniciarNuevaRonda(){
    pote = Number(cuotaInicial) * Number(jugadores.length);
    turnoActual = 0;

    document.getElementById("pierdeTurno").innerHTML = "";
    document.getElementById("zonaCantidadApostar").style.display = "none";
    document.querySelectorAll('input[name="inputApostar"]').forEach(r => r.checked = false);
    jugar();
}