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
    const limite = script?.dataset.limite || 100;

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
        container = document.createElement("div");
        container.id = "z3-imoveis";
        document.currentScript.parentNode.insertBefore(container, document.currentScript);
    }

    try {

        const resposta = await fetch(
            `${API_URL}/api/imoveis?${params.toString()}`
        );

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

            html += `
                <a href="${imovel.link}" target="_blank" class="z3-card">

                    <img
                        src="${imovel.imagem}"
                        alt="${imovel.titulo}"
                        loading="lazy"
                    >

                    <div class="z3-info">

                        <h3>${imovel.titulo}</h3>

                        <p>${imovel.bairro} - ${imovel.cidade}</p>

                        <strong>
                            ${Number(imovel.valor).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </strong>

                        <button class="z3-btn">
                            Ver imóvel
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