const express = require("express");
const router = express.Router();

const {
    listarImoveis,
    buscarImovel
} = require("../services/jetimob");

router.get("/", async (req, res) => {

    try {

       const filtros = {
    cidade: req.query.cidade,
    bairro: req.query.bairro,
    tipo: req.query.tipo,
    finalidade: req.query.finalidade,
    dormitorios: req.query.dormitorios,
    banheiros: req.query.banheiros,
    vagas: req.query.vagas,
    valorMin: req.query.valorMin,
    valorMax: req.query.valorMax,
    ordenar: req.query.ordenar,
    limite: req.query.limite
};

        const imoveis = await listarImoveis(filtros);

        res.json(imoveis);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar imóveis."
        });

    }

});

router.get("/:codigo", async (req, res) => {

    try {

        const imovel = await buscarImovel(req.params.codigo);

        if (!imovel) {
            return res.status(404).json({
                erro: "Imóvel não encontrado."
            });
        }

        res.json(imovel);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar imóvel."
        });

    }

});

module.exports = router;