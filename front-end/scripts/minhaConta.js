document.addEventListener("DOMContentLoaded", () => {
  const botaoSair = document.getElementById("sair");

  if (botaoSair) {
    botaoSair.addEventListener("click", (e) => {
      e.preventDefault();

      window.location.href = "login.html";
    });
  }
});