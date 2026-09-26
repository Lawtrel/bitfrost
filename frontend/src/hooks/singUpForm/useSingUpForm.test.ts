import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockToast, mockNavigate, mockCreateUsuario, mockGetUsuariosByEmail, mockGetUsuariosByRole } = vi.hoisted(() => ({
  mockToast: vi.fn(),
  mockNavigate: vi.fn(),
  mockCreateUsuario: vi.fn(),
  mockGetUsuariosByEmail: vi.fn(),
  mockGetUsuariosByRole: vi.fn(),
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
  createUsuario: mockCreateUsuario,
  getUsuariosByEmail: mockGetUsuariosByEmail,
  getUsuariosByRole: mockGetUsuariosByRole,
}));

import { useSingUpForm } from './useSingUpForm';

describe('useSingUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('deve bloquear cadastro com email corporativo inválido', () => {
    const { result } = renderHook(() => useSingUpForm());

    act(() => {
      result.current.handleChange('nome', 'João');
      result.current.handleChange('email', 'joao@gmail.com');
      result.current.handleChange('senha', '123456');
      result.current.handleChange('confirmarSenha', '123456');
      result.current.handleChange('role', 'consultor');
    });

    const validation = result.current.validateForm();

    expect(validation.valid).toBe(false);
    expect(validation.title).toBe('❌ Email inválido');
    expect(mockToast).toHaveBeenCalled();
  });

  it('deve criar usuário quando os dados forem válidos', async () => {
    mockGetUsuariosByRole.mockResolvedValue({ data: [] });
    mockGetUsuariosByEmail.mockResolvedValue({ data: [] });
    mockCreateUsuario.mockResolvedValue({ data: { id: '1' } });

    const { result } = renderHook(() => useSingUpForm());

    act(() => {
      result.current.handleChange('nome', 'João da Silva');
      result.current.handleChange('email', 'joao@heineken.com');
      result.current.handleChange('senha', '123456');
      result.current.handleChange('confirmarSenha', '123456');
      result.current.handleChange('role', 'consultor');
    });

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(true);
    });

    await waitFor(() => {
      expect(mockCreateUsuario).toHaveBeenCalledWith({
        nome: 'João da Silva',
        email: 'joao@heineken.com',
        senha: '123456',
        role: 'consultor',
        status: 'pendente',
      });
    });

    expect(result.current.form.email).toBe('');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '✅ Sucesso',
      })
    );
  });

  it('deve bloquear cadastro quando já existe administrador', async () => {
    mockGetUsuariosByRole.mockResolvedValue({ data: [{ id: 'adm-1' }] });

    const { result } = renderHook(() => useSingUpForm());

    act(() => {
      result.current.handleChange('nome', 'Maria');
      result.current.handleChange('email', 'maria@heineken.com');
      result.current.handleChange('senha', '123456');
      result.current.handleChange('confirmarSenha', '123456');
      result.current.handleChange('role', 'adm');
    });

    await act(async () => {
      const ok = await result.current.submit();
      expect(ok).toBe(false);
    });

    expect(mockCreateUsuario).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '❌ Ação não permitida',
      })
    );
  });
});
