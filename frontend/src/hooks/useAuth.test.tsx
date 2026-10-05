import { act, renderHook, waitFor, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth';
import { clearSession, getSession } from '@/services/api';
import { AxiosError, AxiosHeaders } from 'axios';

vi.mock('@/services/api', async importOriginal => ({
  ...await importOriginal<typeof import('@/services/api')>(), getSession: vi.fn(),
}));
const currentUser = { id: '1', nome: 'Pessoa', email: 'pessoa@heineken.com', role: 'consultor', status: 'ativo' };
beforeEach(() => { vi.resetAllMocks(); clearSession(); });
afterEach(cleanup);

describe('sessão confirmada pelo servidor', () => {
  it('preserva o token durante indisponibilidade e permite confirmar a sessão novamente', async () => {
    sessionStorage.setItem('accessToken', 'valid-token');
    vi.mocked(getSession).mockRejectedValueOnce(new Error('network unavailable')).mockResolvedValueOnce({ data: currentUser } as never);
    const { result } = renderHook(useAuth);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(sessionStorage.getItem('accessToken')).toBe('valid-token');
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    expect(result.current.error).toBeNull();
  });

  it('encerra a sessão quando o servidor rejeita o token com 401', async () => {
    sessionStorage.setItem('accessToken', 'expired-token');
    vi.mocked(getSession).mockRejectedValue(new AxiosError('Unauthorized', '401', undefined, undefined, { data: {}, status: 401, statusText: 'Unauthorized', headers: new AxiosHeaders(), config: { headers: new AxiosHeaders() } }));
    const { result } = renderHook(useAuth);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
  it('ignora um administrador forjado no armazenamento do navegador', async () => {
    localStorage.setItem('usuario', JSON.stringify({ ...currentUser, role: 'adm' }));
    vi.mocked(getSession).mockResolvedValue({ data: currentUser } as never);
    const { result } = renderHook(useAuth);
    expect(result.current.user).toBeNull();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user?.role).toBe('consultor');
  });

  it('não libera acesso quando a verificação falha', async () => {
    vi.mocked(getSession).mockRejectedValue(new Error('Unauthorized'));
    const { result } = renderHook(useAuth);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('remove o usuário visível quando a sessão termina', async () => {
    vi.mocked(getSession).mockResolvedValue({ data: currentUser } as never);
    const { result } = renderHook(useAuth);
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    act(() => clearSession());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('uma resposta atrasada não restaura a sessão após sair', async () => {
    let resolve!: (value: never) => void;
    vi.mocked(getSession).mockReturnValue(new Promise(done => { resolve = done; }));
    const { result } = renderHook(useAuth);
    act(() => clearSession());
    await act(async () => { resolve({ data: currentUser } as never); });
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });
});
