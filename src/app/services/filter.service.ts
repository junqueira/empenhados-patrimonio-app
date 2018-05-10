import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UtilsService } from './utils.service';

interface Patrimonio {
  patrimonio_eleicao_1: Number;
  patrimonio_eleicao_2: Number;
  nome_urna: String;
  unidade_eleitoral: String;
  cargo_pleiteado_1: String;
  cargo_pleiteado_2: String;
  ano_um: Number;
  resultado_1: String;
  resultado_2: String;
}

@Injectable()
export class FilterService {

  private estadoSelecionado = new BehaviorSubject<string>("default message");
  estadoAtual = this.estadoSelecionado.asObservable();

  cargoSelecionado: String;
  anoUm: Number;
  situacao: String;
  dadosPatrimonio: any;

  constructor(private utilsService: UtilsService) { }

  mudaEstado(novoEstado: string) {
    this.estadoSelecionado.next(novoEstado);
  }

  mudaCargo(novoCargo: String){
    this.cargoSelecionado = novoCargo;
  }

  mudaAno(novoAno: Number){    
    this.anoUm = Number(novoAno);    
  }

  mudaSituacao(novaSituacao: String){
    this.situacao = novaSituacao;
  }

  mudaDados(estado: String, ano: Number, cargo: String, situacao: String){
    let dadosBD;        
    this.utilsService.recuperaPatrimonios(estado, ano, cargo, situacao).subscribe(
      data => {
        dadosBD = data;
        this.dadosPatrimonio = this.parseData(dadosBD);
      }, err => {
        console.log(err);
      }
    );
  }

  private parseData(data: any[]): Patrimonio[] {
    return data.map(v => <Patrimonio>{patrimonio_eleicao_1: v.patrimonio_eleicao_1, patrimonio_eleicao_2: v.patrimonio_eleicao_2, 
      nome_urna: v.nome_urna, unidade_eleitoral: v.unidade_eleitoral, cargo_pleiteado_1: v.cargo_pleiteado_1, 
      cargo_pleiteado_2: v.cargo_pleiteado_2, ano_um: v.ano_um, resultado_1: v.resultado_1, resultado_2: v.resultado_2});
  }

}
