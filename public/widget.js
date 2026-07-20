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
            ${Number(imovel.valor).toLocaleString("pt-BR",{
                style:"currency",
                currency:"BRL"
            })}
        </strong>

        <button class="z3-btn">
            Ver imóvel
        </button>

    </div>

</a>
`;