import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';
import api, { clearSession } from './api';

beforeEach(() => { clearSession(); });

describe('sessão HTTP', () => {
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
