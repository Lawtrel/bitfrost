import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockToast, mockNavigate, mockLoginUsuario } = vi.hoisted(() => ({
  mockToast: vi.fn(),
  mockNavigate: vi.fn(),
  mockLoginUsuario: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/services/api', () => ({
  loginUsuario: mockLoginUsuario,
}));

import { useLoginForm } from './useLoginForm';

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('deve bloquear login com campos vazios', () => {
    const { result } = renderHook(() => useLoginForm());

    const validation = result.current.validateForm();

    expect(validation.valid).toBe(false);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '❌ Campos vazios',
      })
    );
  });

  it('deve realizar login com sucesso quando usuário está ativo', async () => {
    mockLoginUsuario.mockResolvedValue({
      data: {
        token: 'token-de-teste',
        user: {
        id: '1',
        nome: 'Admin Teste',
        email: 'admin@teste.com',
        status: 'ativo',
        },
      },
    });

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange('email', 'admin@teste.com');
      result.current.handleChange('senha', 'senha123');
    });

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(true);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    expect(localStorage.getItem('usuario')).toContain('Admin Teste');
    expect(localStorage.getItem('admId')).toBe('1');
    expect(sessionStorage.getItem('accessToken')).toBe('token-de-teste');
  });

  it('deve bloquear login quando usuário não está ativo', async () => {
    mockLoginUsuario.mockResolvedValue({
      data: {
        user: {
        id: '2',
        nome: 'Usuário',
        email: 'teste@heineken.com',
        status: 'pendente',
        },
      },
    });

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange('email', 'teste@heineken.com');
      result.current.handleChange('senha', '123456');
    });

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(false);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '⏳ Aguardando aprovação',
      })
    );
  });
});
