const chat = document.getElementById("chat");
const input = document.getElementById("inputMensagem");
const listaSugestoes = document.getElementById("sugestoes");

const SUPABASE_URL = "https://dpmyuojkrmgnwfyieqig.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbXl1b2prcm1nbndmeWllcWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjQ0NzgsImV4cCI6MjA2NDI0MDQ3OH0.NnNTpy36xLrBzHlLPmm8ACOzNXfZ3pAOtM8hdOa5Q3A"
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let etapa = 0;
let nome = '';
let mensagem = '';
let anonimo = false;

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

adicionarMensagem("Para quem você quer enviar?");

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

  botaoSim.onclick = async () => {
    adicionarMensagem("Sim", "usuario");

    const idUsuario = await buscarIdUsuarioPorNome(nome);

    if (!idUsuario) {
      adicionarMensagem("Erro: usuário não encontrado.");
      container.remove();
      input.disabled = false;
      return;
    }

    const feedbackData = {
      feedback: mensagem,
      template: "padrão",
      score: 1,
      id_users: idUsuario,
      id_evaluator: anonimo ? null : "evaluator_id", // ajuste conforme seu app
    };

    // Aqui você chama a função inteligente que distribui entre as tabelas
    await enviarFeedbackInteligente(feedbackData);

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



async function buscarIdUsuarioPorNome(nome) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .ilike("user_name", nome)
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }

  return data.id;
}

async function enviarFeedbackInteligente(feedbackData) {
  const tabelas = ["feedback1", "feedback2", "feedback3", "feedback4", "feedback5"];
  
  for (let i = 0; i < tabelas.length; i++) {
    const tabela = tabelas[i];

    // Verifica se a tabela está vazia
    const { data: registros, error: erroBusca } = await supabase
      .from(tabela)
      .select("*")
      .limit(1);

    if (erroBusca) {
      console.error(`Erro ao verificar a tabela ${tabela}:`, erroBusca.message);
      continue;
    }

    // Se tabela estiver vazia, insere o feedback nela
    if (registros.length === 0) {
      const { error: erroInsert } = await supabase
        .from(tabela)
        .insert([feedbackData]);

      if (erroInsert) {
        adicionarMensagem("Erro ao enviar feedback: " + erroInsert.message);
      } else {
        adicionarMensagem(`Feedback enviado para a tabela ${tabela}!`);
      }
      return;
    }
  }

  // Se todas estiverem preenchidas, substitui o da feedback5 (deleta e insere)
  const { data: registro5, error: erro5 } = await supabase
    .from("feedback5")
    .select("id") // ou o nome da chave primária correta
    .limit(1);

  if (erro5 || !registro5 || registro5.length === 0) {
    adicionarMensagem("Erro ao acessar feedback5 para sobrescrever.");
    return;
  }

  const idRegistro = registro5[0].id;

  const { error: erroDelete } = await supabase
    .from("feedback5")
    .delete()
    .eq("id", idRegistro);

  if (erroDelete) {
    adicionarMensagem("Erro ao apagar registro da feedback5: " + erroDelete.message);
    return;
  }

  const { error: erroInsertFinal } = await supabase
    .from("feedback5")
    .insert([feedbackData]);

  if (erroInsertFinal) {
    adicionarMensagem("Erro ao inserir novo feedback na feedback5: " + erroInsertFinal.message);
  } else {
    adicionarMensagem("Feedback sobrescreveu o mais antigo em feedback5!");
  }
}




