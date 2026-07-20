const API = "https://jetimob-api-1.onrender.com/api/imoveis";

const lista = document.getElementById("lista-imoveis");
const contador = document.getElementById("contador");

async function carregarImoveis() {

    try {

        contador.innerHTML = "Carregando imóveis...";

        const response = await fetch(API);

        const imoveis = await response.json();

        contador.innerHTML = `${imoveis.length} imóveis encontrados`;

        lista.innerHTML = "";

        imoveis.forEach(imovel => {

            lista.innerHTML += `
                <div style="
                    border:1px solid #ddd;
                    margin-bottom:20px;
                    padding:15px;
                    border-radius:10px;
                ">

                    <img
                        src="${imovel.imagem}"
                        style="width:100%;height:220px;object-fit:cover;">

                    <h3>${imovel.titulo}</h3>

                    <p>${imovel.bairro} - ${imovel.cidade}</p>

                    <h2>
                        R$ ${Number(imovel.valor).toLocaleString("pt-BR")}
                    </h2>

                </div>
            `;

        });

    } catch (erro) {

        console.error(erro);

        contador.innerHTML = "Erro ao carregar imóveis.";

    }

}

carregarImoveis();