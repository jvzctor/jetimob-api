const express = require("express");
const router = express.Router();

const { listarImoveis } = require("../services/jetimob");

router.get("/", async (req, res) => {

    try {

        const imoveis = await listarImoveis();

        res.json(imoveis);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar imóveis."
        });

    }

});

module.exports = router;