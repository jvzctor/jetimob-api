// ======================================================
// PORTAL DE IMÓVEIS
// Nil Imóveis
// Desenvolvido por Z3 Commerce
// ======================================================



// ======================================================
// CONFIGURAÇÕES
// ======================================================

const API = "https://jetimob-api-1.onrender.com/api/imoveis";

const WHATSAPP = "5554997010512";

const LIMITE_INICIAL = 12;



// ======================================================
// ELEMENTOS
// ======================================================

const lista = document.getElementById("lista-imoveis");

const contador = document.getElementById("contador");

const loading = document.getElementById("loading");

const pesquisa = document.getElementById("pesquisa");

const filtroTipo = document.getElementById("tipo");

const filtroCidade = document.getElementById("cidade");

const filtroBairro = document.getElementById("bairro");

const filtroFinalidade = document.getElementById("finalidade");

const filtroDormitorios = document.getElementById("dormitorios");

const valorMin = document.getElementById("valorMin");

const valorMax = document.getElementById("valorMax");

const btnBuscar = document.getElementById("btnBuscar");

const btnLimpar = document.getElementById("btnLimpar");



// ======================================================
// ESTADO
// ======================================================

let todosImoveis = [];

let listaFiltrada = [];

let quantidadeExibida = LIMITE_INICIAL;



// ======================================================
// INICIAR
// ======================================================

document.addEventListener("DOMContentLoaded", iniciar);



async function iniciar(){

    mostrarLoading();

    try{

        await carregarImoveis();

        atualizarFiltros();

        registrarEventos();

        aplicarFiltros();

    }

    catch(erro){

        console.error(erro);

        mostrarErro();

    }

    finally{

        esconderLoading();

    }

}
// ======================================================
// LOADING
// ======================================================

function mostrarLoading(){

    if(loading){

        loading.style.display="flex";

    }

}



function esconderLoading(){

    if(loading){

        loading.style.display="none";

    }

}
// ======================================================
// ERRO
// ======================================================

function mostrarErro(){

    contador.textContent="Erro ao carregar imóveis.";

    lista.innerHTML=`

        <div class="sem-imoveis">

            <h2>Não foi possível carregar os imóveis.</h2>

            <p>Tente novamente mais tarde.</p>

        </div>

    `;

}
// ======================================================
// API
// ======================================================

async function carregarImoveis(){

    const response = await fetch(API);

    if(!response.ok){

        throw new Error("Erro ao carregar imóveis.");

    }

    const dados = await response.json();

    todosImoveis = Array.isArray(dados) ? dados : [];

}



// ======================================================
// FILTROS
// ======================================================

function atualizarFiltros(){

    preencherSelect(

        filtroTipo,

        "Todos os tipos",

        [...new Set(

            todosImoveis

                .map(i => i.tipo)

                .filter(Boolean)

        )]

    );



    preencherSelect(

        filtroCidade,

        "Todas as cidades",

        [...new Set(

            todosImoveis

                .map(i => i.cidade)

                .filter(Boolean)

        )]

    );



    preencherFinalidades();

    atualizarBairros();

}



// ======================================================
// FINALIDADES
// ======================================================

function preencherFinalidades(){

    preencherSelect(

        filtroFinalidade,

        "Todas",

        [...new Set(

            todosImoveis

                .map(i=>

                    i.finalidade ||

                    i.negocio ||

                    i.tipoNegocio

                )

                .filter(Boolean)

        )]

    );

}



// ======================================================
// BAIRROS
// ======================================================

function atualizarBairros(){

    if(!filtroBairro){

        return;

    }

    let origem = [...todosImoveis];



    if(filtroCidade?.value){

        origem = origem.filter(

            i => i.cidade === filtroCidade.value

        );

    }



    preencherSelect(

        filtroBairro,

        "Todos os bairros",

        [...new Set(

            origem

                .map(i => i.bairro)

                .filter(Boolean)

        )]

    );

}



// ======================================================
// UTILITÁRIO DOS SELECTS
// ======================================================

function preencherSelect(

    elemento,

    primeiroItem,

    valores

){

    if(!elemento){

        return;

    }



    elemento.innerHTML =

        `<option value="">${primeiroItem}</option>` +

        valores

            .sort()

            .map(valor =>

                `<option value="${valor}">${valor}</option>`

            )

            .join("");

}
// ======================================================
// FILTRAR IMÓVEIS
// ======================================================

function aplicarFiltros(){

    quantidadeExibida = LIMITE_INICIAL;

    listaFiltrada = todosImoveis.filter(imovel=>{

        const codigo = String(imovel.id || "").toLowerCase();

        const titulo = String(imovel.titulo || imovel.nome || "").toLowerCase();

        const bairro = String(imovel.bairro || "").toLowerCase();

        const cidade = String(imovel.cidade || "").toLowerCase();

        const tipo = imovel.tipo || "";

        const finalidade =
            imovel.finalidade ||
            imovel.negocio ||
            imovel.tipoNegocio ||
            "";

        const quartos = Number(

            imovel.dormitorios ||

            imovel.quartos ||

            0

        );

        const valor = Number(imovel.valor || 0);

        const busca = pesquisa.value.trim().toLowerCase();

        if(

            busca &&

            !codigo.includes(busca) &&

            !titulo.includes(busca) &&

            !bairro.includes(busca) &&

            !cidade.includes(busca)

        ){

            return false;

        }

        if(filtroTipo.value && tipo !== filtroTipo.value){

            return false;

        }

        if(filtroCidade.value && cidade !== filtroCidade.value.toLowerCase()){

            return false;

        }

        if(filtroBairro.value && bairro !== filtroBairro.value.toLowerCase()){

            return false;

        }

        if(

            filtroFinalidade.value &&

            finalidade !== filtroFinalidade.value

        ){

            return false;

        }

        if(

            filtroDormitorios.value &&

            quartos < Number(filtroDormitorios.value)

        ){

            return false;

        }

        if(

            valorMin.value &&

            valor < Number(valorMin.value)

        ){

            return false;

        }

        if(

            valorMax.value &&

            valor > Number(valorMax.value)

        ){

            return false;

        }

        return true;

    });

    listaFiltrada.sort(

        (a,b)=>

            Number(b.codigo||0)-Number(a.codigo||0)

    );

    render();

}



// ======================================================
// RENDER
// ======================================================

function render(){

    atualizarContador();

    if(!listaFiltrada.length){

        lista.innerHTML = `

            <div class="sem-imoveis">

                <h2>Nenhum imóvel encontrado</h2>

                <p>Tente alterar os filtros.</p>

            </div>

        `;

        return;

    }

    lista.innerHTML = listaFiltrada

        .slice(0, quantidadeExibida)

        .map(criarCard)

        .join("");

    renderBotaoCarregarMais();

document.querySelectorAll(".card-imovel").forEach(card => {
    card.onclick = () => {
        abrirImovel(card.dataset.codigo);
    };
});




// ======================================================
// CONTADOR
// ======================================================

function atualizarContador(){

    contador.innerHTML = `

        Mostrando

        <strong>

            ${Math.min(quantidadeExibida,listaFiltrada.length)}

        </strong>

        de

        <strong>

            ${listaFiltrada.length}

        </strong>

        imóveis encontrados

    `;

}



// ======================================================
// BOTÃO CARREGAR MAIS
// ======================================================

function renderBotaoCarregarMais(){

    document

        .querySelector(".carregar-mais")

        ?.remove();

    if(

        quantidadeExibida >= listaFiltrada.length

    ){

        return;

    }

    const div = document.createElement("div");

    div.className = "carregar-mais";

    div.innerHTML = `

        <button id="btnCarregarMais">

            Carregar mais imóveis

        </button>

    `;

    lista.after(div);

    document

        .getElementById("btnCarregarMais")

        .addEventListener("click",()=>{

            quantidadeExibida += LIMITE_INICIAL;

            render();

        });

}
// ======================================================
// CARD
// ======================================================

function criarCard(imovel){

    console.log(imovel);

    const imagem = obterImagem(imovel);

    const titulo = imovel.titulo || imovel.nome || "Imóvel";

    const codigo = imovel.codigo || "-";

    const tipo = imovel.tipo || "Imóvel";

    const cidade = imovel.cidade || "";

    const bairro = imovel.bairro || "";

    const finalidade =
        imovel.finalidade ||
        imovel.negocio ||
        imovel.tipoNegocio ||
        "";

    const dormitorios =
        imovel.dormitorios ??
        imovel.quartos ??
        0;

    const banheiros =
        imovel.banheiros ??
        0;

    const vagas =
        imovel.vagas ??
        imovel.garagem ??
        0;

    const area =
        imovel.area ??
        imovel.areaPrivativa ??
        imovel.area_total ??
        0;

    return `

<div class="card-imovel" data-codigo="${codigo}">

    <div class="imagem-imovel">

        <img
            src="${imagem}"
            alt="${titulo}"
            loading="lazy"
            onerror="this.src='https://placehold.co/900x650?text=Sem+Imagem'">

        ${
            finalidade
            ?
            `<span class="badge-finalidade">${finalidade}</span>`
            :
            ""
        }

    </div>

    <div class="conteudo-imovel">

        <div class="topo-card">

            <span class="tipo-imovel">

                ${tipo}

            </span>

            <span class="codigo">

                Código ${codigo}

            </span>

        </div>

        <h3 class="titulo-imovel">

            ${titulo}

        </h3>

        <div class="endereco">

            📍 ${bairro}${cidade ? " • " + cidade : ""}

        </div>

        <div class="infos-imovel">

            <span>

                🛏

                <strong>${dormitorios}</strong>

            </span>

            <span>

                🚿

                <strong>${banheiros}</strong>

            </span>

            <span>

                🚗

                <strong>${vagas}</strong>

            </span>

            <span>

                📐

                <strong>${area} m²</strong>

            </span>

        </div>

        <div class="rodape-card">

            <div>

                <span class="texto-preco">

                    Valor

                </span>

                <div class="valor">

                    ${formatarValor(imovel.valor)}

                </div>

            </div>

            <a

                href="${linkWhatsApp(imovel)}"

                target="_blank"

                class="botao-whatsapp"

                onclick="event.stopPropagation();">

                Tenho interesse

            </a>

        </div>

    </div>

</div>

`;

}



// ======================================================
// IMAGEM
// ======================================================

function obterImagem(imovel){

    if(Array.isArray(imovel.fotos) && imovel.fotos.length){

        return imovel.fotos[0];

    }

    if(Array.isArray(imovel.imagens) && imovel.imagens.length){

        return imovel.imagens[0];

    }

    if(imovel.imagem){

        return imovel.imagem;

    }

    if(imovel.foto){

        return imovel.foto;

    }

    return "https://placehold.co/900x650?text=Sem+Imagem";

}



// ======================================================
// VALOR
// ======================================================

function formatarValor(valor){

    const numero = Number(valor);

    if(!numero){

        return "Consulte";

    }

    return numero.toLocaleString(

        "pt-BR",

        {

            style:"currency",

            currency:"BRL",

            maximumFractionDigits:0

        }

    );

}



// ======================================================
// WHATSAPP
// ======================================================

function linkWhatsApp(imovel){

    const mensagem =

`Olá!

Tenho interesse neste imóvel.

Código: ${imovel.codigo}

${imovel.titulo || imovel.nome}

Valor: ${formatarValor(imovel.valor)}

Pode me enviar mais informações?`;

    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

}



// ======================================================
// ABRIR IMÓVEL
// ======================================================

function abrirImovel(codigo){

    window.open(
        `https://imoveis.nilimoveis.imb.br/pages/imovel.html?codigo=${codigo}`,
        "_blank"
    );

}

// ======================================================
// EVENTOS
// ======================================================

function registrarEventos(){

    btnBuscar?.addEventListener("click", aplicarFiltros);

    btnLimpar?.addEventListener("click", limparFiltros);

    pesquisa?.addEventListener("input", aplicarFiltros);

    filtroTipo?.addEventListener("change", aplicarFiltros);

    filtroCidade?.addEventListener("change", () => {

        atualizarBairros();

        aplicarFiltros();

    });

    filtroBairro?.addEventListener("change", aplicarFiltros);

    filtroFinalidade?.addEventListener("change", aplicarFiltros);

    filtroDormitorios?.addEventListener("change", aplicarFiltros);

    valorMin?.addEventListener("input", aplicarFiltros);

    valorMax?.addEventListener("input", aplicarFiltros);

}



// ======================================================
// LIMPAR FILTROS
// ======================================================

function limparFiltros(){

    pesquisa.value = "";

    filtroTipo.value = "";

    filtroCidade.value = "";

    filtroBairro.value = "";

    filtroFinalidade.value = "";

    filtroDormitorios.value = "";

    valorMin.value = "";

    valorMax.value = "";

    atualizarBairros();

    aplicarFiltros();

}



// ======================================================
// ATUALIZAÇÃO AUTOMÁTICA
// ======================================================

async function atualizarDados(){

    try{

        await carregarImoveis();

        atualizarFiltros();

        aplicarFiltros();

    }

    catch(error){

        console.error(error);

    }

}



// Atualiza a cada 5 minutos
setInterval(atualizarDados, 300000);



// Atualiza quando voltar para a aba
document.addEventListener("visibilitychange", () => {

    if(!document.hidden){

        atualizarDados();

    }

});



// Atualiza ao voltar usando histórico do navegador
window.addEventListener("pageshow", () => {

    atualizarDados();

});



// ======================================================
// EXPORTAÇÃO GLOBAL
// ======================================================

window.abrirImovel = abrirImovel;

window.linkWhatsApp = linkWhatsApp;