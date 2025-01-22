document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('[data-tab-button]');
    const questions = document.querySelectorAll('[data-faq-question]');
    const heroSection = document.querySelector('.hero');
    const alturaHero = heroSection.clientHeight;

    //função para acompanhar rolagem no eixo Y (vertical)
    window.addEventListener('scroll', function() {
        const posicaoAtual = window.scrollY;
        if (posicaoAtual < alturaHero) {
            ocultaElementosDoHeader();
        } else {
            exibeElementosDoHeader();
        }
    })

    //secção de atrações, programação das abas
    for (let i = 0; i < buttons.length; i++) { // Adicionando um evento de clique para cada botão de aba //
        buttons[i].addEventListener('click', function(botao) { 
            const abaAlvo = botao.target.dataset.tabButton; // Pegando o valor do atributo data-tab-button do botão clicado //
            const aba = document.querySelector(`[data-tab-id=${abaAlvo}]`); // Selecionando a aba que tem o atributo data-tab-id igual ao valor do atributo data-tab-button do botão clicado //
            escondeTodasAbas();
            aba.classList.add('shows__list--is-active'); // Adicionando a classe shows__list--is-active na aba selecionada //
            removeBotaoAtivo();
            botao.target.classList.add('shows__tabs__button--is-active'); 
        });
    }
    //secção faq accordion
    for (let i = 0; i < questions.length; i++) {
        questions[i].addEventListener('click', abreOuFechaResposta);
    }
})

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

    elementoPai.classList.toggle(classe);
}
// Função para remover a classe de botão ativo de todos os botões de abas e esconder todas as abas ativas//
function removeBotaoAtivo () {
    const botaoAtivo = document.querySelectorAll('[data-tab-button]');
    for (let i = 0; i < botaoAtivo.length; i++) {
        botaoAtivo[i].classList.remove('shows__tabs__button--is-active');
    }
}
// Função para esconder todas as abas ativas//
function escondeTodasAbas () {
    const tabsContainer = document.querySelectorAll('[data-tab-id]');
    for (let i = 0; i < tabsContainer.length; i++) {
        tabsContainer[i].classList.remove('shows__list--is-active');
    }
}
