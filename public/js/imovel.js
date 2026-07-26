const API = "https://imoveis.nilimoveis.imb.br/api/imoveis";

const codigo = new URLSearchParams(window.location.search).get("codigo");

if (!codigo) {
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", carregarImovel);

async function carregarImovel() {

    try {

        const response = await fetch(`${API}/${codigo}`);

        if (!response.ok) {
            throw new Error("Imóvel não encontrado.");
        }

        const imovel = await response.json();

        renderizarImovel(imovel);

    } catch (erro) {

        console.error(erro);

        document.querySelector(".pagina-imovel").innerHTML = `
            <div class="erro-imovel">
                <h2>Imóvel não encontrado</h2>
                <p>O imóvel solicitado não existe ou foi removido.</p>
            </div>
        `;

    }

}

function renderizarImovel(imovel) {

    document.title = `${imovel.titulo || "Imóvel"} | Nil Imóveis`;

    document.getElementById("titulo").textContent =
        imovel.titulo || "Imóvel";

    document.getElementById("endereco").textContent =
        `${imovel.bairro || ""}${imovel.cidade ? " - " + imovel.cidade : ""}`;

    document.getElementById("valor").textContent =
        formatarValor(imovel.valor);

    document.getElementById("descricao").textContent =
        imovel.descricao || "Descrição não informada.";

    montarCaracteristicas(imovel);

    montarGaleria(imovel.imagens || []);

    montarWhatsapp(imovel);

}
const API = "https://imoveis.nilimoveis.imb.br/api/imoveis";

const codigo = new URLSearchParams(window.location.search).get("codigo");

if (!codigo) {
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", carregarImovel);

async function carregarImovel() {

    try {

        const response = await fetch(`${API}/${codigo}`);

        if (!response.ok) {
            throw new Error("Imóvel não encontrado.");
        }

        const imovel = await response.json();

        renderizarImovel(imovel);

    } catch (erro) {

        console.error(erro);

        document.querySelector(".pagina-imovel").innerHTML = `
            <div class="erro-imovel">
                <h2>Imóvel não encontrado</h2>
                <p>O imóvel solicitado não existe ou foi removido.</p>
            </div>
        `;

    }

}

function renderizarImovel(imovel) {

    document.title = `${imovel.titulo || "Imóvel"} | Nil Imóveis`;

    document.getElementById("titulo").textContent =
        imovel.titulo || "Imóvel";

    document.getElementById("endereco").textContent =
        `${imovel.bairro || ""}${imovel.cidade ? " - " + imovel.cidade : ""}`;

    document.getElementById("valor").textContent =
        formatarValor(imovel.valor);

    document.getElementById("descricao").textContent =
        imovel.descricao || "Descrição não informada.";

    montarCaracteristicas(imovel);

    montarGaleria(imovel.imagens || []);

    montarWhatsapp(imovel);

}
function montarWhatsapp(imovel) {

    const telefone = "5554997010512";

    const texto = `Olá!

Tenho interesse neste imóvel.

🏠 ${imovel.titulo || ""}

📍 ${imovel.bairro || ""}${imovel.cidade ? " - " + imovel.cidade : ""}

💰 ${formatarValor(imovel.valor)}

🔖 Código: ${imovel.codigo}

🔗 ${window.location.href}

Gostaria de mais informações.`;

    document.getElementById("btnWhatsapp").href =
        `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

}

function formatarValor(valor) {

    const numero = Number(valor);

    if (!numero || numero <= 0) {
        return "Consulte";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}
