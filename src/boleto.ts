/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
export class Boleto {
  private _barCode: string;
  private _amount: number;
  private _bankCode: string;
  private _currencyCode: string;
  private _verifierDigit: string;
  private _expirationDate: Date = new Date(1997, 9, 7);
  private baseDate = new Date(1997, 9, 7);

  constructor(line: string) {
    if (!/^\d+$/.test(line)) {
      throw new Error('Line must contain only numbers');
    }
    if (line.length !== 47) {
      throw new Error('Invalid line length');
    }
    this.extractData(line);
    this.calculateVerifierDigitMod11();
  }

  private extractData(line: string) {
    this._bankCode = line.substring(0, 3);
    this._currencyCode = line.substring(3, 4);
    const barCodeFrom20to24 = line.substring(4, 9);
    const field1VerifierDigit = line.substring(9, 10);
    const barCodeFrom25to34 = line.substring(10, 20);
    const field2VerifierDigit = line.substring(20, 21);
    const barCodeFrom35to44 = line.substring(21, 31);
    const field3VerifierDigit = line.substring(31, 32);
    this._verifierDigit = line.substring(32, 33);
    const factor = line.substring(33, 37);
    this.setExpirationDate(factor);
    const amount = line.substring(37);
    this._amount = Number(amount);
    // const generatedLine = `${bankCode}${currencyCode}${barCodeFrom20to24}${field1VerifierDigit}${barCodeFrom25to34}${field2VerifierDigit}${barCodeFrom35to44}${field3VerifierDigit}${field4VerifierDigit}${factor}${amount}`;
    const barCode = `${this._bankCode}${this._currencyCode}${this._verifierDigit}${factor}${amount}${barCodeFrom20to24}${barCodeFrom25to34}${barCodeFrom35to44}`;
    const field1 = `${this._bankCode}${this._currencyCode}${barCodeFrom20to24}${field1VerifierDigit}`;
    const field2 = `${barCodeFrom25to34}${field2VerifierDigit}`;
    const field3 = `${barCodeFrom35to44}${field3VerifierDigit}`;
    // const field5 = `${factor}${amount}`;
    this.calculateVerifierDigitMod10(field1);
    this.calculateVerifierDigitMod10(field2);
    this.calculateVerifierDigitMod10(field3);
    this._barCode = barCode;
  }

  private setExpirationDate(factor: string) {
    this._expirationDate.setDate(this.baseDate.getDate() + Number(factor));
  }

  private calculateVerifierDigitMod10(field: string) {
    const reversedField = field.slice(0, -1).split('').reverse();
    let weight = 2;
    const sum = reversedField.reduce((acc, curr) => {
      const digit = Number(curr);
      let result = weight * digit;
      if (result > 9) {
        const [a, b] = result.toString().split('');
        result = Number(a) + Number(b);
      }
      weight = weight === 2 ? 1 : 2;
      acc += result;
      return acc;
    }, 0);
    const verifierDigit = Math.ceil(sum / 10) * 10 - sum;
    if (verifierDigit !== Number(field.at(-1))) {
      throw new Error('Invalid verifier digit');
    }
  }

  private calculateVerifierDigitMod11(): void {
    let weight = 2;
    const barCode = this._barCode.split('').reverse();
    const sum = barCode.reduce((acc, curr, index) => {
      if (index !== 39) {
        acc += Number(curr) * weight;
        weight++;
      }
      if (weight > 9) weight = 2;
      return acc;
    }, 0);
    const mod11 = sum % 11;
    let verifierDigit = 11 - mod11;
    if (verifierDigit === 10 || verifierDigit === 11 || verifierDigit === 0) {
      verifierDigit = 1;
    }
    if (Number(this._verifierDigit) !== verifierDigit) {
      throw new Error('Invalid verifier digit');
    }
  }

  get barCode(): string {
    return this._barCode;
  }

  get amount(): number {
    return this._amount;
  }

  get bakCode(): string {
    return this._bankCode;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get verifierDigit(): string {
    return this._verifierDigit;
  }

  get expirationDate(): Date {
    return this._expirationDate;
  }
}
