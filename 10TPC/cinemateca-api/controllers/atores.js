var Atores = module.exports;
const axios = require("axios");

function normalize(response) {
  return response.results.bindings.map((obj) =>
    Object.entries(obj).reduce(
      (new_obj, [k, v]) => ((new_obj[k] = v.value), new_obj),
      new Object()
    )
  );
}

function myNormalize(r) {
  return r.results.bindings.map((o) => {
    var novo = {};
    for (let [k, v] of Object.entries(o)) {
      novo[k] = v.value;
    }
    return novo;
  });
}

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX c: <http://www.di.uminho.pt/prc2020/2020/2/cinema#>
`;

var getLink = "http://localhost:7200/repositories/cinema2" + "?query=";

Atores.getLista = async function () {
  var query = `PREFIX c: <http://www.di.uminho.pt/prc2020/2020/2/cinema#>
  select ?a ?nome ?sexo where { 
      ?a a c:Ator.
      ?a c:nome ?nome.
      ?a c:sexo ?sexo.
  } order by ?nome `;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

Atores.getPersonagensDoAtor = async function (idAtor) {
  var query = `select ?p ?pnome ?idPersonagem where {
    c:${idAtor} c:representa ?p.
    ?p c:nome ?pnome .
    bind(strafter(str(?a),'cinema#') as ?idPersonagem) .
} order by ?pnome  `;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

Atores.getFilmesDoAtor = async function (idAtor) {
  var query = `select  ?f ?idFilme ?titulo where {
    ?f c:temAtor c:${idAtor} .
    ?f c:títuloOriginal ?titulo.
    bind(strafter(str(?a),'cinema#') as ?idFilme)
} order by ?titulo  `;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

async function getAtorAtomica(idAtor) {
  var query = `select ?nome ?sexo where {
        c:${idAtor} a c:Ator .
        c:${idAtor} c:nome ?nome .
        c:${idAtor} c:sexo ?sexo .
    } `;
  var encoded = encodeURIComponent(prefixes + query);
  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
}

Atores.getAtor = async function (idAtor) {
  try {
    var atomica = await getAtorAtomica(idAtor);
    var filmes = await Atores.getFilmesDoAtor(idAtor);
    var personagens = await Atores.getPersonagensDoAtor(idAtor);

    var filme = {
      info: atomica[0],
      filmes: filmes,
      personagens: personagens,
    };
    return filme;
  } catch (e) {
    throw e;
  }
};
