export default class CalculadoraProlabore {
  constructor() {
    this.salario = 0;
    this.dependentes = 0;
    this.inss = 0;
    this.ir = 0;
    this.salarioLiquido = 0;
    
    this.aliquotaINSS = 0;
    this.aliquotaRealINSS = 0;
    this.aliquotaIRPF = 0;
    this.aliquotaRealIRPF = 0;
  }
  
  setValores(salary, deps) {
    this.salario = salary;
    this.dependentes = deps || 0;
  }
  
  calcularINSS() {
    const faixas = [
      {limite: 1518.00, aliquota: 0.075},
      {limite: 2527.48, aliquota: 0.09},
      {limite: 3362.02, aliquota: 0.12},
      {limite: 8157.41, aliquota: 0.14}
    ];
    
    const faixa = faixas.find(f => f.limite >= this.salario);
    if (faixa) this.aliquotaINSS = faixa.aliquota * 100;
    else if (this.salario > faixas[faixas.length - 1].limite) this.aliquotaINSS = faixas[faixas.length - 1].aliquota * 100;
    
    let salarioRestante = this.salario;
    let totalINSS = 0;
    
    for (let i = 0; i < faixas.length; i++) {
      const {limite, aliquota} = faixas[i];
      if (salarioRestante > 0) {
        const baseCalculo = Math.min(salarioRestante, limite - (faixas[i - 1]?.limite || 0));
        totalINSS += baseCalculo * aliquota;
        salarioRestante -= baseCalculo;
      } else {
        break;
      }
    }
    
    this.aliquotaRealINSS = (totalINSS / this.salario) * 100;
    this.inss = totalINSS;
  }
  
  calcularIR() {
    const deducaoPorDependente = 189.59;
    const maxDeducaoDependentes = 2275.08
    const totalDeducaoDependentes = (this.dependentes * deducaoPorDependente) > maxDeducaoDependentes ? maxDeducaoDependentes : this.dependentes * deducaoPorDependente;
    
    const baseCalculo = this.salario - this.inss - (totalDeducaoDependentes);
    
    const faixasIR = [
      {limite: 2112.00, aliquota: 0, deducao: 0},
      {limite: 2826.65, aliquota: 0.075, deducao: 158.40},
      {limite: 3751.05, aliquota: 0.15, deducao: 370.40},
      {limite: 4664.68, aliquota: 0.225, deducao: 651.73},
      {limite: Infinity, aliquota: 0.275, deducao: 884.96}
    ];
    
    const faixa = faixasIR.find(f => f.limite >= this.salario)
    if (faixa) this.aliquotaIRPF = faixa.aliquota * 100;
    
    for (let i = 0; i < faixasIR.length; i++) {
      const {limite, aliquota, deducao} = faixasIR[i];
      if (baseCalculo <= limite) {
        this.ir = baseCalculo * aliquota - deducao;
        break;
      }
    }
    
    this.aliquotaRealIRPF = (this.ir / this.salario) * 100;
  }
  
  calcularProlabore() {
    if (!this.salario || this.salario <= 0) {
      alert("Informe um valor válido para o pró-labore.");
      return;
    }
    
    this.calcularINSS();
    this.calcularIR();
    this.salarioLiquido = this.salario - this.inss - this.ir;
    
    return [
      [`Bruto`, `100%`, `100%`, `${this.formatValue(this.salario)}`],
      [`INSS`, `${this.aliquotaINSS.toFixed(2)}%`, `${this.aliquotaRealINSS.toFixed(2)}%`, `${this.formatValue(this.inss)}`],
      [`IR`, `${this.aliquotaIRPF.toFixed(2)}%`, `${(this.aliquotaRealIRPF).toFixed(2)}%`, `${this.formatValue(this.ir)}`],
      [`Líquido`, `${(this.salarioLiquido * 100 / this.salario).toFixed(2)}%`, `-`, `${this.formatValue(this.salarioLiquido)}`]
    ]
  }
  
  formatValue(value) {
    return new Intl.NumberFormat('pt-BR', {style: "currency", currency: "BRL", maximumFractionDigits: 2}).format(value);
  }
}