export default class Core {
  constructor(valores: number[], pesos: number[]) {
    this.valores = valores;
    this.pesos = pesos;
  }

  private valores: number[];
  private pesos: number[];
  private populacao: string[] = [];

  /**
   * define a nova população a ser analisada/modificada
   * @param _populacao
   */
  getAndSetNovaPopulacao(_populacao: string[]) {
    this.populacao = _populacao;
    console.log("População >> " + _populacao + "\n");
  }

  /**
   * utiliza o Vetor de valores para calcular a aptão retorna o valor da aptdão ou
   * retorna 0 caso o mesmo ultrapasse o peso de 25KG, calulado pela função @func validaCromossomo(dna)
   * @param dna
   */
  calcularAptidao(dna: string): number {
    let aptdao = -1;

    if (this.validaCromossomo(dna)) {
      for (let i = 0; i < dna.length; i++) {
        let aux = dna.charAt(i);
        if (aux == "1") {
          aptdao += this.valores[i];
        }
      }
    }

    return aptdao;
  }

  /**
   *
   * @param dna Utilizando o vetor global de pesos para calcula o peso.
   * Retorna um valor Booleano no caso do cromossomo ter o
   * peso menor ou igual a 25.
   */
  validaCromossomo(dna: string): boolean {
    let peso = 0;

    for (let i = 0; i < dna.length; i++) {
      let aux = dna.charAt(i);
      if (aux == "1") {
        peso += this.pesos[i];
      }
    }

    return peso <= 25;
  }

  /**
   * Função de crossover de cromossomos, pega a metade (1 parte)
   * do cromossomo c1 mais a metade (2 parte) do cromossomo c2,
   * depois o mesmo com c2 (1 parte) + c1 (2 parte)
   * @param c1 cromossomo 1
   * @param c2 cromossomo 2
   */
  crossover(c1: string, c2: string): string {
    let filho = c1.substring(0, c1.length / 2) + c2.substring(c2.length / 2);

    return filho;
  }

  /**
   * Colocar uma mutação variavel.
   * Sorteia uma posição da String e altera o valor e retorna outra String
   * @param cromossomo
   */
  mutacao(cromossomo: string): string {
    let pos = Math.round(Math.random() * cromossomo.length);

    let aux = cromossomo.split("");

    for (let i = 0; i < aux.length; i++) {
      if (i == pos) {
        if (aux[pos] == "1") {
          aux[pos] = "0";
        } else {
          aux[pos] = "1";
        }
      }
    }

    return aux.join("");
  }

  /**
   * Aplicação do crosover
   * @param idvs indivíduos
   */
  aplicaCrossover(idvs: string[]): string[] {
    let filhos: string[] = [];

    filhos.push(this.crossover(idvs[0], idvs[1]));
    filhos.push(this.crossover(idvs[1], idvs[2]));
    filhos.push(this.crossover(idvs[3], idvs[4]));
    filhos.push(this.crossover(idvs[4], idvs[3]));

    console.log("Aplicando Crossover >> " + filhos + "\n");
    return filhos;
  }

  /**
   * Aplicação da mutação
   * @param idvs indivíduos
   */
  aplicaMutacao(idvs: string[]): string[] {
    let mutacao: string[] = [];

    mutacao.push(this.mutacao(idvs[0]));
    mutacao.push(this.mutacao(idvs[1]));
    mutacao.push(this.mutacao(idvs[2]));
    mutacao.push(this.mutacao(idvs[3]));

    console.log("Aplicando Mutação >> " + mutacao + "\n");
    return mutacao;
  }

  /**
   * Descarta os individuos com aptidão -1 ou seja INVALIDO
   */
  selecaoPorAptdao(): string[][] {
    let idvs: string[][] = [];
    let cont = 0;

    console.log("Calculo de Aptidões >> ");
    for (let idv of this.populacao) {
      let apt = this.calcularAptidao(idv); //Calcula a aptdao e adiciona no array aptds
      if (apt > -1) {
        idvs.push([idv, apt.toString()]);
        console.log("[" + idv + ", " + apt + "] ");
      } else {
        cont++;
      }
    }

    console.log(
      "\nDescartados >> " + cont + " Individuos com o valor acima de 25KG\n"
    );
    return idvs;
  }

  /**
   * Aplicação da seleção por roleta
   * @param idvs indivíduos
   */
  selecaoPorRoleta(idvs: string[][]): string[] {
    let soma = 0;
    for (let apt of idvs) {
      soma += +apt[1];
    }

    //Calcula o % de probabilidade de um idv ser escolhido e imprimi no console
    console.log("Probabilidade de Escolha >>\n");
    for (let i = 0; i < idvs.length; i++) {
      idvs[i][1] = (soma / +idvs[i][1]).toFixed(8);
      console.log("[" + idvs[i][0] + ", " + idvs[i][1] + "%]\n");
    }

    //Ordena o melhores IDVS de acordo com a probabilidade de ser escolhido
    for (let i = 0; i < idvs.length; i++) {
      let a = idvs[i];
      let prob1 = +a[1];

      for (let j = i; j < idvs.length; j++) {
        let b = idvs[j];
        let prob2 = +b[1];

        if (prob2 > prob1) {
          let c = idvs[j];
          idvs.splice(j, 1);
          idvs.splice(i, 0, c);
        }
      }
    }

    let melhores: string[] = [];

    let cont = 0;
    for (let aux of idvs) {
      if (cont <= this.populacao.length / 2) {
        melhores.push(aux[0]);
        cont++;
      }
    }

    console.log("\nIndividuos Selecionados >> " + melhores + "\n");

    return melhores;
  }

  /**
   * Gerar uma nova população a cada loop definido no @func main()
   */
  geraNovaPopulacao(): string[] {
    let selecao = this.selecaoPorAptdao();
    let pais = this.selecaoPorRoleta(selecao);
    //Aplica o cross-over nos filhos
    let filhos = this.aplicaCrossover(pais);
    //Aplica a mutaçao no filhos
    let mutacao = this.aplicaMutacao(filhos);

    //Cria a nova populacao de inviduos
    let nova_populacao: string[] = [];
    nova_populacao.push(...pais);
    nova_populacao.push(...mutacao);

    console.log("Nova Populacao >> " + nova_populacao + "\n");

    return nova_populacao;
  }
}
