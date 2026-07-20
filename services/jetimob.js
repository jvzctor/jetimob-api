const axios = require("axios");

const api = axios.create({
    baseURL: `https://api.jetimob.com/webservice/${process.env.JETIMOB_KEY}`
});

async function listarImoveis() {

    const resposta = await api.get("/imoveis/todos?v=6&page=1&pageSize=100");

    return resposta.data.data.map(imovel => ({
    codigo: imovel.codigo,
    titulo: imovel.titulo_anuncio,
    cidade: imovel.endereco_cidade,
    bairro: imovel.endereco_bairro,
    valor: imovel.valor_venda,
    imagem: imovel.imagens?.length ? imovel.imagens[0].link : "",
    dormitorios: imovel.dormitorios,
    banheiros: imovel.banheiros,
    vagas: imovel.vagas,
    area: imovel.area_privativa,
    tipo: imovel.tipo,
    finalidade: imovel.finalidade,
    link: imovel.link
}));

}

module.exports = {
    listarImoveis
};