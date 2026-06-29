// ============================================================================
// 1. STATO DELL'APPLICAZIONE (Data State)
// ============================================================================
const state = {
  currentTab: 'explore',
  isDark: false,
  city: '',
  radius: 15,
  hasSearched: false,
  books: [
    { id: 1, title: "Dune", author: "Frank Herbert", publisher: "Fanucci", year: 2020, shares: ["mario_rossi", "luca_verdi"], reads: ["anna_neri"] },
    { id: 2, title: "Neuromante", author: "William Gibson", publisher: "Mondadori", year: 2017, shares: ["giulia_bianchi"], reads: ["mario_rossi", "davide_gialli"] },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", publisher: "Bompiani", year: 2014, shares: ["sofia_viola"], reads: [] }
  ],
  libraries: [
    { name: "Salotto Principale", location: "Milano Centro", isPublic: true },
    { name: "Studio / Ufficio", location: "Milano Navigli", isPublic: false }
  ]
};

// Elementi del DOM stabili
const mainContent = document.getElementById('main-content');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const navItems = document.querySelectorAll('.nav-item');

// ============================================================================
// 2. LOGICA DEI TEMI ED EVENTI GLOBALI
// ============================================================================
themeToggle.addEventListener('click', () => {
  state.isDark = !state.isDark;
  document.body.classList.toggle('dark', state.isDark);
  themeIcon.textContent = state.isDark ? 'light_mode' : 'dark_mode';
});

// Gestione dei click sulla Bottom Navigation
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    // Aggiorna l'aspetto grafico dei bottoni di navigazione
    navItems.forEach(nav => nav.classList.remove('active'));
    const clickedBtn = e.currentTarget;
    clickedBtn.classList.add('active');
    
    // Cambia la vista nello stato e renderizza
    state.currentTab = clickedBtn.getAttribute('data-tab');
    render();
  });
});

// ============================================================================
// 3. MOTORE DI RENDERING (Aggiorna lo schermo in base allo stato)
// ============================================================================
function render() {
  mainContent.innerHTML = ''; // Svuota lo schermo

  if (state.currentTab === 'explore') {
    renderExploreView();
  } else if (state.currentTab === 'libraries') {
    renderLibrariesView();
  } else if (state.currentTab === 'profile') {
    renderProfileView();
  }
}

// ============================================================================
// 4. VISTE DETTAGLIATE (VIEW CONTROLLERS)
// ============================================================================

// --- VISTA ESPLORA ---
function renderExploreView() {
  let searchHtml = `
    <div class="md-card">
      <div class="md-title" style="font-size: 1.1rem; margin-bottom: 12px;">Cerca Libri Vicini</div>
      
      <div class="search-group">
        <button id="gps-btn" class="icon-btn" style="color: var(--primary);"><i class="material-icons">my_location</i></button>
        <input type="text" id="city-input" placeholder="Dove cerchi?" value="${state.city}">
      </div>

      <div class="slider-container">
        <div class="slider-label">
          <span>Raggio di ricerca</span>
          <span id="radius-val" style="font-weight: bold; color: var(--primary);">${state.radius} km</span>
        </div>
        <input type="range" id="radius-slider" class="md-slider" min="1" max="50" value="${state.radius}">
      </div>

      <button id="search-submit" class="md-btn">
        <i class="material-icons">search</i> Cerca Libri
      </button>
    </div>
  `;

  // Se l'utente ha premuto cerca, mostriamo le statistiche e i libri
  if (state.hasSearched) {
    searchHtml += `
      <div class="stats-row">
        <span class="badge"><i class="material-icons" style="font-size:1rem;">book</i> ${state.books.length} Libri</span>
        <span class="badge"><i class="material-icons" style="font-size:1rem;">people</i> 4 Condivisori</span>
      </div>
    `;

    state.books.forEach(book => {
      searchHtml += `
        <div class="md-card">
          <div class="md-title">${book.title}</div>
          <div class="md-subtitle">di ${book.author} &bull; ${book.publisher}</div>
          
          <button class="accordion-header" onclick="toggleAccordion('share-${book.id}')">
            <span>Condiviso da (${book.shares.length})</span>
            <i class="material-icons">expand_more</i>
          </button>
          <div id="share-${book.id}" class="accordion-content" style="display:none;">
            ${book.shares.map(user => `
              <div class="user-row">
                <span>@${user}</span>
                <button class="icon-btn" style="color: var(--primary);" onclick="alert('Messaggio inviato a ${user}')"><i class="material-icons" style="font-size:1.2rem;">send</i></button>
              </div>
            `).join('')}
          </div>

          <button class="accordion-header" onclick="toggleAccordion('read-${book.id}')">
            <span>Letto da (${book.reads.length})</span>
            <i class="material-icons">expand_more</i>
          </button>
          <div id="read-${book.id}" class="accordion-content" style="display:none;">
            ${book.reads.length ? book.reads.map(user => `<div>&bull; @${user}</div>`).join('') : 'Nessuno lo ha ancora letto'}
          </div>
        </div>
      `;
    });
  }

  mainContent.innerHTML = searchHtml;

  // Riconnessione dinamica degli eventi della form
  document.getElementById('radius-slider').addEventListener('input', (e) => {
    state.radius = e.target.value;
    document.getElementById('radius-val').textContent = state.radius + ' km';
  });

  document.getElementById('city-input').addEventListener('input', (e) => {
    state.city = e.target.value;
  });

  document.getElementById('gps-btn').addEventListener('click', () => {
    state.city = "Coordinate GPS Attuali";
    document.getElementById('city-input').value = state.city;
  });

  document.getElementById('search-submit').addEventListener('click', () => {
    if(!state.city) { alert('Inserisci una città!'); return; }
    state.hasSearched = true;
    render();
  });
}

// --- VISTA LIBRERIE ---
function renderLibrariesView() {
  let libHtml = '<h2 style="margin-bottom:16px;">Le tue Librerie</h2>';
  state.libraries.forEach((lib, index) => {
    libHtml += `
      <div class="md-card" onclick="toggleAccordion('lib-details-${index}')" style="cursor:pointer;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div class="md-title" style="font-size:1.1rem;">${lib.name}</div>
            <div class="md-subtitle" style="margin-bottom:0;"><i class="material-icons" style="font-size:0.9rem; vertical-align:middle;">place</i> ${lib.location}</div>
          </div>
          <span class="badge">${lib.isPublic ? 'Pubblica' : 'Privata'}</span>
        </div>
        <div id="lib-details-${index}" class="accordion-content" style="display:none; margin-top:12px; border-top:1px solid var(--border); pt:8px;">
           <p style="font-size:0.85rem;">Questa libreria contiene le tue copie fisiche. Puoi aggiungere nuovi libri tramite le API del server backend.</p>
        </div>
      </div>
    `;
  });
  mainContent.innerHTML = libHtml;
}

// --- VISTA PROFILO ---
function renderProfileView() {
  mainContent.innerHTML = `
    <h2 style="margin-bottom:16px;">Il mio Profilo</h2>
    <div class="md-card">
      <label style="font-size:0.8rem; font-weight:bold; color:var(--primary);">Nickname</label>
      <input type="text" class="md-input" value="mario_developer">
      
      <label style="font-size:0.8rem; font-weight:bold; color:var(--primary);">Email</label>
      <input type="email" class="md-input" value="mario@email.it">
      
      <button class="md-btn" style="margin-top:12px;" onclick="alert('Profilo Salvato Locale!')">Salva Dati</button>
    </div>
  `;
}

// Funzione globale helper per aprire/chiudere gli accordion
window.toggleAccordion = function(id) {
  const el = document.getElementById(id);
  if (el.style.display === 'none') {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
};

// Primo avvio dell'applicazione
render();