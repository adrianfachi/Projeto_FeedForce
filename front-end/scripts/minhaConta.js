document.addEventListener("DOMContentLoaded", () => {
  const botaoSair = document.getElementById("sair");

  if (botaoSair) {
    botaoSair.addEventListener("click", (e) => {
      e.preventDefault();

      // (Opcional) Limpar dados do usuário se estiver usando localStorage ou sessionStorage
      // localStorage.clear();
      // sessionStorage.clear();

      // Redireciona para a tela de login
      window.location.href = "login.html";
    });
  }
});