window.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("inputMensagem");
  const listaSugestoes = document.getElementById("sugestoes");
  const btnAnonimo = document.getElementById("btnAnonimo");

  let etapa = 0;
  let nome = '';
  let mensagem = '';
  let anonimo = false;

  // Alternar anonimato
  btnAnonimo.addEventListener("click", () => {
    anonimo = !anonimo;
    btnAnonimo.textContent = anonimo ? "Anonimato: Ligado" : "Anonimato: Desligado";
  });

  // Adiciona mensagem ao chat
  function adicionarMensagem(texto, classe = "bot") {
    const div = document.createElement("div");
    div.classList.add("mensagem", classe);
    div.textContent = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  // Primeira mensagem
  adicionarMensagem("Para quem você quer enviar?");

  // Buscar id_user pelo user_name
  const BACKEND_URL = "http://127.0.0.1:5000"; // porta do Flask

async function buscarIdUsuarioPorNome(nome) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/buscar_usuario?nome=${encodeURIComponent(nome)}`);
    const result = await response.json();
    if (response.ok && result.id) {
      return result.id;
    } else {
      console.error("Erro na resposta:", result);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}



  // Enviar feedback para backend Python
  async function enviarFeedback(feedbackData) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      const result = await response.json();

      if (!response.ok) {
        adicionarMensagem("Erro ao enviar feedback: " + (result.error || "Erro desconhecido"));
      } else {
        adicionarMensagem("Feedback enviado com sucesso!");
      }
    } catch (error) {
      adicionarMensagem("Erro ao enviar feedback: " + error.message);
    }
  }

  // Digitação
  input.addEventListener("keydown", async function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const textoUsuario = input.value.trim();
      adicionarMensagem(textoUsuario, "usuario");
      input.value = "";
      listaSugestoes.innerHTML = "";

      if (etapa === 0) {
        nome = textoUsuario;
        setTimeout(() => adicionarMensagem("O que você quer dizer?"), 500);
        etapa = 1;
      } else if (etapa === 1) {
        mensagem = textoUsuario;
        setTimeout(() => {
          adicionarMensagem("Deseja enviar?");
          mostrarBotoesEnviar();
        }, 500);
        etapa = 2;
      }
    }
  });

  // Mostrar botões para confirmar envio
  function mostrarBotoesEnviar() {
    input.disabled = true;

    const container = document.createElement("div");
    container.classList.add("botoes");

    const botaoSim = document.createElement("button");
    botaoSim.classList.add("botao");
    botaoSim.textContent = "Sim";

    botaoSim.onclick = async () => {
  const id_user = await buscarIdUsuarioPorNome(nome);

  if (!id_user) {
    adicionarMensagem("Usuário não encontrado para enviar feedback.");
    input.disabled = false;
    container.remove();
    return;
  }

  const feedbackData = {
    id_user,
    feedback: mensagem,
    score: 1,
    id_evaluator: anonimo ? null : "id_avaliador_aqui",
  };

  await enviarFeedback(feedbackData);
  input.disabled = false;
  container.remove();
};

    const botaoNao = document.createElement("button");
    botaoNao.classList.add("botao");
    botaoNao.textContent = "Não";
    botaoNao.onclick = () => {
      adicionarMensagem("Não", "usuario");
      adicionarMensagem("Ok, o feedback não foi enviado.");
      container.remove();
      input.disabled = false;
    };

    container.appendChild(botaoSim);
    container.appendChild(botaoNao);
    chat.appendChild(container);
    chat.scrollTop = chat.scrollHeight;
  }
});
