const cardAccessForm = document.getElementById("cardAccessForm");

if (cardAccessForm) {
	cardAccessForm.addEventListener("submit", (event) => {
		event.preventDefault();

		if (window.location.protocol === "file:") {
			window.location.href = "app/dashboard/index.html";
			return;
		}

		window.location.href = "/app/dashboard";
	});
}
