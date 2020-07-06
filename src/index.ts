// O peso da mochila está por default 25kg pra facilitar os calculos
/* Os valores de "valores", "pesos" e a quantidade de bit de cada 
 individuo da população têm que ter o mesmo tamanho */

import Core from "./app/core";

let main = () => {
  // valores de cada objeto
  let valores = [5, 4, 7, 8, 4, 4, 6, 1];
  // pesos de cada objeto
  let pesos = [3, 3, 2, 4, 2, 3, 5, 8];
  // gerações a serem exploradas
  let geracoes = 20;
  // população inical
  let populacao = [
    "10100110",
    "11101110",
    "10110100",
    "11110110",
    "10110110",
    "10110000",
    "10111110",
    "11100100",
    "11101111",
    "10110111",
    "10110011",
    "10100111",
  ];

  let algGen = new Core(valores, pesos);

  let contGeracao = 1;

  while (contGeracao <= geracoes) {
    console.log("===============================================");
    console.log(`------------------Geração #${contGeracao}-------------------`);
    console.log("===============================================");

    algGen.getAndSetNovaPopulacao(populacao);
    populacao = algGen.geraNovaPopulacao();
    contGeracao++;
  }
};

main();
