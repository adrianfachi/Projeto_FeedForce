const perguntasContainer = document.getElementById("perguntas-container");
const btnAdicionarPergunta = document.getElementById("adicionarPergunta");
const btnGerarSurvey = document.getElementById("gerarSurvey");
const linkSurvey = document.getElementById("linkSurvey");
const surveyLink = document.getElementById("surveyLink");

let numeroPergunta = 0;

btnAdicionarPergunta.addEventListener("click", () => {
  numeroPergunta++;

  const div = document.createElement("div");
  div.classList.add("pergunta-box");
  div.setAttribute("data-index", numeroPergunta);

  div.innerHTML = `
    <h3>Pergunta ${numeroPergunta}</h3>

    <label>Tipo de pergunta:</label>
    <select class="tipo">
      <option value="aberta">Resposta aberta</option>
      <option value="fechada">Múltipla escolha</option>
    </select>

    <label>Texto da pergunta:</label>
    <input type="text" class="texto-pergunta" placeholder="Digite sua pergunta" />

    <div class="alternativas-container" style="display:none;">
      <label>Alternativas:</label>
      <div class="alternativas"></div>
      <button type="button" class="adicionar-alternativa">+ Adicionar alternativa</button>
    </div>
  `;

  perguntasContainer.appendChild(div);

  const tipoSelect = div.querySelector(".tipo");
  const alternativasContainer = div.querySelector(".alternativas-container");
  const alternativasBox = div.querySelector(".alternativas");
  const btnAdicionarAlt = div.querySelector(".adicionar-alternativa");

  tipoSelect.addEventListener("change", () => {
    if (tipoSelect.value === "fechada") {
      alternativasContainer.style.display = "block";
    } else {
      alternativasContainer.style.display = "none";
      alternativasBox.innerHTML = "";
    }
  });

    btnAdicionarAlt.addEventListener("click", () => {
  const container = document.createElement("div");
  container.classList.add("linha-alternativa");

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Alternativa");

  const botao = document.createElement("button");
  botao.innerHTML = "🗑️";
  botao.type = "button";
  botao.classList.add("btn-remover");

  botao.addEventListener("click", () => {
    container.remove();
  });

  container.appendChild(input);
  container.appendChild(botao);
  alternativasBox.appendChild(container);
});


});

// Gerar survey
btnGerarSurvey.addEventListener("click", () => {
  const perguntas = [];

  const caixas = document.querySelectorAll(".pergunta-box");

  for (let caixa of caixas) {
    const tipo = caixa.querySelector(".tipo").value;
    const texto = caixa.querySelector(".texto-pergunta").value.trim();

    if (!texto) {
      alert("Preencha o texto de todas as perguntas.");
      return;
    }

    const pergunta = { tipo, texto, alternativas: [] };

    if (tipo === "fechada") {
      const alts = caixa.querySelectorAll(".alternativas input[type='text']");
      alts.forEach(input => {
        if (input.value.trim()) {
          pergunta.alternativas.push(input.value.trim());
        }
      });

      if (pergunta.alternativas.length < 2) {
        alert("Cada pergunta fechada precisa de pelo menos duas alternativas.");
        return;
      }
    }

    perguntas.push(pergunta);
  }

  localStorage.setItem("surveyCriada", JSON.stringify(perguntas));
  surveyLink.textContent = "Clique aqui para compartilhar";
  surveyLink.href = "responderSurvey.html";
  linkSurvey.style.display = "block";
});
