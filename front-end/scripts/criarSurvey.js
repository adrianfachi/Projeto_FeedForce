const perguntasContainer = document.getElementById("perguntas-container");
const btnAdicionarPergunta = document.getElementById("adicionarPergunta");
const btnGerarSurvey = document.getElementById("gerarSurvey");
const linkSurvey = document.getElementById("linkSurvey");
const surveyLink = document.getElementById("surveyLink");
const btnCopiar = document.getElementById("copiarLink");

let numeroPergunta = 0;

btnAdicionarPergunta.addEventListener("click", () => {
  numeroPergunta++;

  const div = document.createElement("div");
  div.classList.add("pergunta-box");
  div.setAttribute("data-index", numeroPergunta);

  div.innerHTML = `
    <h3>Pergunta ${numeroPergunta}</h3>

    <label>Texto da pergunta:</label>
    <input type="text" class="texto-pergunta" placeholder="Digite sua pergunta" />
  `;

  perguntasContainer.appendChild(div);
});

btnGerarSurvey.addEventListener("click", () => {
  const perguntas = [];
  const caixas = document.querySelectorAll(".pergunta-box");

  for (let caixa of caixas) {
    const texto = caixa.querySelector(".texto-pergunta").value.trim();

    if (!texto) {
      alert("Preencha o texto de todas as perguntas.");
      return;
    }

    const pergunta = { texto };

    perguntas.push(pergunta);
  }

  localStorage.setItem("surveyCriada", JSON.stringify(perguntas));

  // Gerar link simulado
  const link = "https://meusurveys.com/s/mRYWn1Fl";
  surveyLink.textContent = link;
  surveyLink.href = link;
  linkSurvey.style.display = "block";
});

btnCopiar.addEventListener("click", () => {
  const texto = surveyLink.textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert("Link copiado para a área de transferência!");
  });
});
