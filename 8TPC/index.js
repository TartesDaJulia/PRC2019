var express = require("express");
var router = express.Router();
var Filmes = require("../controllers/filmes");
var Atores = require("../controllers/atores");
var Personagens = require("../controllers/personagens");

/* GET home page. */
router.get("/filmes", function(req, res, next) {
  Filmes.getLista()
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).send(`Erro na listagem de filmes: ${e}`));
});

router.get("/atores", function(req, res, next) {
  Atores.getLista()
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).send(`Erro na listagem de atores: ${e}`));
});

router.get("/personagens", function(req, res, next) {
  Personagens.getLista()
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).send(`Erro na listagem de personagens: ${e}`));
});

module.exports = router;
