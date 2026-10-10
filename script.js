
const searchInput = document.querySelector("#search-input");
const cards = [...document.querySelectorAll(".creation-card")];
const filterButtons = [...document.querySelectorAll(".filter")];
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");

const dialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogStatus = document.querySelector("#dialog-status");

let activeFilter = "All";

function updateCreations() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const category = card.dataset.category;
    const searchableText = card.innerText.toLowerCase();

    const matchesCategory =
      activeFilter === "All" || category === activeFilter;

    const matchesSearch = searchableText.includes(query);
    const visible = matchesCategory && matchesSearch;

    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  resultCount.textContent =
    `${visibleCount} ${visibleCount === 1 ? "creation" : "creations"}`;

  emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    updateCreations();
  });

  button.setAttribute(
    "aria-pressed",
    String(button.dataset.filter === activeFilter)
  );
});

searchInput.addEventListener("input", updateCreations);

cards.forEach((card) => {
  const button = card.querySelector(".read-button");

  button.addEventListener("click", () => {
    dialogTitle.textContent = button.dataset.title;
    dialogDescription.textContent = button.dataset.description;
    dialogStatus.textContent = button.dataset.status;

    dialog.showModal();
  });
});

function closeDialog() {
  dialog.close();
}

document.querySelector("#close-dialog")
  .addEventListener("click", closeDialog);

document.querySelector("#done-button")
  .addEventListener("click", closeDialog);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

document.querySelector("#year").textContent =
  new Date().getFullYear();

updateCreations();
