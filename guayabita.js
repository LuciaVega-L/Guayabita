// datos iniciales del juego
let cantJugadores;
let cuotaInicial;
let jugadores = [];
let pote;
let turnoJugadoresFinales = [];
let turnoActual = 0;
let esGuayabita = false; // indica si el ultimo resultado fue una guayabita, para saber que hacer al presionar "Siguiente turno"

document.getElementById("btnJugar").addEventListener("click", function () {
    cantJugadores = document.getElementById("cantJugadores").value;
    cuotaInicial = document.getElementById("cuotaInicial").value;
    jugadores = [];
    turnoActual = 0;
    pote = Number(cuotaInicial) * Number(cantJugadores);
    actualizarPote();

    turnoJugadoresFinales = jugadoresFinales(cantJugadores); // ahora SÍ ya está asignado al llegar aquí

    document.getElementById("decidirApostar").style.display = "flex";
    prepararTurno();
})

//muestra el valor actual del pote, se llama cada vez que el pote cambia
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
    document.getElementById("resultadoJugadorInicial").innerHTML = "El jugador inicial es: " + ordenado[0].id;
    return ordenado;
}

//deja lista la pantalla para el turno del jugador actual, SIN lanzar el dado todavia (eso lo hace el usuario con el boton)
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
    document.querySelectorAll('input[name="inputApostar"]').forEach(r => r.checked = false);

    document.getElementById("btnSiguienteTurno").style.display = "none";
    document.getElementById("btnLanzarDado").style.display = "inline-block";

    let jugadorActual = turnoJugadoresFinales[turnoActual];
    document.getElementById("resultadoDado").innerHTML = "Turno del jugador: " + jugadorActual.id + ". Presiona 'Lanzar dado!' para tirar.";
}

//el jugador actual lanza el dado cuando el usuario presiona el boton
document.getElementById("btnLanzarDado").addEventListener("click", jugar);

function jugar() {
    document.getElementById("btnLanzarDado").style.display = "none";

    let jugadorActual = turnoJugadoresFinales[turnoActual];
    jugadorActual.resultadoDado = lanzarDado();

    if (jugadorActual.resultadoDado === 1 || jugadorActual.resultadoDado === 6) {
        document.getElementById("resultadoDado").innerHTML = "El resultado del lanzamiento del dado de: " + jugadorActual.id + " es " + jugadorActual.resultadoDado;
        document.getElementById("pierdeTurno").innerHTML = "El jugador: " + jugadorActual.id + " perdio el turno! debe poner cuota adicional\nEsta es igual a la cuota inicial!";
        pote += Number(cuotaInicial);
        actualizarPote();

        document.getElementById("btnSiguienteTurno").style.display = "inline-block";
    } else {
        document.getElementById("resultadoDado").innerHTML = "El jugador: " + jugadorActual.id + " Tiene derecho a apostar!\nEl resultado del lanzamiento del dado fue:" + jugadorActual.resultadoDado;
        document.getElementById("textoDecidirApostar").innerHTML = "Jugador " + jugadorActual.id + " Desea apostar?";
        document.getElementById("zonaDecidirApostar").style.display = "flex";
    }
}

//avanza al siguiente turno, o si el ultimo resultado fue guayabita, inicia una ronda nueva
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

//apostar
function apostar(jugador) {
    let cantApuesta = Number(document.getElementById("cantidadApostar").value);
    if (cantApuesta > pote || cantApuesta <= 0 || !cantApuesta) {
        document.getElementById("alertaPote").innerHTML = "La cantidad a apostar puede ser una fraccion o total del pote, No mayor\nVuelva a ingresar";
        return;
    }

    let apostoTodo = (cantApuesta === pote);
    let tiroApuesta = lanzarDado();

    document.getElementById("zonaDecidirApostar").style.display = "none";

    if (tiroApuesta > jugador.resultadoDado) {
        pote -= cantApuesta;
        actualizarPote();
        if (apostoTodo) {
            document.getElementById("alertaPote").innerHTML =
                "GUAYABITA! El jugador " + jugador.id + " se comio la guayabita, sacando " + tiroApuesta +
                " y limpiando el pote entero ($" + cantApuesta + "). Todos deben volver a poner la cuota inicial.";
            esGuayabita = true;
        } else {
            document.getElementById("alertaPote").innerHTML = "Ganaste! sacaste " + tiroApuesta + ", te llevas $" + cantApuesta + " del pote.";
        }
    } else {
        pote += cantApuesta;
        actualizarPote();
        document.getElementById("alertaPote").innerHTML = "Perdiste, sacaste " + tiroApuesta + ", pones $" + cantApuesta + " al pote.";
    }

    document.getElementById("btnSiguienteTurno").style.display = "inline-block";
}

function iniciarNuevaRonda() {
    pote = Number(cuotaInicial) * Number(jugadores.length);
    actualizarPote();
    turnoActual = 0;
    prepararTurno();
}