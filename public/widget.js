/* ==========================================================
   Z3 WIDGET IMÓVEIS V6
   Desenvolvido por Z3 Commerce
   ========================================================== */

(() => {

    "use strict";

    const API = "https://jetimob-api-1.onrender.com/api/imoveis";

    const WHATSAPP = "5554997010512";

    const script = document.currentScript;

    if (!script) return;

    /* ==========================================================
       CONFIGURAÇÕES
    ========================================================== */

    const config = {

        limite: Number(script.dataset.limite || 6),

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

    /* ==========================================================
       CONTAINER
    ========================================================== */

    const container = document.createElement("section");

    container.id = "z3-imoveis";

    script.insertAdjacentElement("afterend", container);

    /* ==========================================================
       HELPERS
    ========================================================== */

    const money = valor =>

        Number(valor || 0).toLocaleString("pt-BR", {
            minimumFractionDigits: 0
        });

    const texto = valor =>

        valor && String(valor).trim().length
            ? valor
            : "--";

    const imagem = item => {

        if (item.imagem && item.imagem.length)
            return item.imagem;

        if (item.foto && item.foto.length)
            return item.foto;

        return "https://placehold.co/900x600?text=Sem+Imagem";

    };

    const montarMensagem = item => {

        return encodeURIComponent(

`Olá!

Tenho interesse neste imóvel.

🏠 ${texto(item.titulo)}

📍 ${texto(item.bairro)} - ${texto(item.cidade)}

💰 Valor: R$ ${money(item.valor)}

Gostaria de falar com um corretor.`

        );

    };

    /* ==========================================================
       LOADING
    ========================================================== */

    function loading(){

        container.innerHTML = `

            <div class="z3-loading">

                ${Array(config.limite).fill("").map(() => `

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

    }

    /* ==========================================================
       API
    ========================================================== */

    async function carregar(){

        loading();

        const params = new URLSearchParams();

        Object.entries(config).forEach(([chave, valor]) => {

            if (
                valor !== "" &&
                valor !== null &&
                valor !== undefined
            ){
                params.append(chave, valor);
            }

        });

        try{

            const resposta = await fetch(
                `${API}?${params.toString()}`
            );

            if(!resposta.ok)
                throw new Error("Erro ao consultar API.");

            const lista = await resposta.json();

            render(lista);

        }

        catch(error){

            console.error(error);

            container.innerHTML = `

                <div class="z3-error">

                    Não foi possível carregar os imóveis.

                </div>

            `;

        }

    }
    /* ==========================================================
       RENDER
    ========================================================== */

    function render(lista){

        if(!Array.isArray(lista) || lista.length === 0){

            container.innerHTML = `

                <div class="z3-error">

                    Nenhum imóvel encontrado.

                </div>

            `;

            return;

        }

        container.innerHTML = "";

        lista.forEach((item,index)=>{

            const card = document.createElement("a");

            card.className = "z3-card";

            card.target = "_blank";

            card.rel = "noopener";

            card.href =
                `https://wa.me/${WHATSAPP}?text=${montarMensagem(item)}`;

            const tag =
                item.finalidade ||
                item.tipo ||
                "Imóvel";

            const foto = imagem(item);

            const html = `

                <div class="z3-image">

                    <span class="z3-tag">

                        ${tag}

                    </span>

                    <img
                        src="${foto}"
                        loading="lazy"
                        alt="${texto(item.titulo)}"
                    >

                </div>

                <div class="z3-info">

                    <div class="z3-title">

                        ${texto(item.titulo)}

                    </div>

                    <div class="z3-location">

                        <svg viewBox="0 0 24 24">

                            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9a2 2 0 100-4 2 2 0 000 4z"/>

                        </svg>

                        ${texto(item.bairro)}

                        ${item.cidade ? " • " : ""}

                        ${texto(item.cidade)}

                    </div>

                    <div class="z3-features">

                        <div class="z3-feature">

                            <svg viewBox="0 0 24 24">

                                <path d="M3 10V5h18v14h-2v-3H5v3H3zm2 4h14v-4H5zm2-7h4v2H7zm6 0h4v2h-4z"/>

                            </svg>

                            <strong>

                                ${item.dormitorios || 0}

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

                                ${item.banheiros || 0}

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

                                ${item.vagas || 0}

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

                                ${item.area || "--"}

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

                            R$ ${money(item.valor)}

                        </strong>

                    </div>

                    <button
                        class="z3-btn"
                        type="button">

                        💬 Falar com um corretor

                    </button>

                </div>

            `;

            card.innerHTML = html;

            card.style.opacity = "0";

            card.style.transform = "translateY(25px)";

            container.appendChild(card);

            requestAnimationFrame(()=>{

                setTimeout(()=>{

                    card.style.transition =
                        ".45s ease";

                    card.style.opacity = "1";

                    card.style.transform =
                        "translateY(0)";

                },index*80);

            });

        });

    }
        /* ==========================================================
       OBSERVADORES
    ========================================================== */

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("z3-visible");

                observer.unobserve(entry.target);

            }

        });

    },{
        threshold:.15
    });

    function observarCards(){

        container
            .querySelectorAll(".z3-card")
            .forEach(card=>observer.observe(card));

    }

    /* ==========================================================
       REFRESH
    ========================================================== */

    const atualizar = async()=>{

        try{

            await carregar();

            observarCards();

        }

        catch(e){

            console.error(e);

        }

    };

    /* ==========================================================
       AUTO REFRESH OPCIONAL
    ========================================================== */

    if(script.dataset.refresh){

        const tempo =
            Number(script.dataset.refresh) * 1000;

        if(tempo > 0){

            setInterval(atualizar,tempo);

        }

    }

    /* ==========================================================
       START
    ========================================================== */

    atualizar();

})();