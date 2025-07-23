const container = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("pokemonModal");
const modalContent = document.getElementById("modalContent");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");

let pokemonData = [];
let currentPage = 1;
const itemsPerPage = 20;
let filteredData = [];

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  filteredData = pokemonData.filter(p =>
    p.name.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderPage();
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

nextPageBtn.addEventListener("click", () => {
  const maxPage = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    renderPage();
  }
});

function fetchPokemon() {
  const limit = 160;
  for (let i = 1; i <= limit; i++) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
      .then(res => res.json())
      .then(data => {
        pokemonData.push(data);
        filteredData = pokemonData; // default = all
        renderPage();
      });
  }
}

function renderPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = filteredData.slice(start, end);
  displayPokemon(paginatedData);
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function displayPokemon(pokemonList) {
  container.innerHTML = "";
  pokemonList.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name.toUpperCase()}</h3>
   
       <div>
  ${pokemon.types.map(t =>
    `<span class="type-badge" style="background-color:${getTypeColor(t.type.name)}">
      ${t.type.name}
    </span>`
  ).join("")}
</div>
    `;
    card.addEventListener("click", () => showModal(pokemon));
    container.appendChild(card);
  });
}
function getTypeColor(type) {
  const colors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  };
  return colors[type] || '#777'; // fallback abu-abu
}

// Badge,Abilies,Statistik
function showModal(pokemon) {
  modalContent.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.sprites.other["official-artwork"].front_default}" width="150">
 <div>
  ${pokemon.types.map(t =>
    `<span class="type-badge" style="background-color:${getTypeColor(t.type.name)}">
      ${t.type.name}
    </span>`
  ).join("")}
</div>


<div class="info-row">
  <div class="info-label1">Abilities</div>
  <div class="info-content">
    ${pokemon.abilities.map(a =>
      `<span class="ability-badge">${a.ability.name}</span>`
    ).join("")}
  </div>
</div>



    <div class="stats-frame">
    <span class="info-label">Statistik</span> 
      ${pokemon.stats.map(stat => `
        <div class="stat-bar">
          <span>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</span>
          <div class="bar" style="width:${Math.min(stat.base_stat, 100)}%"></div>
        </div>
      `).join("")}
    </div>
  `;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

fetchPokemon();
