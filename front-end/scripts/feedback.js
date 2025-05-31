const chat = document.getElementById("chat");
const input = document.getElementById("inputMensagem");
const listaSugestoes = document.getElementById("sugestoes");

let etapa = 0;
let nome = '';
let mensagem = '';
let anonimo = false;

// Lista de nomes simulada
const nomesUsuarios = [
  "Ana Souza", "Ana Lima", "Ana Mendes", "Ana Rocha",
  "Andy Silva", "Fernanda Costa", "Gabriel Monteiro",
  "Helena Duarte", "Igor Santos", "Joana Barros"
];

function adicionarMensagem(texto, classe = "bot") {
  const div = document.createElement("div");
  div.classList.add("mensagem", classe);
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function enviarFeedbackParaBackend() {
  const feedbackData = {
    nome: nome,  // Nome do destinatário
    mensagem: mensagem,  // Texto da mensagem
    anonimo: anonimo,  // Se é anônimo ou não
    datetime: new Date().toISOString()  // Data e hora do envio
  };

  // Enviar para o backend na porta 5000
  fetch("http://localhost:5000/processar-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(feedbackData)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Feedback enviado com sucesso:", data);
      adicionarMensagem(
        anonimo
          ? "Feedback anônimo enviado com sucesso!"
          : `Feedback enviado para ${nome}!`
      );
    })
    .catch(err => {
      console.error("Erro ao enviar:", err);
      adicionarMensagem("Ocorreu um erro ao tentar enviar o feedback.");
    });
}

// Primeira mensagem do bot
adicionarMensagem("Para quem você quer enviar?");

// Autocompletar ao digitar
input.addEventListener("input", () => {
  const valor = input.value.toLowerCase().trim();
  listaSugestoes.innerHTML = "";

  if (etapa !== 0 || valor === "") return;

  const correspondentes = nomesUsuarios
    .filter(nome => nome.toLowerCase().includes(valor))
    .slice(0, 5);

  correspondentes.forEach(nome => {
    const li = document.createElement("li");
    li.textContent = nome;
    li.addEventListener("click", () => {
      input.value = nome;
      listaSugestoes.innerHTML = "";
      input.focus();
    });
    listaSugestoes.appendChild(li);
  });
});

document.addEventListener("click", (e) => {
  if (!input.contains(e.target) && !listaSugestoes.contains(e.target)) {
    listaSugestoes.innerHTML = "";
  }
});

// Controle do chat
input.addEventListener("keydown", function (e) {
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
        adicionarMensagem("Você quer enviar esse feedback de forma anônima?");
        mostrarBotoesAnonimo();
      }, 500);
      etapa = 2;
    }
  }
});

function mostrarBotoesAnonimo() {
  input.disabled = true;

  const container = document.createElement("div");
  container.classList.add("botoes");

  const botaoSim = document.createElement("button");
  botaoSim.classList.add("botao");
  botaoSim.textContent = "Sim";
  botaoSim.onclick = () => {
    adicionarMensagem("Sim", "usuario");
    anonimo = true;
    container.remove();
    input.disabled = false;
    setTimeout(() => {
      adicionarMensagem("Deseja enviar?");
      mostrarBotoesEnviar();
    }, 500);
  };

  const botaoNao = document.createElement("button");
  botaoNao.classList.add("botao");
  botaoNao.textContent = "Não";
  botaoNao.onclick = () => {
    adicionarMensagem("Não", "usuario");
    anonimo = false;
    container.remove();
    input.disabled = false;
    setTimeout(() => {
      adicionarMensagem("Deseja enviar?");
      mostrarBotoesEnviar();
    }, 500);
  };

  container.appendChild(botaoSim);
  container.appendChild(botaoNao);
  chat.appendChild(container);
  chat.scrollTop = chat.scrollHeight;
}

function mostrarBotoesEnviar() {
  input.disabled = true;

  const container = document.createElement("div");
  container.classList.add("botoes");

  const botaoSim = document.createElement("button");
  botaoSim.classList.add("botao");
  botaoSim.textContent = "Sim";
  botaoSim.onclick = () => {
    adicionarMensagem("Sim", "usuario");
    enviarFeedbackParaBackend();  // Envia o feedback para o backend
    container.remove();
    input.disabled = false;
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

document.getElementById("inputMensagem").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const input = document.getElementById("inputMensagem");
    const mensagem = input.value.trim();
    
    if (mensagem === "") return;

    const match = mensagem.match(/^([^:]+):\s*(.+)$/); // Ex: João: produto x é bom
    if (!match) {
      alert("Por favor, use o formato Nome: mensagem");
      return;
    }

    const nome = match[1].trim();
    const texto = match[2].trim();

    // Enviar para o backend
    fetch("http://localhost:5000/processar-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: nome,
        texto: texto,
        datetime: new Date().toISOString()
      })
    })


    .then(res => res.json())
    .then(data => {
      console.log("Enviado com sucesso:", data);
    })
    .catch(err => console.error("Erro ao enviar:", err));

    input.value = "";
  }
});