// ======================================================
// PORTAL DE IMÓVEIS - Z3 COMMERCE
// Arquivo: imoveis.js
// Parte 1
// ======================================================



// ======================================================
// CONFIGURAÇÕES
// ======================================================

const API = "https://jetimob-api-1.onrender.com/api/imoveis";

const WHATSAPP = "5554997010512";

const LIMITE_INICIAL = 12;



// ======================================================
// ELEMENTOS HTML
// ======================================================

const lista = document.getElementById("lista-imoveis");

const contador = document.getElementById("contador");

const pesquisa = document.getElementById("pesquisa");

const filtroTipo = document.getElementById("tipo");

const filtroCidade = document.getElementById("cidade");

const filtroDormitorios = document.getElementById("dormitorios");

const ordenacao = document.getElementById("ordenacao");



// ======================================================
// DADOS
// ======================================================

let todosImoveis = [];

let listaFiltrada = [];

let quantidadeExibida = LIMITE_INICIAL;



// ======================================================
// INICIAR
// ======================================================

window.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

    mostrarLoading();

    await carregarImoveis();

    popularTipos();

    popularCidades();

    aplicarFiltros();

}



// ======================================================
// API
// ======================================================

async function carregarImoveis() {

    try {

        const response = await fetch(API);

        if (!response.ok) {

            throw new Error("Erro ao carregar API");

        }

        const dados = await response.json();

        todosImoveis = Array.isArray(dados) ? dados : [];

    }

    catch (erro) {

        console.error(erro);

        mostrarErro();

    }

}



// ======================================================
// LOADING
// ======================================================

function mostrarLoading() {

    contador.innerHTML = "Carregando imóveis...";

    lista.innerHTML = "";

}



// ======================================================
// ERRO
// ======================================================

function mostrarErro() {

    contador.innerHTML = "Erro ao carregar imóveis.";

    lista.innerHTML = `
        <div class="sem-imoveis">

            <h2>Não foi possível carregar os imóveis.</h2>

            <p>Tente novamente em alguns instantes.</p>

        </div>
    `;

}



// ======================================================
// POPULAR TIPOS
// ======================================================

function popularTipos() {

    if (!filtroTipo) return;

    filtroTipo.innerHTML = `
        <option value="">Todos os tipos</option>
    `;

    const tipos = [

        ...new Set(

            todosImoveis

                .map(i => i.tipo)

                .filter(Boolean)

        )

    ].sort();

    tipos.forEach(tipo => {

        filtroTipo.innerHTML += `
            <option value="${tipo}">
                ${tipo}
            </option>
        `;

    });

}



// ======================================================
// POPULAR CIDADES
// ======================================================

function popularCidades() {

    if (!filtroCidade) return;

    filtroCidade.innerHTML = `
        <option value="">Todas as cidades</option>
    `;

    const cidades = [

        ...new Set(

            todosImoveis

                .map(i => i.cidade)

                .filter(Boolean)

        )

    ].sort();

    cidades.forEach(cidade => {

        filtroCidade.innerHTML += `
            <option value="${cidade}">
                ${cidade}
            </option>
        `;

    });

}

// ======================================================
// RENDER
// ======================================================

function render() {

    lista.innerHTML = "";

    contador.innerHTML =
        `Mostrando ${Math.min(quantidadeExibida, listaFiltrada.length)} de ${listaFiltrada.length} imóveis`;

    if (listaFiltrada.length === 0) {

        lista.innerHTML = `

            <div class="sem-imoveis">

                <h2>Nenhum imóvel encontrado</h2>

                <p>Tente alterar os filtros de pesquisa.</p>

            </div>

        `;

        return;

    }

    listaFiltrada
        .slice(0, quantidadeExibida)
        .forEach(imovel => {

            lista.innerHTML += criarCard(imovel);

        });

    renderBotaoCarregarMais();

}



// ======================================================
// BOTÃO CARREGAR MAIS
// ======================================================

function renderBotaoCarregarMais() {

    if (quantidadeExibida >= listaFiltrada.length) return;

    lista.innerHTML += `

        <div class="carregar-mais">

            <button id="btnCarregarMais">

                Carregar mais imóveis

            </button>

        </div>

    `;

    document
        .getElementById("btnCarregarMais")
        .addEventListener("click", () => {

            quantidadeExibida += LIMITE_INICIAL;

            render();

        });

}



// ======================================================
// CARD
// ======================================================

function criarCard(imovel) {

    const imagem = obterImagem(imovel);

    const titulo =

        imovel.titulo ||

        imovel.nome ||

        "Imóvel";

    const cidade =

        imovel.cidade ||

        "";

    const bairro =

        imovel.bairro ||

        "";

    const dormitorios =

        imovel.dormitorios ||

        imovel.quartos ||

        0;

    const banheiros =

        imovel.banheiros ||

        0;

    const vagas =

        imovel.vagas ||

        imovel.garagens ||

        0;

    const area =

        imovel.area ||

        0;

    const valor = formatarValor(

        imovel.valor ||

        0

    );

    return `

<div class="card-imovel">

    <div class="imagem">

        <img

            src="${imagem}"

            loading="lazy"

            alt="${titulo}"

            onerror="this.src='https://placehold.co/800x600?text=Sem+Imagem'">

    </div>

    <div class="conteudo">

        <h3>

            ${titulo}

        </h3>

        <p class="endereco">

            ${bairro} ${cidade ? "- " + cidade : ""}

        </p>

        <div class="informacoes">

            <span>🛏 ${dormitorios}</span>

            <span>🚿 ${banheiros}</span>

            <span>🚗 ${vagas}</span>

            <span>📐 ${area} m²</span>

        </div>

        <div class="preco">

            ${valor}

        </div>

        <a

            class="botao-whatsapp"

            target="_blank"

            href="${linkWhatsApp(imovel)}">

            Tenho interesse

        </a>

    </div>

</div>

`;

}



// ======================================================
// UTILS
// ======================================================

function obterImagem(imovel) {

    return (

        imovel.imagem ||

        imovel.foto ||

        imovel.thumbnail ||

        "https://placehold.co/800x600?text=Sem+Imagem"

    );

}



function formatarValor(valor) {

    return Number(valor).toLocaleString(

        "pt-BR",

        {

            style: "currency",

            currency: "BRL"

        }

    );

}



function linkWhatsApp(imovel) {

    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(

`Olá! Tenho interesse no imóvel ${imovel.codigo || ""} ${imovel.titulo || ""}.`

    )}`;

}
// ======================================================
// FILTROS
// ======================================================

function aplicarFiltros() {

    quantidadeExibida = LIMITE_INICIAL;

    let resultado = [...todosImoveis];



    // ======================================
    // PESQUISA
    // ======================================

    if (pesquisa && pesquisa.value.trim() !== "") {

        const texto = pesquisa.value
            .trim()
            .toLowerCase();

        resultado = resultado.filter(imovel => {

            return [

                imovel.codigo,

                imovel.titulo,

                imovel.nome,

                imovel.tipo,

                imovel.cidade,

                imovel.bairro,

                imovel.referencia

            ]

            .filter(Boolean)

            .some(campo =>

                String(campo)

                    .toLowerCase()

                    .includes(texto)

            );

        });

    }



    // ======================================
    // TIPO
    // ======================================

    if (

        filtroTipo &&

        filtroTipo.value !== ""

    ) {

        resultado = resultado.filter(imovel =>

            imovel.tipo === filtroTipo.value

        );

    }



    // ======================================
    // CIDADE
    // ======================================

    if (

        filtroCidade &&

        filtroCidade.value !== ""

    ) {

        resultado = resultado.filter(imovel =>

            imovel.cidade === filtroCidade.value

        );

    }



    // ======================================
    // DORMITÓRIOS
    // ======================================

    if (

        filtroDormitorios &&

        filtroDormitorios.value !== ""

    ) {

        resultado = resultado.filter(imovel => {

            const quartos = Number(

                imovel.dormitorios ||

                imovel.quartos ||

                0

            );

            return quartos >= Number(

                filtroDormitorios.value

            );

        });

    }



    // ======================================
    // ORDENAÇÃO
    // ======================================

    if (ordenacao) {

        switch (ordenacao.value) {

            case "menor":

                resultado.sort(

                    (a, b) =>

                        Number(a.valor || 0)

                        -

                        Number(b.valor || 0)

                );

            break;



            case "maior":

                resultado.sort(

                    (a, b) =>

                        Number(b.valor || 0)

                        -

                        Number(a.valor || 0)

                );

            break;



            case "area":

                resultado.sort(

                    (a, b) =>

                        Number(b.area || 0)

                        -

                        Number(a.area || 0)

                );

            break;



            case "recentes":

                resultado.reverse();

            break;

        }

    }



    listaFiltrada = resultado;

    render();

}



// ======================================================
// EVENTOS
// ======================================================

if (pesquisa) {

    pesquisa.addEventListener(

        "input",

        aplicarFiltros

    );

}



if (filtroTipo) {

    filtroTipo.addEventListener(

        "change",

        aplicarFiltros

    );

}



if (filtroCidade) {

    filtroCidade.addEventListener(

        "change",

        aplicarFiltros

    );

}



if (filtroDormitorios) {

    filtroDormitorios.addEventListener(

        "change",

        aplicarFiltros

    );

}



if (ordenacao) {

    ordenacao.addEventListener(

        "change",

        aplicarFiltros

    );

}



// ======================================================
// FIM DO ARQUIVO
// ======================================================

console.log("Portal de imóveis carregado com sucesso.");