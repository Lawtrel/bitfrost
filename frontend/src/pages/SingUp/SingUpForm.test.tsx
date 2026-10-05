import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SingUpForm from './SingUpForm';

const mockHandleChange = vi.fn();
const mockSubmit = vi.fn();

vi.mock('@/hooks/singUpForm/useSingUpForm', () => ({
  useSingUpForm: () => ({
    form: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      role: '',
      status: '',
    },
    loading: false,
    handleChange: mockHandleChange,
    submit: mockSubmit,
  }),
}));

describe('SingUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar todos os campos do formulário', () => {
    render(<SingUpForm />);

    expect(screen.getByText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByText('Email Corporativo')).toBeInTheDocument();
    expect(screen.getByText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Senha')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Conta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument();
    expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Faça login' })).toHaveAttribute('href', '/login');
  });

  it('deve chamar handleChange ao digitar no nome', () => {
    render(<SingUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Digite seu nome'), {
      target: { value: 'João' },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('nome', 'João');
  });

  it('deve chamar handleChange ao digitar no email', () => {
    render(<SingUpForm />);

    fireEvent.change(screen.getByPlaceholderText('exemplo@heineken.com'), {
      target: { value: 'joao@heineken.com' },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('email', 'joao@heineken.com');
  });

  it('deve chamar handleChange ao digitar a senha e confirmar senha', () => {
    render(<SingUpForm />);

    fireEvent.change(screen.getByPlaceholderText('Digite sua senha'), {
      target: { value: '123456' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirme a senha'), {
      target: { value: '123456' },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('senha', '123456');
    expect(mockHandleChange).toHaveBeenCalledWith('confirmarSenha', '123456');
  });

  it('deve chamar handleChange ao selecionar o tipo de conta', () => {
    render(<SingUpForm />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'consultor' },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('role', 'consultor');
    expect(screen.queryByRole('option', { name: 'Administrador' })).not.toBeInTheDocument();
  });

  it('deve chamar submit ao clicar em cadastrar', () => {
    render(<SingUpForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
