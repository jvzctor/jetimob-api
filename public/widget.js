/* ==========================================================
   Z3 WIDGET IMÓVEIS V5
   Desenvolvido para Nil Imóveis
========================================================== */

(async () => {

    const script = document.currentScript;

    const API = "https://jetimob-api-1.onrender.com/api/imoveis";

    /* ==========================
       PARÂMETROS
    ========================== */

    const filtros = {

        limite: script.dataset.limite || 6,
        cidade: script.dataset.cidade || "",
        bairro: script.dataset.bairro || "",
        tipo: script.dataset.tipo || "",
        finalidade: script.dataset.finalidade || "",
        dormitorios: script.dataset.dormitorios || "",
        banheiros: script.dataset.banheiros || "",
        vagas: script.dataset.vagas || "",
        valorMin: script.dataset.valormin || "",
        valorMax: script.dataset.valormax || "",
        ordenar: script.dataset.ordenar || ""

    };

    /* ==========================
       CONTAINER
    ========================== */

    const container = document.createElement("section");

    container.id = "z3-imoveis";

    script.parentNode.insertBefore(
        container,
        script.nextSibling
    );

    /* ==========================
       SKELETON
    ========================== */

    container.innerHTML = `
        <div class="z3-loading">

            ${Array(6).fill("").map(() => `

                <div class="z3-skeleton">

                    <div class="z3-skeleton-image"></div>

                    <div class="z3-skeleton-body">

                        <div class="z3-line"></div>
                        <div class="z3-line"></div>
                        <div class="z3-line"></div>
                        <div class="z3-line"></div>

                    </div>

                </div>

            `).join("")}

        </div>
    `;

    /* ==========================
       URL
    ========================== */

    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {

        if (value !== "")
            params.append(key, value);

    });

    try {

        const resposta = await fetch(
            `${API}?${params.toString()}`
        );

        if (!resposta.ok)
            throw new Error("Erro na API");

        const imoveis = await resposta.json();

        renderizar(imoveis);

    }

    catch (erro) {

        console.error(erro);

        container.innerHTML = `

            <div class="z3-error">

                Não foi possível carregar os imóveis.

            </div>

        `;

    }

    /* ==========================================================
       RENDER
    ========================================================== */

    function renderizar(lista){

        if(!lista.length){

            container.innerHTML=`

                <div class="z3-error">

                    Nenhum imóvel encontrado.

                </div>

            `;

            return;

        }

        container.innerHTML="";

        lista.forEach(imovel=>{

            const card=document.createElement("a");

            card.className="z3-card";

            card.target="_blank";

            card.rel="noopener";

            card.href=imovel.link || "#";

            
            /* ==========================
               TAG
            ========================== */

            const tag =
                imovel.finalidade ||
                imovel.tipo ||
                "Imóvel";

            const imagem =
                imovel.imagem && imovel.imagem.length
                    ? imovel.imagem
                    : "https://placehold.co/800x600?text=Sem+Imagem";

            const valor = Number(imovel.valor || 0)
                .toLocaleString("pt-BR",{
                    minimumFractionDigits:0
                });

            card.innerHTML = `

                <div class="z3-image">

                    <span class="z3-tag">

                        ${tag}

                    </span>

                    <img
                        src="${imagem}"
                        loading="lazy"
                        alt="${imovel.titulo}"
                    >

                </div>

                <div class="z3-info">

                    <div class="z3-title">

                        ${imovel.titulo || "Imóvel"}

                    </div>

                    <div class="z3-location">

                        <svg viewBox="0 0 24 24">

                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>

                        </svg>

                        ${imovel.bairro || ""}

                        ${imovel.bairro && imovel.cidade ? " • " : ""}

                        ${imovel.cidade || ""}

                    </div>

                    <div class="z3-features">

                        <div class="z3-feature">

                            <svg viewBox="0 0 24 24">

                                <path d="M3 10V5h18v14h-2v-3H5v3H3zm2 4h14v-4H5zm2-7h4v2H7zm6 0h4v2h-4z"/>

                            </svg>

                            <strong>

                                ${imovel.dormitorios || 0}

                            </strong>

                            <span>

                                Quartos

                            </span>

                        </div>

                        <div class="z3-feature">

                            <svg viewBox="0 0 24 24">

                                <path d="M7 21V12h10v9h2V3H5v18zm3-7h4v5h-4z"/>

                            </svg>

                            <strong>

                                ${imovel.banheiros || 0}

                            </strong>

                            <span>

                                Banheiros

                            </span>

                        </div>

                        <div class="z3-feature">

                            <svg viewBox="0 0 24 24">

                                <path d="M5 11h14l1 4v4h-2v-2H6v2H4v-4zm2-4h10l2 3H5z"/>

                            </svg>

                            <strong>

                                ${imovel.vagas || 0}

                            </strong>

                            <span>

                                Vagas

                            </span>

                        </div>

                        <div class="z3-feature">

                            <svg viewBox="0 0 24 24">

                                <path d="M4 4h7v2H6v5H4zm10 0h6v7h-2V6h-4zM4 13h2v5h5v2H4zm14 0h2v7h-7v-2h5z"/>

                            </svg>

                            <strong>

                                ${imovel.area || "--"}

                            </strong>

                            <span>

                                m²

                            </span>

                        </div>

                    </div>

                    <div class="z3-price">

                        <small>

                            Valor do imóvel

                        </small>

                        <strong>

                            R$ ${valor}

                        </strong>

                    </div>

                    <button
                        class="z3-btn"
                        type="button">

                        Ver detalhes

                    </button>

                </div>

            `;

            container.appendChild(card);

        });

        
        /* ==========================
           ANIMAÇÃO DE ENTRADA
        ========================== */

        requestAnimationFrame(() => {

            const cards =
                container.querySelectorAll(".z3-card");

            cards.forEach((card, index) => {

                card.style.opacity = "0";
                card.style.transform = "translateY(30px)";

                setTimeout(() => {

                    card.style.transition =
                        "all .45s ease";

                    card.style.opacity = "1";
                    card.style.transform =
                        "translateY(0)";

                }, index * 80);

            });

        });

    }

})();