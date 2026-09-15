// datos iniciales del juego
let cantJugadores;
let cuotaInicial;
let jugadores = [];
let pote;
let turnoJugadoresFinales = [];
let turnoActual = 0;
let esGuayabita = false; 
document.getElementById("btnJugar").addEventListener("click", function () {
    cantJugadores = document.getElementById("cantJugadores").value;
    cuotaInicial = document.getElementById("cuotaInicial").value;
    jugadores = [];
    turnoActual = 0;
    pote = Number(cuotaInicial) * Number(cantJugadores);
    actualizarPote();

    turnoJugadoresFinales = jugadoresFinales(cantJugadores); 

    document.getElementById("decidirApostar").style.display = "flex";
    prepararTurno();
})

//muestra el valor actual del pote dinamicamnete 
function actualizarPote() {
    document.getElementById("poteActual").innerHTML = "Pote actual: $" + pote;
}

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
    let jugadorInicial = jugadores[0];
    for (let i = 1; i < jugadores.length; i++) {
        if (jugadorInicial.resultadoDado < jugadores[i].resultadoDado) {
            jugadorInicial = jugadores[i];
            resultadoJugadoresIniciales.length = 0;
            resultadoJugadoresIniciales.push(jugadorInicial);
        } else if (jugadorInicial.resultadoDado === jugadores[i].resultadoDado) {
            if (!resultadoJugadoresIniciales.includes(jugadorInicial)) {
                resultadoJugadoresIniciales.push(jugadorInicial);
            }
            resultadoJugadoresIniciales.push(jugadores[i]);
        }
    }
    if (resultadoJugadoresIniciales.length > 1) {
        let jugadoresEmpatados = [];
        for (let i = 0; i < resultadoJugadoresIniciales.length; i++) {
            jugadoresEmpatados.push({ id: resultadoJugadoresIniciales[i].id, resultadoDado: lanzarDado() })
        } return turnoJugador(jugadoresEmpatados);
    } else {
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
    document.getElementById("resultadoJugadorInicial").innerHTML = "El jugador inicial es: " + (ordenado[0].id + 1) + " con un resultado de: " + ordenado[0].resultadoDado;
    return ordenado;
}

function prepararTurno() {
    if (turnoActual >= turnoJugadoresFinales.length) {
        turnoActual = 0;
    }

    document.getElementById("pierdeTurno").innerHTML = "";
    document.getElementById("alertaPote").innerHTML = "";
    document.getElementById("textoDecidirApostar").innerHTML = "";
    document.getElementById("zonaDecidirApostar").style.display = "none";
    document.getElementById("zonaCantidadApostar").style.display = "none";
    document.getElementById("cantidadApostar").value = "";
    document.getElementById("camposApuesta").style.display = "block";
    document.getElementById("btnLanzarDadoApuesta").style.display = "none";
    document.querySelectorAll('input[name="inputApostar"]').forEach(r => r.checked = false);

    document.getElementById("btnSiguienteTurno").style.display = "none";
    document.getElementById("btnLanzarDado").style.display = "inline-block";

    let jugadorActual = turnoJugadoresFinales[turnoActual];
    document.getElementById("resultadoDado").innerHTML = "Turno del jugador: " + (jugadorActual.id + 1) + ". Presiona 'Lanzar dado!' para tirar.";
}

//el jugador actual lanza el dado cuandopresiona el boton
document.getElementById("btnLanzarDado").addEventListener("click", jugar);

function jugar() {
    document.getElementById("btnLanzarDado").style.display = "none";

    let jugadorActual = turnoJugadoresFinales[turnoActual];
    jugadorActual.resultadoDado = lanzarDado();

    if (jugadorActual.resultadoDado === 1 || jugadorActual.resultadoDado === 6) {
        document.getElementById("resultadoDado").innerHTML = "El resultado del lanzamiento del dado de: " + (jugadorActual.id + 1) + " es: " + jugadorActual.resultadoDado;
        document.getElementById("pierdeTurno").innerHTML = "El jugador: " + (jugadorActual.id + 1) + " perdio el turno! debe poner cuota adicional\nEsta es igual a la cuota inicial!";
        pote += Number(cuotaInicial);
        actualizarPote();

        document.getElementById("btnSiguienteTurno").style.display = "inline-block";
    } else {
        document.getElementById("resultadoDado").innerHTML = "El jugador: " + (jugadorActual.id + 1) + " Tiene derecho a apostar!\nEl resultado del lanzamiento del dado fue:" + jugadorActual.resultadoDado;
        document.getElementById("textoDecidirApostar").innerHTML = "Jugador " + (jugadorActual.id + 1) + " Desea apostar?";
        document.getElementById("zonaDecidirApostar").style.display = "flex";
    }
}

//avanza al siguiente turno o si resultado fue guayabita inicia ronda nueva
document.getElementById("btnSiguienteTurno").addEventListener("click", function () {
    if (esGuayabita) {
        esGuayabita = false;
        iniciarNuevaRonda();
    } else {
        turnoActual++;
        prepararTurno();
    }
})
document.getElementById("btnDecidirApostar").addEventListener("click", function () {
    let opcionElegida = document.querySelector('input[name="inputApostar"]:checked');

    if (!opcionElegida) return;

    let desicion = opcionElegida.value;

    if (desicion === "si") {
        document.getElementById("zonaCantidadApostar").style.display = "flex";
    } else {
        document.getElementById("zonaDecidirApostar").style.display = "none";
        turnoActual++;
        prepararTurno();
    }
})

document.getElementById("btnConfirmarApuesta").addEventListener("click", function () {
    let jugadorActual = turnoJugadoresFinales[turnoActual];
    apostar(jugadorActual);
})

let cantApuestaActual = 0;
let apostoTodoActual = false;

function apostar(jugador) {
    let cantApuesta = Number(document.getElementById("cantidadApostar").value);
    if (cantApuesta > pote || cantApuesta <= 0 || !cantApuesta) {
        document.getElementById("alertaPote").innerHTML = "La cantidad a apostar puede ser una fraccion o total del pote\nVuelva a ingresar";
        return;
    }

    cantApuestaActual = cantApuesta;
    apostoTodoActual = (cantApuesta === pote);

    document.getElementById("camposApuesta").style.display = "none";
    document.getElementById("alertaPote").innerHTML = "Apuesta confirmada: $" + cantApuesta + ". Presiona 'Lanzar dado!' para conocer el resultado.";
    document.getElementById("btnLanzarDadoApuesta").style.display = "inline-block";
}

//el jugador lanza el dado que decide si gana o pierde la apuesta
document.getElementById("btnLanzarDadoApuesta").addEventListener("click", function () {
    let jugadorActual = turnoJugadoresFinales[turnoActual];
    resolverApuesta(jugadorActual);
})

//resuelve la apuesta ya confirmada
function resolverApuesta(jugador) {
    document.getElementById("btnLanzarDadoApuesta").style.display = "none";
    document.getElementById("zonaDecidirApostar").style.display = "none";

    let tiroApuesta = lanzarDado();
    if (tiroApuesta > jugador.resultadoDado) {
        pote -= cantApuestaActual;
        actualizarPote();
        if (apostoTodoActual) {
            document.getElementById("alertaPote").innerHTML =
                "GUAYABITA! El jugador " + (jugador.id + 1) + " se comio la guayabita, sacando " + tiroApuesta +
                " y limpiando el pote entero ($" + cantApuestaActual + "). Todos deben volver a poner la cuota inicial.";
            esGuayabita = true;
        } else {
            document.getElementById("alertaPote").innerHTML = "Ganaste! sacaste " + tiroApuesta + ", te llevas $" + cantApuestaActual + " del pote.";
        }
    } else {
        pote += cantApuestaActual;
        actualizarPote();
        document.getElementById("alertaPote").innerHTML = "Perdiste, sacaste " + tiroApuesta + ", pones $" + cantApuestaActual + " al pote.";
    }
    document.getElementById("btnSiguienteTurno").style.display = "inline-block";
}
function iniciarNuevaRonda() {
    pote = Number(cuotaInicial) * Number(jugadores.length);
    actualizarPote();
    turnoActual = 0;
    prepararTurno();
}