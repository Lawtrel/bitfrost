import { describe, expect, it } from 'vitest';
import { createValePdf } from './valePdf';

describe('exportação real do vale', () => {
  it('gera um PDF com data, valor total e identificação completa', () => {
    const doc = createValePdf({ id: 'cmuvdjypa0000em2klaxnxnt7', cliente: 'Cliente Teste', transportadora: 'Transporte Teste', quantidade: 12, valorUnitario: 18.5, dataVencimento: '2026-11-30T00:00:00.000Z', status: 'processado' });
    const pdf = doc.output();
    expect(pdf.startsWith('%PDF-')).toBe(true);
    expect(pdf).toContain('cmuvdjypa0000em2klaxnxnt7');
    expect(pdf).toContain('222,00');
    expect(pdf).toContain('30/11/2026');
    expect(pdf).toContain('%%EOF');
    expect(doc.getNumberOfPages()).toBe(1);
  });
});
