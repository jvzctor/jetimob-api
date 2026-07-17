require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const api = axios.create({
    baseURL: `https://api.jetimob.com/webservice/${process.env.JETIMOB_KEY}`
});

app.get("/", (req, res) => {
    res.send("API OK");
});

app.get("/api/imoveis", async (req, res) => {

    try {

        const resposta = await api.get("/imoveis/todos?v=6&page=1&pageSize=100");

        const imoveis = resposta.data.data.map(imovel => ({

            codigo: imovel.codigo,

            titulo: imovel.titulo_anuncio,

            cidade: imovel.endereco_cidade,

            bairro: imovel.endereco_bairro,

            valor: imovel.valor_venda,

            imagem:
                imovel.imagens?.length
                    ? imovel.imagens[0].link
                    : ""

        }));

        res.json(imoveis);

    } catch (erro) {

        console.log(erro.response?.data || erro.message);

        res.status(500).json({
            erro: erro.message
        });

    }

});

app.listen(process.env.PORT || 3000, () => {

    console.log("API ONLINE");

});