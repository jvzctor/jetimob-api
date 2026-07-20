// ===============================
// CONFIGURAÇÕES
// ===============================

const API = "https://jetimob-api-1.onrender.com/api/imoveis";

const WHATSAPP = "5554997010512";


// ===============================
// ELEMENTOS
// ===============================

const lista = document.getElementById("lista-imoveis");

const contador = document.getElementById("contador");

const pesquisa = document.getElementById("pesquisa");

const filtroTipo = document.getElementById("tipo");

const filtroDormitorios = document.getElementById("dormitorios");

const ordenacao = document.getElementById("ordenacao");


// ===============================
// VARIÁVEIS
// ===============================

let todosImoveis = [];

let imoveisFiltrados = [];


// ===============================
// INICIAR
// ===============================

window.addEventListener("DOMContentLoaded", iniciar);

async function iniciar(){

    await carregarImoveis();

    popularTipos();

    aplicarFiltros();

}


// ===============================
// CARREGAR API
// ===============================

async function carregarImoveis(){

    contador.innerHTML = "Carregando imóveis...";

    try{

        const response = await fetch(API);

        todosImoveis = await response.json();

    }catch(e){

        console.error(e);

        contador.innerHTML = "Erro ao carregar imóveis.";

    }

}
// ===============================
// RENDER
// ===============================

function render(listaImoveis){

    lista.innerHTML = "";

    contador.innerHTML =
        `${listaImoveis.length} imóveis encontrados`;

    listaImoveis.forEach(imovel=>{

        lista.innerHTML += criarCard(imovel);

    });

}
// ===============================
// CARD
// ===============================

function criarCard(imovel){

    const titulo =
        imovel.titulo ||
        imovel.nome ||
        "Imóvel";

    const bairro =
        imovel.bairro || "";

    const cidade =
        imovel.cidade || "";

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

    const imagem =
        imovel.imagem ||
        "https://placehold.co/600x400";

    const valor =
        Number(imovel.valor || 0)
        .toLocaleString("pt-BR");

    return `

<div class="card">

<img
src="${imagem}"
loading="lazy">

<div class="card-body">

<h2>${titulo}</h2>

<p class="local">

${bairro} - ${cidade}

</p>

<div class="info">

<span>🛏 ${dormitorios}</span>

<span>🚿 ${banheiros}</span>

<span>🚗 ${vagas}</span>

<span>📐 ${area} m²</span>

</div>

<div class="preco">

R$ ${valor}

</div>

<a
class="botao"
target="_blank"
href="https://wa.me/${WHATSAPP}?text=Olá! Tenho interesse no imóvel ${imovel.codigo}">

Falar no WhatsApp

</a>

</div>

</div>

`;

}
// ===============================
// POPULAR TIPOS
// ===============================

function popularTipos() {

    const tipos = [...new Set(

        todosImoveis
            .map(i => i.tipo)
            .filter(Boolean)

    )].sort();

    tipos.forEach(tipo => {

        filtroTipo.innerHTML += `
            <option value="${tipo}">
                ${tipo}
            </option>
        `;

    });

}


// ===============================
// APLICAR FILTROS
// ===============================

function aplicarFiltros() {

    let lista = [...todosImoveis];

    // ------------------------
    // PESQUISA
    // ------------------------

    const texto = pesquisa.value
        .trim()
        .toLowerCase();

    if (texto !== "") {

        lista = lista.filter(imovel => {

            return (

                String(imovel.codigo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(imovel.titulo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(imovel.bairro || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(imovel.cidade || "")
                    .toLowerCase()
                    .includes(texto)

            );

        });

    }


    // ------------------------
    // TIPO
    // ------------------------

    if (filtroTipo.value !== "") {

        lista = lista.filter(imovel =>

            imovel.tipo === filtroTipo.value

        );

    }


    // ------------------------
    // DORMITÓRIOS
    // ------------------------

    if (filtroDormitorios.value !== "") {

        const minimo =
            Number(filtroDormitorios.value);

        lista = lista.filter(imovel => {

            const dorm =
                Number(
                    imovel.dormitorios ||
                    imovel.quartos ||
                    0
                );

            return dorm >= minimo;

        });

    }


    // ------------------------
    // ORDENAÇÃO
    // ------------------------

    switch (ordenacao.value) {

        case "menor":

            lista.sort((a, b) =>

                Number(a.valor || 0) -
                Number(b.valor || 0)

            );

            break;


        case "maior":

            lista.sort((a, b) =>

                Number(b.valor || 0) -
                Number(a.valor || 0)

            );

            break;


        case "area":

            lista.sort((a, b) =>

                Number(b.area || 0) -
                Number(a.area || 0)

            );

            break;

    }

    imoveisFiltrados = lista;

    render(imoveisFiltrados);

}



// ===============================
// EVENTOS
// ===============================

pesquisa.addEventListener(

    "input",

    aplicarFiltros

);

filtroTipo.addEventListener(

    "change",

    aplicarFiltros

);

filtroDormitorios.addEventListener(

    "change",

    aplicarFiltros

);

ordenacao.addEventListener(

    "change",

    aplicarFiltros

);