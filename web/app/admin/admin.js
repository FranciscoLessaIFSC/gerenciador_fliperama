
const sidebarToggleButtons = document.querySelectorAll("[data-sidebar-toggle]");
const root = document.body;
const sidebarStateKey = "arcade-admin-sidebar-collapsed";

const applySidebarState = (collapsed) => {
	root.classList.toggle("sidebar-collapsed", collapsed);
};

const readInitialState = () => {
	if (window.innerWidth <= 900) {
		root.classList.remove("sidebar-collapsed");
		return;
	}

	const saved = window.localStorage.getItem(sidebarStateKey);
	applySidebarState(saved === "true");
};

const toggleSidebar = () => {
	if (window.innerWidth <= 900) {
		root.classList.toggle("menu-open");
		return;
	}

	const nextState = !root.classList.contains("sidebar-collapsed");
	applySidebarState(nextState);
	window.localStorage.setItem(sidebarStateKey, String(nextState));
};

readInitialState();

sidebarToggleButtons.forEach((button) => {
	button.addEventListener("click", toggleSidebar);
});

window.addEventListener("resize", () => {
	if (window.innerWidth > 900) {
		root.classList.remove("menu-open");
		readInitialState();
	}
});

/* ==========================
   MINI GRÁFICOS DOS KPIs
========================== */

document.addEventListener("DOMContentLoaded", () => {

	const dailyLabels = [
		"08h",
		"10h",
		"12h",
		"14h",
		"16h",
		"18h",
		"20h",
		"22h"
	];

	function createMiniChart(canvasId, values, color = "#7aa2ff") {

		const canvas = document.getElementById(canvasId);

		if (!canvas) return;

		new Chart(canvas, {
			type: "line",

			data: {
				labels: dailyLabels,

				datasets: [{
					data: values,

					borderColor: color,
					backgroundColor: color + "20",

					fill: true,
					tension: 0.4,

					borderWidth: 3,

					pointRadius: 0,
					pointHoverRadius: 5
				}]
			},

			options: {
				responsive: true,
				maintainAspectRatio: false,

				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: true
					}
				},

				scales: {
					x: {
						display: false
					},
					y: {
						display: false
					}
				},

				elements: {
					line: {
						capBezierPoints: true
					}
				}
			}
		});
	}

	/* Jogos Hoje */
	createMiniChart(
		"dailyGamesChart",
		[120, 210, 380, 620, 890, 1150, 1320, 1426],
		"#7aa2ff"
	);

	/* Cards Ativos */
	createMiniChart(
		"OnCardsChart",
		[730, 745, 760, 785, 810, 825, 835, 842],
		"#14b8a6"
	);

	/* Receita Diária */
	createMiniChart(
		"DailyRevenueChart",
		[450, 890, 1350, 2800, 4300, 6200, 7900, 9240],
		"#f59e0b"
	);
});
