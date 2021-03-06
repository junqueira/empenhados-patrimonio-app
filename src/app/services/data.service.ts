import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { RequestService } from "./request.service";

interface Patrimonio {
  estado: String;
  patrimonio_eleicao_1: Number;
  patrimonio_eleicao_2: Number;
  nome_urna: String;
  cpf: String;
  sigla_partido: String;
  cod_unidade_eleitoral_1: String;
  cod_unidade_eleitoral_2: String;
  unidade_eleitoral: String;
  cargo_pleiteado_1: String;
  cargo_pleiteado_2: String;
  ano_um: Number;
  sequencial_candidato_1: String;
  sequencial_candidato_2: String;
  situacao_eleicao_1: String;
  situacao_eleicao_2: String;
}

interface Candidato {
  cpf_Candidato: String;
  nome_Urna_Candidato: String;
  desc_Ocupacao: String;
  desc_Unid_Eleitoral: String;
  idade_Cand_Data_Eleicao: Number;
  data_Nascimento: String;
}

interface Eleicao {
  quantidade_candidatos: Number;
  media_patrimonio: Number;
}

interface Ano {
  ano_um: Number;
}

interface IDH {
  unidade_eleitoral: String;
  IDHM_2010: Number;
}

const TODOS_CONSULTA = "todos";
const TODOS_CARGOS = "qualquer cargo";
const TODOS_ESTADOS = "qualquer estado";
const TODAS_SITUACOES = "que declararam patrimônio";

@Injectable()
export class DataService {
  private estadoSelecionado: String;
  private cargoSelecionado: String;
  private anoUm: Number;
  private situacao: String;

  private _dadosPatrimonio = new BehaviorSubject<Patrimonio[]>(undefined);
  public dadosPatrimonio = this._dadosPatrimonio.asObservable();

  private _candidatoSelecionado = new BehaviorSubject<Patrimonio[]>(undefined);
  public candidatoSelecionado = this._candidatoSelecionado.asObservable();

  private _infoCandidatoSelecionado = new BehaviorSubject<Candidato[]>(
    undefined
  );
  public infoCandidatoSelecionado = this._infoCandidatoSelecionado.asObservable();

  private _infoEleicao = new BehaviorSubject<Eleicao[]>(undefined);
  public infoEleicao = this._infoEleicao.asObservable();

  private _anos = new BehaviorSubject<Ano[]>(undefined);
  public anos = this._anos.asObservable();

  private _idh = new BehaviorSubject<IDH[]>(undefined);
  public idh = this._idh.asObservable();

  public listaAnos: any;

  constructor(private requestService: RequestService) {}

  mudaEstado(novoEstado: string) {
    this.estadoSelecionado = novoEstado;
  }

  mudaCargo(novoCargo: String) {
    this.cargoSelecionado = novoCargo;
  }

  mudaAno(novoAno: Number) {
    this.anoUm = Number(novoAno);
  }

  mudaSituacao(novaSituacao: String) {
    this.situacao = novaSituacao;
  }

  async atualizaCandidato(candidato) {
    return new Promise((resolve, reject) => {
      this._candidatoSelecionado.next(candidato);
      return resolve("Candidato Atualizado!");
    });
  }

  async mudaDados(
    estado: String,
    ano: Number,
    cargo: String,
    situacao: String,
    municipio: String
  ) {
    let dadosBD;

    if (cargo === TODOS_CARGOS) {
      cargo = TODOS_CONSULTA;
    }

    if (estado === TODOS_ESTADOS) {
      estado = TODOS_CONSULTA;
    }

    if (situacao === TODAS_SITUACOES) {
      situacao = TODOS_CONSULTA;
    }

    return new Promise((resolve, reject) =>
      this.requestService
        .recuperaPatrimonios(estado, ano, cargo, situacao, municipio)
        .subscribe(
          data => {
            dadosBD = data;
            this._dadosPatrimonio.next(this.parseData(dadosBD));
            return resolve("Dados alterados");
          },
          err => {
            console.log(err);
            return reject(err);
          }
        )
    );
  }

  async mudaInfoCandidato(ano: Number, cpf: String) {
    let dadosCandidato;

    return new Promise((resolve, reject) =>
      this.requestService.recuperaInfoCandidato(ano, cpf).subscribe(
        data => {
          dadosCandidato = data;
          this._infoCandidatoSelecionado.next(
            this.parseDataCandidato(dadosCandidato)
          );
          return resolve("Dados alterados");
        },
        err => {
          console.log(err);
          return reject(err);
        }
      )
    );
  }

  async mudaDadosEleicao(
    ano: Number,
    unidadeEleitoral: String,
    cargo: String,
    cpfCandidato: String
  ) {
    let dadosEleicao;

    return new Promise((resolve, reject) =>
      this.requestService
        .recuperaInfoEleicao(ano, unidadeEleitoral, cargo, cpfCandidato)
        .subscribe(
          data => {
            dadosEleicao = data;
            this._infoEleicao.next(this.parseDataEleicao(dadosEleicao));
            return resolve("Dados alterados");
          },
          err => {
            console.log(err);
            return reject(err);
          }
        )
    );
  }

  async mudaAnos(cargo: String) {
    let dadosAno;

    return new Promise((resolve, reject) =>
      this.requestService.recuperaAnos(cargo).subscribe(
        data => {
          dadosAno = data;
          this._anos.next(this.parseDataAno(dadosAno));
          return resolve("Anos alterados");
        },
        err => {
          console.log(err);
          return reject(err);
        }
      )
    );
  }

  async mudaIdh(cd_unidade_eleitoral: String) {
    let dadosIDH;

    return new Promise((resolve, reject) =>
      this.requestService.recuperaIDH(cd_unidade_eleitoral).subscribe(
        data => {
          dadosIDH = data;
          this._idh.next(this.parseDataIDH(dadosIDH));
          return resolve("IDH alterado");
        },
        err => {
          console.log(err);
          return reject(err);
        }
      )
    );
  }

  private parseData(data: any[]): Patrimonio[] {
    return data.map(
      v =>
        <Patrimonio>{
          estado: v.estado,
          patrimonio_eleicao_1: v.patrimonio_eleicao_1,
          patrimonio_eleicao_2: v.patrimonio_eleicao_2,
          nome_urna: v.nome_urna,
          cpf: v.cpf,
          sigla_partido: v.sigla_partido,
          cod_unidade_eleitoral_1: v.cod_unidade_eleitoral_1,
          cod_unidade_eleitoral_2: v.cod_unidade_eleitoral_2,
          unidade_eleitoral: v.unidade_eleitoral,
          cargo_pleiteado_1: v.cargo_pleiteado_1,
          cargo_pleiteado_2: v.cargo_pleiteado_2,
          ano_um: v.ano_um,
          sequencial_candidato_1: v.sequencial_candidato_1,
          sequencial_candidato_2: v.sequencial_candidato_2,
          situacao_eleicao_1: v.situacao_eleicao_1,
          situacao_eleicao_2: v.situacao_eleicao_2
        }
    );
  }

  private parseDataCandidato(data: any[]): Candidato[] {
    return data.map(
      v =>
        <Candidato>{
          cpf_Candidato: v.cpf_Candidato,
          nome_Urna_Candidato: v.nome_Urna_Candidato,
          desc_Ocupacao: v.desc_Ocupacao,
          desc_Unid_Eleitoral: v.desc_Unid_Eleitoral,
          idade_Cand_Data_Eleicao: v.idade_Cand_Data_Eleicao,
          data_Nascimento: v.data_Nascimento
        }
    );
  }

  private parseDataEleicao(data: any[]): Eleicao[] {
    return data.map(
      v =>
        <Eleicao>{
          quantidade_candidatos: v.quantidade_candidatos,
          media_patrimonio: v.media_patrimonio
        }
    );
  }

  private parseDataAno(data: any[]): Ano[] {
    return data.map(v => <Ano>{ ano_um: v.ano_um });
  }

  private parseDataIDH(data: any[]): IDH[] {
    return data.map(
      v =>
        <IDH>{ unidade_eleitoral: v.unidade_eleitoral, IDHM_2010: v.IDHM_2010 }
    );
  }

  public getTodos() {
    return TODOS_CONSULTA;
  }

  public getTodosCargos() {
    return TODOS_CARGOS;
  }

  public getTodosEstados() {
    return TODOS_ESTADOS;
  }

  public getTodasSituacoes() {
    return TODAS_SITUACOES;
  }

  public getEstado() {
    return this.estadoSelecionado;
  }

  public getAno() {
    return this.anoUm;
  }

  public getSituacao() {
    return this.situacao;
  }

  public getCargo() {
    return this.cargoSelecionado;
  }

  public getIDH() {
    return this.idh;
  }
}
