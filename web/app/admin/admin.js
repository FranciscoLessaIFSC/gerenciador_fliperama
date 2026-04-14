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
