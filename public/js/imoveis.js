// ======================================================
// PORTAL DE IMÓVEIS - Z3 COMMERCE
// Cliente: Nil Imóveis
// Arquivo: imoveis.js
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
// DADOS
// ======================================================

let todosImoveis = [];

let listaFiltrada = [];

let quantidadeExibida = LIMITE_INICIAL;



// ======================================================
// INICIAR
// ======================================================

window.addEventListener("DOMContentLoaded", iniciar);



async function iniciar(){

    mostrarLoading();

    await carregarImoveis();

    popularTipos();

    popularCidades();

    popularFinalidades();

    popularBairros();

    aplicarFiltros();

}



// ======================================================
// API
// ======================================================

async function carregarImoveis(){

    try{

        const response = await fetch(API);

        if(!response.ok){

            throw new Error("Erro ao carregar imóveis");

        }

        const dados = await response.json();

        todosImoveis = Array.isArray(dados)
            ? dados
            : [];

    }

    catch(erro){

        console.error(erro);

        mostrarErro();

    }

}



// ======================================================
// LOADING
// ======================================================

function mostrarLoading(){

    loading.style.display = "flex";

}

function esconderLoading(){

    loading.style.display = "none";

}



// ======================================================
// ERRO
// ======================================================

function mostrarErro(){

    contador.innerHTML="Erro ao carregar imóveis.";

    lista.innerHTML=`

        <div class="sem-imoveis">

            <h2>Não foi possível carregar os imóveis.</h2>

            <p>Tente novamente em alguns instantes.</p>

        </div>

    `;

}



// ======================================================
// POPULAR TIPOS
// ======================================================

function popularTipos(){

    if(!filtroTipo) return;

    filtroTipo.innerHTML=`
        <option value="">Todos os tipos</option>
    `;

    const tipos=[

        ...new Set(

            todosImoveis

                .map(i=>i.tipo)

                .filter(Boolean)

        )

    ].sort();

    tipos.forEach(tipo=>{

        filtroTipo.innerHTML+=`

            <option value="${tipo}">

                ${tipo}

            </option>

        `;

    });

}



// ======================================================
// POPULAR CIDADES
// ======================================================

function popularCidades(){

    if(!filtroCidade) return;

    filtroCidade.innerHTML=`

        <option value="">Todas as cidades</option>

    `;

    const cidades=[

        ...new Set(

            todosImoveis

                .map(i=>i.cidade)

                .filter(Boolean)

        )

    ].sort();

    cidades.forEach(cidade=>{

        filtroCidade.innerHTML+=`

            <option value="${cidade}">

                ${cidade}

            </option>

        `;

    });

}



// ======================================================
// POPULAR BAIRROS
// ======================================================

function popularBairros(){

    if(!filtroBairro) return;

    filtroBairro.innerHTML=`

        <option value="">Todos os bairros</option>

    `;

    let origem=[...todosImoveis];

    if(filtroCidade && filtroCidade.value){

        origem=origem.filter(

            imovel=>imovel.cidade===filtroCidade.value

        );

    }

    const bairros=[

        ...new Set(

            origem

                .map(i=>i.bairro)

                .filter(Boolean)

        )

    ].sort();

    bairros.forEach(bairro=>{

        filtroBairro.innerHTML+=`

            <option value="${bairro}">

                ${bairro}

            </option>

        `;

    });

}



// ======================================================
// POPULAR FINALIDADES
// ======================================================

function popularFinalidades(){

    if(!filtroFinalidade) return;

    filtroFinalidade.innerHTML=`

        <option value="">Todas</option>

    `;

    const finalidades=[

        ...new Set(

            todosImoveis

                .map(i=>

                    i.finalidade ||

                    i.negocio ||

                    i.tipoNegocio

                )

                .filter(Boolean)

        )

    ].sort();

    finalidades.forEach(item=>{

        filtroFinalidade.innerHTML+=`

            <option value="${item}">

                ${item}

            </option>

        `;

    });

}
// ======================================================
// RENDER
// ======================================================

function render(){

    contador.innerHTML = `
        Mostrando
        <strong>${Math.min(quantidadeExibida, listaFiltrada.length)}</strong>
        de
        <strong>${listaFiltrada.length}</strong>
        imóveis encontrados
    `;

    if(listaFiltrada.length === 0){

        lista.innerHTML = `
            <div class="sem-imoveis">
                <h2>Nenhum imóvel encontrado</h2>
                <p>Altere os filtros para encontrar novos resultados.</p>
            </div>
        `;

        return;

    }

    const html = listaFiltrada
        .slice(0, quantidadeExibida)
        .map(imovel => criarCard(imovel))
        .join("");

    lista.innerHTML = html;

    renderBotaoCarregarMais();

}

// ======================================================
// BOTÃO CARREGAR MAIS
// ======================================================

function renderBotaoCarregarMais(){

    const antigo = document.querySelector(".carregar-mais");

    if(antigo){

        antigo.remove();

    }

    if(listaFiltrada.length <= quantidadeExibida){

        return;

    }

    const div = document.createElement("div");

    div.className = "carregar-mais";

    div.innerHTML = `
        <button id="btnCarregarMais">
            Carregar mais imóveis
        </button>
    `;

    lista.appendChild(div);

    document
        .getElementById("btnCarregarMais")
        .addEventListener("click", () => {

            quantidadeExibida += QUANTIDADE_POR_PAGINA;

            render();

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

}

// ======================================================
// CARD
// ======================================================

function criarCard(imovel){

    const imagem = obterImagem(imovel);

    const titulo = imovel.titulo || "Imóvel";

    const codigo = imovel.codigo || "-";

    const bairro = imovel.bairro || "";

    const cidade = imovel.cidade || "";

    const tipo = imovel.tipo || "Imóvel";

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

    const valor = formatarValor(imovel.valor);

    return `

<div class="card-imovel" onclick="abrirImovel('${codigo}')">

    <div class="imagem-imovel">

        <img
            src="${imagem}"
            alt="${titulo}"
            loading="lazy"
            onerror="this.src='https://placehold.co/900x650?text=Sem+Imagem'">

        ${finalidade ? `
            <span class="badge-finalidade">
                ${finalidade}
            </span>
        ` : ""}

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

                    ${valor}

                </div>

            </div>

            <a
                class="botao-whatsapp"
                href="${linkWhatsApp(imovel)}"
                target="_blank"
                onclick="event.stopPropagation();">

                Tenho interesse

            </a>

        </div>

    </div>

</div>

`;

}

// ======================================================
// UTILITÁRIOS
// ======================================================

function obterImagem(imovel){

    if(imovel.fotos?.length){

        return imovel.fotos[0];

    }

    if(imovel.imagens?.length){

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



function formatarValor(valor){

    const numero = Number(valor);

    if(!numero || numero <= 0){

        return "Consulte";

    }

    return numero.toLocaleString("pt-BR",{

        style:"currency",

        currency:"BRL",

        maximumFractionDigits:0

    });

}



function linkWhatsApp(imovel){

    const telefone = "5554997010512";

    const mensagem =
`Olá!

Tenho interesse neste imóvel.

Código: ${imovel.codigo}

${imovel.titulo}

Valor: ${formatarValor(imovel.valor)}

Pode me enviar mais informações?`;

    return `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

}



function abrirImovel(codigo){

    window.open(

        `https://nilimoveis.imb.br/imovel/${codigo}`,

        "_blank"

    );

}

// ======================================================
// FILTROS
// ======================================================

function aplicarFiltros(){

    quantidadeExibida=LIMITE_INICIAL;

    let resultado=[...todosImoveis];



    // ==========================================
    // PESQUISA
    // ==========================================

    if(pesquisa && pesquisa.value.trim()!==""){

        const texto=pesquisa.value
            .trim()
            .toLowerCase();

        resultado=resultado.filter(imovel=>{

            return [

                imovel.codigo,

                imovel.titulo,

                imovel.nome,

                imovel.referencia,

                imovel.tipo,

                imovel.cidade,

                imovel.bairro

            ]

            .filter(Boolean)

            .some(campo=>

                String(campo)

                    .toLowerCase()

                    .includes(texto)

            );

        });

    }



    // ==========================================
    // TIPO
    // ==========================================

    if(filtroTipo && filtroTipo.value){

        resultado=resultado.filter(imovel=>

            imovel.tipo===filtroTipo.value

        );

    }



    // ==========================================
    // CIDADE
    // ==========================================

    if(filtroCidade && filtroCidade.value){

        resultado=resultado.filter(imovel=>

            imovel.cidade===filtroCidade.value

        );

    }



    // ==========================================
    // BAIRRO
    // ==========================================

    if(filtroBairro && filtroBairro.value){

        resultado=resultado.filter(imovel=>

            imovel.bairro===filtroBairro.value

        );

    }



    // ==========================================
    // FINALIDADE
    // ==========================================

    if(filtroFinalidade && filtroFinalidade.value){

        resultado=resultado.filter(imovel=>{

            const finalidade=

                imovel.finalidade ||

                imovel.negocio ||

                imovel.tipoNegocio ||

                "";

            return finalidade===filtroFinalidade.value;

        });

    }



    // ==========================================
    // DORMITÓRIOS
    // ==========================================

    if(filtroDormitorios && filtroDormitorios.value){

        const minimo=Number(filtroDormitorios.value);

        resultado=resultado.filter(imovel=>{

            const quartos=Number(

                imovel.dormitorios ||

                imovel.quartos ||

                0

            );

            return quartos>=minimo;

        });

    }



    // ==========================================
    // VALOR MÍNIMO
    // ==========================================

    if(valorMin && valorMin.value){

        const minimo=Number(valorMin.value);

        resultado=resultado.filter(imovel=>

            Number(imovel.valor || 0)>=minimo

        );

    }



    // ==========================================
    // VALOR MÁXIMO
    // ==========================================

    if(valorMax && valorMax.value){

        const maximo=Number(valorMax.value);

        resultado=resultado.filter(imovel=>

            Number(imovel.valor || 0)<=maximo

        );

    }



    // ==========================================
    // ORDENAÇÃO PADRÃO
    // ==========================================

    resultado.sort((a,b)=>{

        return Number(b.codigo||0)-Number(a.codigo||0);

    });



    listaFiltrada=resultado;

    render();

}



// ======================================================
// LIMPAR FILTROS
// ======================================================

function limparFiltros(){

    if(pesquisa) pesquisa.value="";

    if(filtroTipo) filtroTipo.value="";

    if(filtroCidade) filtroCidade.value="";

    if(filtroBairro) filtroBairro.value="";

    if(filtroFinalidade) filtroFinalidade.value="";

    if(filtroDormitorios) filtroDormitorios.value="";

    if(valorMin) valorMin.value="";

    if(valorMax) valorMax.value="";

    popularBairros();

    aplicarFiltros();

}



// ======================================================
// ATUALIZA BAIRROS AO TROCAR CIDADE
// ======================================================

function atualizarBairros(){

    popularBairros();

    if(filtroBairro){

        filtroBairro.value="";

    }

    aplicarFiltros();

}
// ======================================================
// EVENTOS
// ======================================================

if(pesquisa){

    pesquisa.addEventListener("input",()=>{

        aplicarFiltros();

    });

    pesquisa.addEventListener("keypress",(e)=>{

        if(e.key==="Enter"){

            aplicarFiltros();

        }

    });

}



// ======================================================
// BOTÃO BUSCAR
// ======================================================

if(btnBuscar){

    btnBuscar.addEventListener("click",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// BOTÃO LIMPAR
// ======================================================

if(btnLimpar){

    btnLimpar.addEventListener("click",()=>{

        limparFiltros();

    });

}



// ======================================================
// FILTRO TIPO
// ======================================================

if(filtroTipo){

    filtroTipo.addEventListener("change",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// FILTRO CIDADE
// ======================================================

if(filtroCidade){

    filtroCidade.addEventListener("change",()=>{

        atualizarBairros();

    });

}



// ======================================================
// FILTRO BAIRRO
// ======================================================

if(filtroBairro){

    filtroBairro.addEventListener("change",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// FILTRO FINALIDADE
// ======================================================

if(filtroFinalidade){

    filtroFinalidade.addEventListener("change",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// FILTRO DORMITÓRIOS
// ======================================================

if(filtroDormitorios){

    filtroDormitorios.addEventListener("change",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// VALOR MÍNIMO
// ======================================================

if(valorMin){

    valorMin.addEventListener("input",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// VALOR MÁXIMO
// ======================================================

if(valorMax){

    valorMax.addEventListener("input",()=>{

        aplicarFiltros();

    });

}



// ======================================================
// OBSERVA ALTERAÇÕES NOS FILTROS
// ======================================================

[
    filtroTipo,
    filtroCidade,
    filtroBairro,
    filtroFinalidade,
    filtroDormitorios,
    valorMin,
    valorMax
]

.filter(Boolean)

.forEach(elemento=>{

    elemento.addEventListener("change",()=>{

        aplicarFiltros();

    });

});



// ======================================================
// RECARREGA CASO A PÁGINA VOLTE DO DETALHE
// ======================================================

window.addEventListener("pageshow",()=>{

    aplicarFiltros();

});



// ======================================================
// SCROLL PARA O TOPO AO PESQUISAR
// ======================================================

function voltarAoTopo(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// ======================================================
// CARREGAR MAIS
// ======================================================

function carregarMais(){

    quantidadeExibida+=LIMITE_INICIAL;

    render();

}



// ======================================================
// ATUALIZA CONTADOR
// ======================================================

function atualizarContador(){

    contador.innerHTML=`
        Mostrando
        <strong>${Math.min(quantidadeExibida,listaFiltrada.length)}</strong>
        de
        <strong>${listaFiltrada.length}</strong>
        imóveis encontrados
    `;

}
// ======================================================
// UTILITÁRIOS
// ======================================================

function numero(valor){

    if(valor===null || valor===undefined){

        return 0;

    }

    if(typeof valor==="number"){

        return valor;

    }

    return Number(

        String(valor)

            .replace(/\./g,"")
            .replace(",",".")
            .replace(/[^\d.-]/g,"")

    ) || 0;

}



function texto(valor){

    return String(valor || "")

        .trim()

        .toLowerCase();

}



function possuiTexto(campo,pesquisa){

    return texto(campo).includes(texto(pesquisa));

}



// ======================================================
// ORDENA LISTA
// ======================================================

function ordenarImoveis(lista){

    return lista.sort((a,b)=>{

        const codigoA=numero(a.codigo);

        const codigoB=numero(b.codigo);

        return codigoB-codigoA;

    });

}



// ======================================================
// ATUALIZA FILTROS
// ======================================================

function atualizarFiltros(){

    popularTipos();

    popularCidades();

    popularFinalidades();

    popularBairros();

}



// ======================================================
// RECARREGAR DADOS
// ======================================================

async function atualizarDados(){

    mostrarLoading();

    await carregarImoveis();

    atualizarFiltros();

    aplicarFiltros();

}



// ======================================================
// REFRESH AUTOMÁTICO
// ======================================================

setInterval(()=>{

    if(document.hidden){

        return;

    }

    atualizarDados();

},300000);



// ======================================================
// REDIMENSIONAMENTO
// ======================================================

window.addEventListener("resize",()=>{

    if(window.innerWidth<768){

        document.body.classList.add("mobile");

    }else{

        document.body.classList.remove("mobile");

    }

});



// ======================================================
// PRIMEIRA VERIFICAÇÃO
// ======================================================

if(window.innerWidth<768){

    document.body.classList.add("mobile");

}



// ======================================================
// ACESSIBILIDADE
// ======================================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        if(pesquisa){

            pesquisa.blur();

        }

    }

});



// ======================================================
// DEBUG
// ======================================================

console.log("===================================");

console.log("Portal Nil Imóveis");

console.log("Desenvolvido por Z3 Commerce");

console.log("API:",API);

console.log("===================================");



// ======================================================
// EXPORTA PARA ESCOPO GLOBAL
// ======================================================

window.abrirImovel=abrirImovel;

window.aplicarFiltros=aplicarFiltros;

window.limparFiltros=limparFiltros;

window.carregarMais=carregarMais;



// ======================================================
// FIM DO ARQUIVO
// ======================================================

console.log("imoveis.js carregado com sucesso.");