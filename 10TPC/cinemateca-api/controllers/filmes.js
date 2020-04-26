var Filmes = module.exports;
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

Filmes.getLista = async function (req) {
  var query = `select ?f ?idFilme ?titulo ?duracao ?data ?lingua ?pop ?res where {
        ?f a c:Filme .
        ?f c:título ?titulo .
        ?f c:duração ?duracao .
        ?f c:dataLançamento ?data .
        ?f c:línguaOriginal ?lingua .
        bind(strafter(str(?f),'cinema#') as ?idFilme) .
        ?f c:popularidade ?pop .
        ?f c:resumo ?res .
    }`;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

Filmes.getAtoresDoFilme = async function (idFilme) {
  var query = `select ?idAtor ?a ?anome where {
    c:${idFilme} c:temAtor ?a.
    ?a c:nome ?anome.
    bind(strafter(str(?a),'cinema#') as ?idAtor) .
  }`;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

Filmes.getGenerosDoFilme = async function (idFilme) {
  var query = `select ?g ?gnome ?idGenero where {
    c:${idFilme} c:temGénero ?g.
    ?g c:nome ?gnome.
    bind(strafter(str(?g),'cinema#') as ?idGenero) .
  }`;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

Filmes.getPersonagensDoFilme = async function (idFilme) {
  var query = `select ?p ?pnome ?idPersonagem where {
    c:${idFilme} c:temPersonagem ?p.
    ?p c:nome ?pnome.
    bind(strafter(str(?p),'cinema#') as ?idPersonagem) .
  }`;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
};

async function getFilmeAtomica(idFilme) {
  var query = `select ?titulo ?duracao ?data ?lingua ?pop ?res where {
      c:${idFilme} a c:Filme .
      c:${idFilme} c:título ?titulo .
      c:${idFilme} c:duração ?duracao .
      c:${idFilme} c:dataLançamento ?data .
      c:${idFilme} c:línguaOriginal ?lingua .
      c:${idFilme} c:popularidade ?pop .
      c:${idFilme} c:resumo ?res .
    }`;
  var encoded = encodeURIComponent(prefixes + query);

  try {
    var response = await axios.get(getLink + encoded);
    return myNormalize(response.data);
  } catch (e) {
    throw e;
  }
}

Filmes.getFilme = async function (idFilme) {
  try {
    var atomica = await getFilmeAtomica(idFilme);
    var generos = await Filmes.getGenerosDoFilme(idFilme);
    var atores = await Filmes.getAtoresDoFilme(idFilme);
    var personagens = await Filmes.getPersonagensDoFilme(idFilme);

    var filme = {
      info: atomica[0],
      generos: generos,
      atores: atores,
      personagens: personagens,
    };
    return filme;
  } catch (e) {
    throw e;
  }
};
