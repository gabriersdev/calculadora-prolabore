export default class Util {
  static verifyCPF(cpf) {
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[\s.-]*/gim, '');
    if (cpf.length !== 11) return false;
    if (cpf === '00000000000') return false;
    if (cpf.split('').every((v) => v === cpf.split[0])) return false;
    let sum = 0;
    let rest;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }
  
  static verifyCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    const calcDigit = (cnpj, positions) => {
      let sum = 0;
      
      for (let i = 0; i < positions.length; i++) {
        sum += parseInt(cnpj[i], 10) * positions[i];
      }
      
      let rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };
    
    const positions1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const positions2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    const digit1 = calcDigit(cnpj, positions1);
    const digit2 = calcDigit(cnpj + digit1, positions2);
    
    return cnpj.endsWith(`${digit1}${digit2}`);
  }
}