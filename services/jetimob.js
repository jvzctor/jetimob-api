const axios = require("axios");

const api = axios.create({
    baseURL: `https://api.jetimob.com/webservice/${process.env.JETIMOB_KEY}`
});

async function listarImoveis(filtros = {}) {

    const resposta = await api.get("/imoveis/todos?v=6&page=1&pageSize=100");

    const primeiro = resposta.data.data[0];

console.log("=== CAMPOS DA JETIMOB ===");
Object.entries(primeiro).forEach(([chave, valor]) => {

    if (chave.toLowerCase().includes("desc")) {

        console.log(chave, "=>", valor);

    }

});

    let imoveis = resposta.data.data.map(imovel => ({
    codigo: imovel.codigo,

    titulo: imovel.titulo_anuncio,

    descricao: imovel.descricao || "",

    cidade: imovel.endereco_cidade,

    bairro: imovel.endereco_bairro,

    endereco: imovel.endereco || "",

    valor: imovel.valor_venda,

    valorLocacao: imovel.valor_locacao,

    dormitorios: imovel.dormitorios,

    suites: imovel.suites,

    banheiros: imovel.banheiros,

    vagas: imovel.vagas,

    area: imovel.area_privativa,

    areaTotal: imovel.area_total,

    tipo: imovel.tipo,

    finalidade: imovel.finalidade,

    condominio: imovel.valor_condominio,

    iptu: imovel.valor_iptu,

    caracteristicas: imovel.caracteristicas || [],

    latitude: imovel.latitude,

    longitude: imovel.longitude,

    link: imovel.link,

    imagem:
        imovel.imagens?.length
            ? imovel.imagens[0].link
            : "",

    imagens:
        imovel.imagens?.map(img => img.link) || []
}));

    // Cidade
    if (filtros.cidade) {
        imoveis = imoveis.filter(i =>
            (i.cidade || "").toLowerCase().includes(filtros.cidade.toLowerCase())
        );
    }

    // Bairro
    if (filtros.bairro) {
        imoveis = imoveis.filter(i =>
            (i.bairro || "").toLowerCase().includes(filtros.bairro.toLowerCase())
        );
    }

    // Tipo
    if (filtros.tipo) {
        imoveis = imoveis.filter(i =>
            (i.tipo || "").toLowerCase().includes(filtros.tipo.toLowerCase())
        );
    }

    // Finalidade
    if (filtros.finalidade) {
        imoveis = imoveis.filter(i =>
            (i.finalidade || "").toLowerCase().includes(filtros.finalidade.toLowerCase())
        );
    }

    // Dormitórios mínimos
    if (filtros.dormitorios) {
        imoveis = imoveis.filter(i =>
            Number(i.dormitorios) >= Number(filtros.dormitorios)
        );
    }

    // Banheiros mínimos
    if (filtros.banheiros) {
        imoveis = imoveis.filter(i =>
            Number(i.banheiros) >= Number(filtros.banheiros)
        );
    }

    // Vagas mínimas
    if (filtros.vagas) {
        imoveis = imoveis.filter(i =>
            Number(i.vagas) >= Number(filtros.vagas)
        );
    }

    // Valor mínimo
    if (filtros.valorMin) {
        imoveis = imoveis.filter(i =>
            Number(i.valor) >= Number(filtros.valorMin)
        );
    }

    // Valor máximo
    if (filtros.valorMax) {
        imoveis = imoveis.filter(i =>
            Number(i.valor) <= Number(filtros.valorMax)
        );
    }

    // Ordenação
    switch (filtros.ordenar) {

        case "menor-preco":
            imoveis.sort((a, b) => a.valor - b.valor);
            break;

        case "maior-preco":
            imoveis.sort((a, b) => b.valor - a.valor);
            break;

        case "cidade":
            imoveis.sort((a, b) => a.cidade.localeCompare(b.cidade));
            break;

    }

    const limite = Number(filtros.limite || 100);

    return imoveis.slice(0, limite);

}

async function buscarImovel(codigo) {

    const imoveis = await listarImoveis();

    return imoveis.find(i => i.codigo == codigo);

}

module.exports = {
    listarImoveis,
    buscarImovel
};