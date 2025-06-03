window.onload = function () {
  const savedName = localStorage.getItem("playerName");

  if (savedName) {
    const usarNombre = confirm(`Ya tienes un usuario guardado: "${savedName}". ¿Quieres usarlo?`);

    if (usarNombre) {
      // Lo manda directo al juego
      window.location.href = "../SCENE/game.html";
    } else {
      // Le damos chance de cambiar el nombre: borramos el anterior
      localStorage.removeItem("playerName");
      // Modal se queda visible para que escriba uno nuevo
    }
  }
};

function startGame() {
  const nameInput = document.getElementById("playerNameInput");
  const playerName = nameInput.value.trim();

  if (playerName === "") {
    alert("Pon tu nombre primero bro...");
    return;
  }

  // Guardar nuevo nombre
  localStorage.setItem("playerName", playerName);

  // Redirige al juego
  window.location.href = "../MAIN_MENU/main.html";
}
