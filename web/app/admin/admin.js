
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
   GRÁFICO DE JOGOS DIÁRIOS
========================== */

document.addEventListener("DOMContentLoaded", () => {

	const canvas = document.getElementById("dailyGamesChart");

	if (!canvas) return;

	new Chart(canvas, {
		type: "line",

		data: {
			labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],

			datasets: [{
				data: [1180, 1240, 1320, 1275, 1426, 1680, 1540],

				borderColor: "#7aa2ff",
				backgroundColor: "rgba(122,162,255,0.15)",

				fill: true,
				tension: 0.4,

				borderWidth: 3,

				pointRadius: 0
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
			}
		}
	});
});

document.addEventListener("DOMContentLoaded", () => {

	const canvas = document.getElementById("OnCardsChart");

	if (!canvas) return;

	new Chart(canvas, {
		type: "line",

		data: {
			labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],

			datasets: [{
				data: [760, 750,700, 790, 842, 900, 893],

				borderColor: "#7aa2ff",
				backgroundColor: "rgba(122,162,255,0.15)",

				fill: true,
				tension: 0.4,

				borderWidth: 3,

				pointRadius: 0
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
			}
		}
	});
});

document.addEventListener("DOMContentLoaded", () => {

	const canvas = document.getElementById("DailyRevenueChart");

	if (!canvas) return;

	new Chart(canvas, {
		type: "line",

		data: {
			labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],

			datasets: [{
				data: [790, 890, 999, 980, 1950, 2150, 2000],

				borderColor: "#7aa2ff",
				backgroundColor: "rgba(122,162,255,0.15)",

				fill: true,
				tension: 0.4,

				borderWidth: 3,

				pointRadius: 0
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
			}
		}
	});
});

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("dailyMachines");

    if (!canvas) return;

    new Chart(canvas, {
        type: "bar",

        data: {
            labels: ["Space Raiders", "Turbo Kart", "Neon Fighter"],

            datasets: [{
                label: "Jogos",
                data: [400, 890, 999],
                backgroundColor: ["#7aa2ff", "#00d4aa", "#ff7eb3"],

                borderColor: ["#9bb8ff", "#33e6c0", "#ff9dc8"],
                borderRadius: 12,
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
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#94a3b8",
                        font: {
                            weight: "600"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(255,255,255,0.05)"
                    },
                    ticks: {
                        color: "#64748b"
                    }
                }
            }
        }
    });
});




