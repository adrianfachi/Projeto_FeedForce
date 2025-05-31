document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menuOpcoes = document.getElementById("menuOpcoes");
  const imagemPerfil = document.getElementById("imagemPerfil");
  const inputImagem = document.getElementById("inputImagem");

  // Abrir/fechar menu
  menuToggle.addEventListener("click", () => {
    menuOpcoes.style.display = menuOpcoes.style.display === "flex" ? "none" : "flex";
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !menuOpcoes.contains(e.target)) {
      menuOpcoes.style.display = "none";
    }
  });

  // Ver imagem
  document.getElementById("verImagem").addEventListener("click", () => {
    const bg = imagemPerfil.style.backgroundImage;
    if (bg && bg !== "none") {
      const url = bg.slice(5, -2);
      window.open(url, "_blank");
    } else {
      alert("Nenhuma imagem para visualizar.");
    }
  });

  // Editar imagem (upload)
  document.getElementById("editarImagem").addEventListener("click", () => {
    inputImagem.click();
  });

  inputImagem.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imagemPerfil.style.backgroundImage = `url('${reader.result}')`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Remover imagem
  document.getElementById("removerImagem").addEventListener("click", () => {
    imagemPerfil.style.backgroundImage = "none";
    inputImagem.value = null;
  });
});
