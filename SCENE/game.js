// Pausar y reanudar el juego con ESC
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.getElementById("pause-menu").classList.toggle("hidden");
    }
});

// Reanudar juego
document.getElementById("resume-btn").addEventListener("click", function() {
    document.getElementById("pause-menu").classList.add("hidden");
});

// Abrir configuración
document.getElementById("settings-btn").addEventListener("click", function() {
    document.getElementById("pause-menu").classList.add("hidden");
    document.getElementById("settings-menu").classList.remove("hidden");
});

//QUITAR
document.getElementById("quit-btn").addEventListener("click", function() {
    document.getElementById("pause-menu").classList.add("hidden");
    document.getElementById("share-modal").classList.remove("hidden");
});

// Volver del menú de configuración
document.getElementById("back-btn").addEventListener("click", function() {
    document.getElementById("settings-menu").classList.add("hidden");
    document.getElementById("pause-menu").classList.remove("hidden");
});

// Mostrar puntuaciones mientras TAB está presionado
document.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
        event.preventDefault();
        document.getElementById("scoreboard").classList.remove("hidden");
    }
});

// Ocultar puntuaciones al soltar TAB
document.addEventListener("keyup", function(event) {
    if (event.key === "Tab") {
        document.getElementById("scoreboard").classList.add("hidden");
    }
});

// Salir redirigir al menú principal
document.getElementById("skip-share-btn").addEventListener("click", function() {
    console.log('No se compartió el progreso. Redirigiendo al menú...');
    window.location.href = "../MAIN_MENU/main.html";
});

//Seguir jugando
document.getElementById("skip-return-btn").addEventListener("click", function() {
    console.log('Continuemos jugando...');
    document.getElementById("share-modal").classList.add("hidden");
});

// Al final de la partida:
localStorage.setItem("playerKills", 20); // o el valor real de kills
localStorage.setItem("playerScore", 2600); // o el valor real de score




