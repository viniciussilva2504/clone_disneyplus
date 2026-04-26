// ─── TMDB Config ─────────────────────────────────────────────
const TMDB_KEY = document.body.dataset.tmdbKey;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w300';

const TMDB_ENDPOINTS = {
  em_breve: `${TMDB_BASE}/movie/upcoming?language=pt-BR&region=BR&page=1`,
  populares: `${TMDB_BASE}/movie/popular?language=pt-BR&region=BR&page=1`,
  star_plus: `${TMDB_BASE}/trending/all/week?language=pt-BR`,
};

// ─── TMDB Fetch ───────────────────────────────────────────────
async function fetchShows(tabId) {
  const list = document.querySelector(`[data-tab-id="${tabId}"]`);
  if (!list) return;

  if (!TMDB_KEY || TMDB_KEY === 'YOUR_TMDB_API_KEY_HERE') {
    renderError(list, 'Adiciona a tua chave TMDB em <code>data-tmdb-key</code> no index.html');
    return;
  }

  renderSkeletons(list);

  try {
    const url = `${TMDB_ENDPOINTS[tabId]}&api_key=${TMDB_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    const data = await res.json();
    renderPosters(list, data.results.slice(0, 6));
  } catch (err) {
    renderError(list, 'Não foi possível carregar os títulos. Tente novamente mais tarde.');
    console.warn('[TMDB]', err.message);
  }
}

function renderSkeletons(list) {
  list.innerHTML = Array.from({ length: 6 })
    .map(() => '<li class="shows__list__item shows__list__item--skeleton" aria-hidden="true"></li>')
    .join('');
}

function renderPosters(list, results) {
  const items = results
    .filter((item) => item.poster_path)
    .map((item) => {
      const title = item.title || item.name || 'Título desconhecido';
      const posterUrl = `${TMDB_IMG}${item.poster_path}`;
      return `<li class="shows__list__item">
        <img src="${posterUrl}" alt="${title}" loading="lazy" />
      </li>`;
    });

  list.innerHTML = items.length
    ? items.join('')
    : '<li class="shows__list__item--error">Sem resultados disponíveis.</li>';
}

function renderError(list, msg) {
  list.innerHTML = `<li class="shows__list__item--error">${msg}</li>`;
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('[data-tab-button]');
  const questions = document.querySelectorAll('[data-faq-question]');
  const heroSection = document.querySelector('.hero');
  const alturaHero = heroSection.clientHeight;

  // Load all three tabs on startup (parallel)
  fetchShows('em_breve');
  fetchShows('populares');
  fetchShows('star_plus');

  //função para acompanhar rolagem no eixo Y (vertical)
  window.addEventListener('scroll', function () {
    const posicaoAtual = window.scrollY;
    if (posicaoAtual < alturaHero) {
      ocultaElementosDoHeader();
    } else {
      exibeElementosDoHeader();
    }
  });

  //secção de atrações, programação das abas
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (botao) {
      const abaAlvo = botao.target.dataset.tabButton;
      const aba = document.querySelector(`[data-tab-id=${abaAlvo}]`);
      escondeTodasAbas();
      aba.classList.add('shows__list--is-active');
      removeBotaoAtivo();
      botao.target.classList.add('shows__tabs__button--is-active');
    });
    buttons[i].addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        buttons[i].click();
      }
    });
  }
  //secção faq accordion
  for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener('click', abreOuFechaResposta);
    questions[i].addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        questions[i].click();
      }
    });
  }
});

function ocultaElementosDoHeader() {
  const header = document.querySelector('header');
  header.classList.add('header--is-hidden');
}

function exibeElementosDoHeader() {
  const header = document.querySelector('header');
  header.classList.remove('header--is-hidden');
}

function abreOuFechaResposta(elemento) {
  const classe = 'faq__questions__item--is-open';
  const elementoPai = elemento.target.parentNode;
  const isOpen = elementoPai.classList.toggle(classe);
  elemento.target.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
// Função para remover a classe de botão ativo de todos os botões de abas e esconder todas as abas ativas//
function removeBotaoAtivo() {
  const botaoAtivo = document.querySelectorAll('[data-tab-button]');
  for (let i = 0; i < botaoAtivo.length; i++) {
    botaoAtivo[i].classList.remove('shows__tabs__button--is-active');
  }
}
// Função para esconder todas as abas ativas//
function escondeTodasAbas() {
  const tabsContainer = document.querySelectorAll('[data-tab-id]');
  for (let i = 0; i < tabsContainer.length; i++) {
    tabsContainer[i].classList.remove('shows__list--is-active');
  }
}

