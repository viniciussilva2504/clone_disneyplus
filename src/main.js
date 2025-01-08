// Importando o arquivo de estilos principal do projeto //
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('[data-tab-button]');
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
});
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
