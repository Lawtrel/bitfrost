import { describe, expect, it } from 'vitest';
import { isValeOverdue, overdueDays } from './valeDate';

describe('vencimento por dia civil', () => {
  it('mantém o vale válido durante todo o dia escolhido', () => {
    const vale = { status: 'acumulado', dataVencimento: '2026-10-05T00:00:00.000Z' };
    expect(isValeOverdue(vale, new Date(2026, 9, 5, 0, 1))).toBe(false);
    expect(isValeOverdue(vale, new Date(2026, 9, 5, 23, 59))).toBe(false);
    expect(isValeOverdue(vale, new Date(2026, 9, 6, 0, 0))).toBe(true);
  });
  it('conta dias civis e ignora vencimento de vales já processados', () => {
    expect(overdueDays('2026-10-02T00:00:00.000Z', new Date(2026, 9, 5, 10))).toBe(3);
    expect(isValeOverdue({ status: 'processado', dataVencimento: '2026-10-02T00:00:00.000Z' }, new Date(2026, 9, 5))).toBe(false);
    expect(overdueDays('invalid')).toBe(0);
  });
});
