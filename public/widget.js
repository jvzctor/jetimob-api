(async () => {

    const API_URL = "https://jetimob-api-1.onrender.com";

    // Localiza o script em qualquer plataforma
    const script =
        document.currentScript ||
        [...document.querySelectorAll('script[src*="widget.js"]')].pop();

    // Lê os atributos data-*
    const dataset = script ? script.dataset : {};

    const params = new URLSearchParams();

    [
        "cidade",
        "bairro",
        "tipo",
        "finalidade",
        "dormitorios",
        "banheiros",
        "vagas",
        "valorMin",
        "valorMax",
        "ordenar",
        "limite"
    ].forEach(chave => {

        const valor = dataset[chave.toLowerCase()] || dataset[chave];

        if (valor) {

            params.append(chave, valor);

        }

    });

    let container = document.getElementById("z3-imoveis");

    if (!container) {

        container = document.createElement("section");
        container.id = "z3-imoveis";

        if (script?.parentNode) {

            script.parentNode.insertBefore(container, script);

        } else {

            document.body.appendChild(container);

        }

    }

    container.innerHTML = `
        <div class="z3-loading">
            Carregando imóveis...
        </div>
    `;

    function moeda(valor) {

        if (!Number(valor)) return "Sob consulta";

        return Number(valor).toLocaleString("pt-BR", {

            style: "currency",
            currency: "BRL"

        });

    }

    function imagem(imovel){

        if(imovel.imagem && imovel.imagem.length){

            return imovel.imagem;

        }

        return "https://placehold.co/900x600/f5f5f5/999999?text=Sem+Imagem";

    }

    function badge(imovel){

        const finalidade = imovel.finalidade || "Venda";

        return {

            texto: finalidade,

            classe: finalidade.toLowerCase().includes("loc")

                ? "z3-badge aluguel"

                : "z3-badge venda"

        };

    }

    function link(imovel){

        return imovel.link || "#";

    }

    try{

        const resposta = await fetch(

            `${API_URL}/api/imoveis?${params.toString()}`

        );

        if(!resposta.ok){

            throw new Error("Erro ao carregar imóveis.");

        }

        const imoveis = await resposta.json();

        if(!imoveis.length){

            container.innerHTML = `
                <div class="z3-empty">
                    Nenhum imóvel encontrado.
                </div>
            `;

            return;

        }

        let html = "";

        imoveis.forEach(imovel=>{

            const infoBadge = badge(imovel);

            html += `
                <a
                    href="${link(imovel)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="z3-card">

                    <div class="z3-image">

                        <img
                            src="${imagem(imovel)}"
                            alt="${imovel.titulo || "Imóvel"}"
                            loading="lazy">

                        <span class="${infoBadge.classe}">
                            ${infoBadge.texto}
                        </span>

                    </div>

                    <div class="z3-info">

                        <h3>

                            ${imovel.titulo || "Imóvel"}

                        </h3>

                        <p class="z3-local">

                            ${imovel.bairro || ""}

                            ${imovel.cidade ? "• "+imovel.cidade : ""}

                        </p>

                        <div class="z3-icons">

                                                    <span>

                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M3 11V7a2 2 0 012-2h14a2 2 0 012 2v9h-2v2h-2v-2H7v2H5v-2H3v-5zm2-2h14V7H5v2zm0 5h3v-2H5v2zm11 0h3v-2h-3v2z"/>
                                </svg>

                                <small>Dorm.</small>

                                <strong>${Number(imovel.dormitorios || 0)}</strong>

                            </span>

                            <span>

                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M7 21V10h10v11h2V8H5v13h2zm2-9h6v7H9v-7z"/>
                                </svg>

                                <small>Banh.</small>

                                <strong>${Number(imovel.banheiros || 0)}</strong>

                            </span>

                            <span>

                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M5 11l1-4h12l1 4h1a2 2 0 012 2v5h-2v2h-2v-2H6v2H4v-2H2v-5a2 2 0 012-2h1zm2-2h10l-.5-2h-9L7 9zm1 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                                </svg>

                                <small>Vagas</small>

                                <strong>${Number(imovel.vagas || 0)}</strong>

                            </span>

                            <span>

                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 4v-4h2v6h-6v-2h4z"/>
                                </svg>

                                <small>Área</small>

                                <strong>${Number(imovel.area || 0)} m²</strong>

                            </span>

                        </div>

                        <strong class="z3-price">

                            ${moeda(imovel.valor)}

                        </strong>

                        <button class="z3-btn">

                            Ver detalhes

                        </button>

                    </div>

                </a>

            `;

        });

        container.innerHTML = html;

    }catch(erro){

        console.error("Erro ao carregar imóveis:", erro);

        container.innerHTML = `

            <div class="z3-error">

                <h3>Não foi possível carregar os imóveis.</h3>

                <p>Tente atualizar a página novamente.</p>

            </div>

        `;

    }

})();