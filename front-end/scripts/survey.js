const perguntas = JSON.parse(localStorage.getItem("surveyCriada")) || [];
const form = document.getElementById("formRespostas");

perguntas.forEach((p, i) => {
  const div = document.createElement("div");
  div.className = "pergunta";

  const label = document.createElement("label");
  label.textContent = p.texto;
  div.appendChild(label);

  if (p.tipo === "aberta") {
    const input = document.createElement("input");
    input.type = "text";
    input.name = `pergunta_${i}`;
    div.appendChild(input);
  } else if (p.tipo === "fechada") {
    p.alternativas.forEach(alt => {
      const op = document.createElement("label");
      op.classList.add("alternativa");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `pergunta_${i}`;
      radio.value = alt;

      op.appendChild(radio);
      op.append(" " + alt);
      div.appendChild(op);
    });
  }

  form.appendChild(div);
});

document.getElementById("enviarRespostas").addEventListener("click", () => {
  alert("Respostas enviadas com sucesso! (Simulado)");
});
