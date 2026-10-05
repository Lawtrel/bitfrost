import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api, { clearSession, VALES_CHANGED } from './api';

beforeEach(() => { clearSession(); });

describe('sessão HTTP', () => {
  it('atualiza os indicadores apenas após uma alteração de vale bem-sucedida', async () => {
    const changed = vi.fn();
    window.addEventListener(VALES_CHANGED, changed);
    try {
      const adapter = async (config: InternalAxiosRequestConfig) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config });
      await api.get('/vales', { adapter });
      expect(changed).not.toHaveBeenCalled();
      await api.put('/vales/1', { status: 'processado' }, { adapter });
      expect(changed).toHaveBeenCalledTimes(1);
      await expect(api.post('/vales', {}, { adapter: async () => { throw new Error('Falha'); } })).rejects.toThrow('Falha');
      expect(changed).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener(VALES_CHANGED, changed);
    }
  });
  it('envia o token da sessão no cabeçalho das requisições', async () => {
    sessionStorage.setItem('accessToken', 'token-local');
    const response = await api.get('/admins/me', { adapter: async config => ({
      data: config.headers.get('Authorization'), status: 200, statusText: 'OK', headers: {}, config,
    }) });
    expect(response.data).toBe('Bearer token-local');
  });
  it('limpa a sessão ao receber 401 sem esconder o erro da chamada', async () => {
    sessionStorage.setItem('accessToken', 'expirado');
    localStorage.setItem('usuario', '{}');
    localStorage.setItem('admId', '1');
    await expect(api.get('/admins/me', { adapter: async config => {
      throw new AxiosError('Unauthorized', '401', config, null, {
        data: {}, status: 401, statusText: 'Unauthorized', headers: new AxiosHeaders(), config,
      });
    } })).rejects.toThrow('Unauthorized');
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(localStorage.getItem('admId')).toBeNull();
  });
  it('logout remove a sessão e dados de apresentação', () => {
    sessionStorage.setItem('accessToken', 'token');
    localStorage.setItem('usuario', '{}');
    clearSession();
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });
});
