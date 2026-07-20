require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Arquivos públicos (widget.js, widget.css...)
app.use(express.static(path.join(__dirname, "public")));

// Rotas da API
app.use("/api/imoveis", require("./routes/imoveis"));

// Página inicial
app.get("/", (req, res) => {
    res.send("API ONLINE 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});