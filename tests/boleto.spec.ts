/* eslint-disable no-new */
import { Boleto } from '../src/boleto';

describe('Boleto', () => {
  it('should get boleto data', () => {
    const boleto = new Boleto(
      '21290001192110001210904475617405975870000002000',
    );
    expect(boleto.bakCode).toBe('212');
    expect(boleto.currencyCode).toBe('9');
    expect(boleto.verifierDigit).toBe('9');
    expect(boleto.barCode).toBe('21299758700000020000001121100012100447561740');
    expect(boleto.amount).toBe(2000);
    expect(boleto.expirationDate.getDate()).toBe(16);
    expect(boleto.expirationDate.getMonth()).toBe(6);
    expect(boleto.expirationDate.getFullYear()).toBe(2018);
  });

  it('should throw if an invalid verifier digit (mod10) is provided', () => {
    expect(() => {
      new Boleto('21290002192110001210904475617405975870000002000');
    }).toThrow();
  });

  it('should throw if an invalid verifier digit (mod11) is provided', () => {
    expect(() => {
      new Boleto('21290001192110001210904475617405875870000002000');
    }).toThrow();
  });

  it('should throw if an invalid line is provided', () => {
    expect(() => {
      new Boleto('a1290001192110001210904475617405975870000002000');
    }).toThrow();
  });

  it('should throw if an invalid line is provided (invalid length)', () => {
    expect(() => {
      new Boleto('123');
    }).toThrow();
  });
});
