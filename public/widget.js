(async function () {

    const API_URL = "https://jetimob-api-1.onrender.com";

    const script = document.currentScript;

    const cidade = script?.dataset.cidade;
    const bairro = script?.dataset.bairro;
    const tipo = script?.dataset.tipo;
    const finalidade = script?.dataset.finalidade;
    const dormitorios = script?.dataset.dormitorios;
    const banheiros = script?.dataset.banheiros;
    const vagas = script?.dataset.vagas;
    const valorMin = script?.dataset.valormin;
    const valorMax = script?.dataset.valormax;
    const ordenar = script?.dataset.ordenar;
    const limite = script?.dataset.limite || 12;

    const params = new URLSearchParams();

    if (cidade) params.append("cidade", cidade);
    if (bairro) params.append("bairro", bairro);
    if (tipo) params.append("tipo", tipo);
    if (finalidade) params.append("finalidade", finalidade);
    if (dormitorios) params.append("dormitorios", dormitorios);
    if (banheiros) params.append("banheiros", banheiros);
    if (vagas) params.append("vagas", vagas);
    if (valorMin) params.append("valorMin", valorMin);
    if (valorMax) params.append("valorMax", valorMax);
    if (ordenar) params.append("ordenar", ordenar);
    if (limite) params.append("limite", limite);

    let container = document.getElementById("z3-imoveis");

    if (!container) {
        container = document.createElement("section");
        container.id = "z3-imoveis";
        document.currentScript.parentNode.insertBefore(container, document.currentScript);
    }

    container.innerHTML = `
        <div class="z3-loading">
            Carregando imóveis...
        </div>
    `;

    try {

        const resposta = await fetch(`${API_URL}/api/imoveis?${params.toString()}`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar imóveis.");
        }

        const imoveis = await resposta.json();

        if (!imoveis.length) {

            container.innerHTML = `
                <div class="z3-empty">
                    Nenhum imóvel encontrado.
                </div>
            `;

            return;

        }

        let html = "";

        imoveis.forEach(imovel => {

            const imagem = imovel.imagem && imovel.imagem !== ""
                ? imovel.imagem
                : "https://placehold.co/800x600/f4f4f4/999999?text=Sem+Imagem";

            const valor = Number(imovel.valor) > 0
                ? Number(imovel.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })
                : "Sob consulta";

            const badgeClass = (imovel.finalidade || "").toLowerCase().includes("loc")
                ? "z3-badge aluguel"
                : "z3-badge venda";

            html += `

            <a
                href="${imovel.link}"
                target="_blank"
                rel="noopener noreferrer"
                class="z3-card"
            >

                <div class="z3-image">

                    <img
                        src="${imagem}"
                        alt="${imovel.titulo}"
                        loading="lazy"
                    >

                    <span class="${badgeClass}">
                        ${imovel.finalidade || "Venda"}
                    </span>

                </div>

                <div class="z3-info">

                    <h3>${imovel.titulo}</h3>

                    <p class="z3-local">

                        ${imovel.bairro}
                        ${imovel.cidade ? "• " + imovel.cidade : ""}

                    </p>

                    <div class="z3-icons">

                        <span>

                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M3 11V7a2 2 0 012-2h14a2 2 0 012 2v9h-2v2h-2v-2H7v2H5v-2H3v-5zm2-2h14V7H5v2zm0 5h3v-2H5v2zm11 0h3v-2h-3v2z"/>
                            </svg>

                            ${imovel.dormitorios || 0}

                        </span>

                        <span>

                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M7 21V10h10v11h2V8H5v13h2zm2-9h6v7H9v-7z"/>
                            </svg>

                            ${imovel.banheiros || 0}

                        </span>

                        <span>

                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M5 11l1-4h12l1 4h1a2 2 0 012 2v5h-2v2h-2v-2H6v2H4v-2H2v-5a2 2 0 012-2h1zm2-2h10l-.5-2h-9L7 9zm1 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                            </svg>

                            ${imovel.vagas || 0}

                        </span>

                        <span>

                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 4v-4h2v6h-6v-2h4z"/>
                            </svg>

                            ${imovel.area || "-"}

                            m²

                        </span>

                    </div>

                    <strong>

                        ${valor}

                    </strong>

                    <button class="z3-btn">

                        Ver detalhes

                    </button>

                </div>

            </a>

            `;

        });

        container.innerHTML = html;

    } catch (erro) {

        console.error(erro);

        container.innerHTML = `
            <div class="z3-error">
                Não foi possível carregar os imóveis.
            </div>
        `;

    }

})();