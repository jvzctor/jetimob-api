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

        console.log(imovel);

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

   document.getElementById("descricao").innerHTML =
    imovel.descricao ||
    imovel.descricaoWeb ||
    imovel.observacoes ||
    imovel.observacao ||
    "Descrição não informada.";

    montarCaracteristicas(imovel);

    montarGaleria(imovel.imagens || []);

    montarWhatsapp(imovel);

}

function montarCaracteristicas(imovel) {

    const lista = [];

    if (imovel.dormitorios) {

        lista.push(`
            <div class="item">
                🛏
                <strong>${imovel.dormitorios}</strong>
                <small>Dormitórios</small>
            </div>
        `);

    }

    if (imovel.suites) {

        lista.push(`
            <div class="item">
                🛌
                <strong>${imovel.suites}</strong>
                <small>Suítes</small>
            </div>
        `);

    }

    if (imovel.banheiros) {

        lista.push(`
            <div class="item">
                🚿
                <strong>${imovel.banheiros}</strong>
                <small>Banheiros</small>
            </div>
        `);

    }

    if (imovel.vagas) {

        lista.push(`
            <div class="item">
                🚗
                <strong>${imovel.vagas}</strong>
                <small>Vagas</small>
            </div>
        `);

    }

    if (imovel.area) {

        lista.push(`
            <div class="item">
                📐
                <strong>${imovel.area}</strong>
                <small>Área Privativa</small>
            </div>
        `);

    }

    if (imovel.areaTotal) {

        lista.push(`
            <div class="item">
                📏
                <strong>${imovel.areaTotal}</strong>
                <small>Área Total</small>
            </div>
        `);

    }

    document.getElementById("caracteristicas").innerHTML =
        lista.join("");

}

function montarGaleria(imagens) {

    const galeria = document.getElementById("galeria");

    if (!imagens || imagens.length === 0) {

        galeria.innerHTML = `
            <img
                id="fotoPrincipal"
                class="foto-principal"
                src="https://placehold.co/1200x700?text=Sem+Imagem"
                alt="Sem imagem">
        `;

        return;

    }

    let html = `
        <img
            id="fotoPrincipal"
            class="foto-principal"
            src="${imagens[0]}"
            alt="Imagem do imóvel">
    `;

    html += `<div class="miniaturas">`;

    imagens.forEach((foto, index) => {

        html += `
            <img
                src="${foto}"
                class="miniatura ${index === 0 ? "ativa" : ""}"
                alt="Imagem ${index + 1}">
        `;

    });

    html += `</div>`;

    galeria.innerHTML = html;

    document.querySelectorAll(".miniatura").forEach(img => {

        img.addEventListener("click", () => {

            trocarImagem(img);

        });

    });

}
function trocarImagem(miniatura) {

    const fotoPrincipal = document.getElementById("fotoPrincipal");

    fotoPrincipal.style.opacity = "0";

    setTimeout(() => {

        fotoPrincipal.src = miniatura.src;

        fotoPrincipal.style.opacity = "1";

    }, 150);

    document.querySelectorAll(".miniatura").forEach(img => {

        img.classList.remove("ativa");

    });

    miniatura.classList.add("ativa");

}

function montarWhatsapp(imovel) {

    const telefone = "5554997010512";

    const valor = imovel.valor
        ? formatarValor(imovel.valor)
        : "Consulte";

    const texto = `Olá!

Tenho interesse neste imóvel.

🏠 ${imovel.titulo || ""}

📍 ${imovel.endereco || ""}
${imovel.bairro || ""} - ${imovel.cidade || ""}

💰 ${valor}

🔖 Código: ${imovel.codigo}

🔗 ${window.location.href}

Gostaria de mais informações.`;

    document.getElementById("btnWhatsapp").href =
        `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

}

function formatarValor(valor) {

    const numero = Number(valor);

    if (isNaN(numero) || numero <= 0) {
        return "Consulte";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}