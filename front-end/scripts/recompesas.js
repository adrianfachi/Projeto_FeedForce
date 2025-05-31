
    const pontosDisponiveis = 125;
    const checkboxes = document.querySelectorAll(".item-checkbox");
    const btnResgatar = document.getElementById("btnResgatar");

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        const totalSelecionado = calcularTotalSelecionado();

        if (totalSelecionado > pontosDisponiveis) {
          alert("Você não tem pontos suficientes para esse item.");
          checkbox.checked = false;
        }
      });
    });

    function calcularTotalSelecionado() {
      let total = 0;
      checkboxes.forEach(cb => {
        if (cb.checked) {
          const pontosItem = parseInt(cb.closest("li").getAttribute("data-pontos"));
          total += pontosItem;
        }
      });
      return total;
    }

    btnResgatar.addEventListener("click", () => {
      const total = calcularTotalSelecionado();

      if (total === 0) {
        alert("Selecione pelo menos um item para resgatar.");
      } else if (total <= pontosDisponiveis) {
        alert("Prêmios resgatados com sucesso! 🎉");
      } else {
        alert("Você não pode resgatar mais pontos do que possui.");
      }
    });