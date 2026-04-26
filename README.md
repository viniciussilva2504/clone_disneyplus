<div align="center">
  <img src="https://clone-disneyplus-mu-two.vercel.app/dist/images/images/disneyplus.svg"
       alt="Logo Disney+" width="200" />

  <h1>Clone Disney+</h1>

  <p>Recriação fiel da landing page do Disney+ com análise de estilo,
  responsividade garantida e pipeline de build automatizado.</p>

  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
    <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"/>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
    <img src="https://img.shields.io/badge/Gulp-CF4647?style=for-the-badge&logo=gulp&logoColor=white" alt="Gulp"/>
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  </p>

  <a href="https://clone-disneyplus-mu-two.vercel.app">
    🚀 Ver Demo ao Vivo
  </a>
</div>

---

## 📸 Screenshots

| Desktop | Mobile |
|---|---|
| ![Hero Desktop](docs/screenshots/desktop_hero.png) | ![Hero Mobile](docs/screenshots/mobile_hero.png) |
| ![Planos Desktop](docs/screenshots/desktop_planos.png) | ![Planos Mobile](docs/screenshots/mobile_planos.png) |

> Gera screenshots automaticamente com `npm run screenshot`

---

## ✨ Funcionalidades

- ✅ Recriação fiel da landing page oficial do Disney+
- ✅ Layout totalmente responsivo (mobile-first)
- ✅ Carrosséis de conteúdo ("Em Breve", "Mais Populares", "Star+")
- ✅ Secção de planos e preços
- ✅ Lista de dispositivos compatíveis
- ✅ FAQ interativo
- ✅ Pipeline de build automatizado com Gulp 4
- ✅ Optimização de imagens automática
- ✅ Deployado no Vercel com CI/CD

---

## 🛠️ Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| HTML5 | — | Estrutura semântica |
| SCSS | 1.x | Estilização com variáveis e mixins |
| JavaScript | ES6+ | Interactividade |
| Gulp | 4.x | Build tool e automação |
| gulp-sass | 5.x | Compilação SCSS → CSS |
| gulp-autoprefixer | 8.x | Prefixos CSS cross-browser |
| gulp-clean-css | 4.x | Minificação CSS optimizada |
| gulp-sourcemaps | 3.x | Source maps para DevTools |
| gulp-imagemin | 7.x | Optimização de imagens |
| browser-sync | 2.x | Live reload em desenvolvimento |
| Vercel | — | Deploy e hosting |

---

## 📁 Estrutura do Projecto

```
clone_disneyplus/
├── src/
│   ├── scss/
│   │   ├── abstracts/       ← variáveis, mixins, funções
│   │   ├── base/            ← reset global, tipografia
│   │   ├── components/      ← header, hero, shows, plans, faq, footer...
│   │   ├── layout/          ← grid, secções de imagem-texto
│   │   └── main.scss        ← ponto de entrada (apenas @use)
│   ├── scripts/
│   │   └── main.js
│   └── images/
├── dist/                    ← gerado pelo Gulp (não editar)
├── docs/
│   └── screenshots/         ← gerado pelo script de screenshots
├── scripts/
│   └── screenshot.js        ← script automático de screenshots
├── index.html
├── gulpfile.js
├── package.json
└── README.md
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js ≥ 16.x
- npm ≥ 8.x

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/viniciussilva2504/clone_disneyplus.git
cd clone_disneyplus

# 2. Instalar dependências
npm install

# 3. Iniciar em modo desenvolvimento (com live reload)
npm run dev
```

O browser abrirá automaticamente em `http://localhost:3000`.

### Build para produção

```bash
npm run build
```

Os ficheiros compilados ficam na pasta `dist/`.

### Gerar screenshots

```bash
npm run screenshot
```

Os screenshots são guardados em `docs/screenshots/` e podem ser usados directamente neste README.

---

## 📐 Arquitectura SCSS

O projecto segue o padrão **7-1** para organização de SCSS:

```
abstracts/   ← variáveis ($color-primary, $font-primary), mixins, funções
base/        ← reset global, tipografia base, @font-face
components/  ← um ficheiro por componente (header, hero, shows, plans, faq, footer...)
layout/      ← grid e estrutura das secções de imagem-texto
main.scss    ← apenas @use e @forward, sem CSS directo
```

---

## 🎨 Decisões de Design

- **Cor de fundo:** `#040714` — idêntica ao Disney+ original
- **Cor primária:** `#0063e5` — botões e CTAs
- **Tipografia:** Avenir / Helvetica Neue (stack sem serifa moderna)
- **Breakpoints:** 480px (mobile), 768px (tablet), 1024px (desktop)

---

## 🔗 Links

- **Demo:** https://clone-disneyplus-mu-two.vercel.app
- **Portfólio:** https://github.com/viniciussilva2504

---

## ⚠️ Aviso Legal

Este projecto foi desenvolvido exclusivamente para fins educativos e de portfólio.
Todos os direitos relativos à marca Disney+ pertencem à © The Walt Disney Company.
