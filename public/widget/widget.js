(() => {

"use strict";

/*==========================================
CONFIGURAÇÃO
==========================================*/

const API =
"https://jetimob-api-1.onrender.com/api/imoveis";

const WHATSAPP =
"5554997010512";

const LIMITE =
6;

const container =
document.getElementById("z3-imoveis");

if(!container){
    console.error("Container #z3-imoveis não encontrado.");
    return;
}

/*==========================================
ÍCONES SVG
==========================================*/

const ICONS={

pin:`
<svg viewBox="0 0 24 24">
<path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
</svg>
`,

bed:`
<svg viewBox="0 0 24 24">
<path d="M3 11V6h6a3 3 0 013 3v2h9v8h-2v-2H5v2H3v-8zm2 2v2h14v-2H5z"/>
</svg>
`,

bath:`
<svg viewBox="0 0 24 24">
<path d="M7 10V7a5 5 0 0110 0h-2a3 3 0 10-6 0v3h10v5a4 4 0 01-4 4H9a4 4 0 01-4-4v-5h2z"/>
</svg>
`,

garage:`
<svg viewBox="0 0 24 24">
<path d="M3 10L12 3l9 7v10h-3v-4H6v4H3V10z"/>
</svg>
`,

area:`
<svg viewBox="0 0 24 24">
<path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"/>
</svg>
`

};

/*==========================================
UTILIDADES
==========================================*/

function dinheiro(valor){

const numero =
Number(valor||0);

return numero.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL",
maximumFractionDigits:0
}
);

}

function texto(v){

if(v===undefined) return "";

if(v===null) return "";

return String(v);

}

function imagem(imovel){

if(imovel.imagem)
return imovel.imagem;

if(imovel.fotos){

if(Array.isArray(imovel.fotos)){

if(imovel.fotos.length){

return imovel.fotos[0];

}

}

}

return "https://placehold.co/900x600?text=Imóvel";

}

function mensagem(imovel){

const preco =
dinheiro(imovel.valor);

return encodeURIComponent(

`Olá!

Tenho interesse neste imóvel.

🏠 ${texto(imovel.titulo)}

💰 ${preco}

📍 ${texto(imovel.bairro)}

Código: ${texto(imovel.codigo)}

Pode me enviar mais informações?`

);

}
/*==========================================
LOADING
==========================================*/

function loading(){

container.innerHTML="";

for(let i=0;i<LIMITE;i++){

const item=document.createElement("div");

item.className="z3-skeleton";

item.innerHTML=`

<div class="z3-skeleton-image"></div>

<div class="z3-skeleton-body">

<div class="z3-line"></div>

<div class="z3-line"></div>

<div class="z3-line"></div>

<div class="z3-line"></div>

</div>

`;

container.appendChild(item);

}

}

/*==========================================
ERRO
==========================================*/

function erro(msg){

container.innerHTML=`

<div class="z3-error">

${msg}

</div>

`;

}

/*==========================================
RENDERIZAÇÃO
==========================================*/

function render(lista){

    container.innerHTML="";

    if(!Array.isArray(lista) || !lista.length){

        erro("Nenhum imóvel encontrado.");

        return;

    }

    lista.forEach((item,index)=>{

        const titulo =
            item.titulo ||
            item.nome ||
            item.empreendimento ||
            "Imóvel";

        const tipo =
            item.tipo ||
            item.finalidade ||
            "Imóvel";

        const bairro =
            item.bairro ||
            item.bairro_nome ||
            "";

        const cidade =
            item.cidade ||
            item.cidade_nome ||
            "";

        const quartos =
            item.quartos ??
            item.dormitorios ??
            item.dormitórios ??
            0;

        const banheiros =
            item.banheiros ??
            item.banheiro ??
            0;

        const vagas =
            item.garagens ??
            item.garagem ??
            item.vagas ??
            item.vaga ??
            0;

        const area =
            item.area ||
            item.area_privativa ||
            item.area_total ||
            "-";

        const valor =
            dinheiro(item.valor);

        const foto =
            imagem(item);

        const card =
            document.createElement("a");

        card.className="z3-card";

        card.target="_blank";

        card.rel="noopener";

        card.href=
`https://wa.me/${WHATSAPP}?text=${mensagem(item)}`;

        card.style.transitionDelay=
`${index*80}ms`;

        card.innerHTML=`

<div class="z3-image">

<img
src="${foto}"
loading="lazy"
alt="${titulo}"
onerror="this.src='https://placehold.co/900x600?text=Sem+Imagem';">

<div class="z3-tag">

${tipo}

</div>

</div>

<div class="z3-info">

<h3 class="z3-title">

${titulo}

</h3>

<div class="z3-location">

${ICONS.pin}

<span>

${bairro}${cidade ? " - "+cidade : ""}

</span>

</div>

<div class="z3-features">

    <div class="z3-feature">

        ${ICONS.bed}

        <strong>${quartos}</strong>

        <span>Quartos</span>

    </div>

    <div class="z3-feature">

        ${ICONS.bath}

        <strong>${banheiros}</strong>

        <span>Banheiros</span>

    </div>

    <div class="z3-feature">

        ${ICONS.garage}

        <strong>${vagas}</strong>

        <span>Vagas</span>

    </div>

    <div class="z3-feature">

        ${ICONS.area}

        <strong>${area}</strong>

        <span>m²</span>

    </div>

</div>

<div class="z3-price">

    <small>Valor do imóvel</small>

    <strong>

        ${valor}

    </strong>

</div>

<div class="z3-btn">

    💬 Falar com um corretor

</div>

</div>

`;

        const imagemCard =
            card.querySelector("img");

        imagemCard.addEventListener("error",()=>{

            imagemCard.src =
            "https://placehold.co/900x600?text=Sem+Imagem";

        });

        container.appendChild(card);

    });

    requestAnimationFrame(()=>{

        document
            .querySelectorAll(".z3-card")
            .forEach((card,i)=>{

                setTimeout(()=>{

                    card.classList.add("z3-visible");

                },i*80);

            });

    });

}

/*==========================================
ANIMAÇÃO
==========================================*/

function animar(){

const cards=
document.querySelectorAll(".z3-card");

const observer=
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("z3-visible");

observer.unobserve(entry.target);

}

});

},
{
threshold:.15
}

);

cards.forEach(card=>observer.observe(card));

}

/*==========================================
API
==========================================*/

async function carregar(){

loading();

try{

const resposta=
await fetch(API);

if(!resposta.ok){

throw new Error("Erro ao consultar API.");

}

const dados=
await resposta.json();

let lista=[];

if(Array.isArray(dados)){

lista=dados;

}
else if(Array.isArray(dados.imoveis)){

lista=dados.imoveis;

}
else if(Array.isArray(dados.data)){

lista=dados.data;

}

lista=lista.slice(0,LIMITE);

render(lista);

requestAnimationFrame(animar);

}
catch(e){

console.error(e);

erro("Não foi possível carregar os imóveis.");

}

}

/*==========================================
INICIALIZAÇÃO
==========================================*/

carregar();

if(document.currentScript){

const refresh=
Number(
document.currentScript.dataset.refresh||0
);

if(refresh>0){

setInterval(carregar,refresh*1000);

}

}

})();