const cardAccessForm = document.getElementById("cardAccessForm");

if (cardAccessForm) {
	cardAccessForm.addEventListener("submit", (event) => {
		event.preventDefault(); // Impede o envio padrão do HTML

		// Busca o input pelo tipo text/search ou o primeiro disponível
		const uidInput = cardAccessForm.querySelector("input[type='text']") || cardAccessForm.querySelector("input");
		
		if (!uidInput) {
			console.error("Input não encontrado dentro do #cardAccessForm");
			return;
		}

		const uidValue = uidInput.value.trim();

		if (!uidValue) {
			alert("Por favor, digite ou aproxime o cartão.");
			return;
		}

		// Cria o parâmetro formatado
		const queryParam = `?uid=${encodeURIComponent(uidValue)}`;

		// Tratamento para abertura de arquivo local (Double-click no HTML)
		if (window.location.protocol === "file:") {
			window.location.href = "app/dashboard/index.html" + queryParam;
			return;
		}

		window.location.href = "/app/dashboard/" + queryParam;
	});
}
