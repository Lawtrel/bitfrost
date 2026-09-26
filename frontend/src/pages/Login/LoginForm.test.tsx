import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm';

const mockHandleChange = vi.fn();
const mockSubmit = vi.fn();

vi.mock('@/hooks/loginForm/useLoginForm', () => ({
  useLoginForm: () => ({
    form: {
      email: '',
      senha: '',
    },
    loading: false,
    handleChange: mockHandleChange,
    submit: mockSubmit,
  }),
}));

describe('LoginForm', () => {
  it('deve renderizar todos os campos do formulário', () => {
    render(<LoginForm />);

    expect(screen.getByText('Email Corporativo')).toBeInTheDocument();
    expect(screen.getByText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('deve chamar handleChange ao digitar no email', () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('exemplo@heineken.com'), {
      target: { value: 'admin@teste.com' },
    });

    expect(mockHandleChange).toHaveBeenCalledWith('email', 'admin@teste.com');
  });

  it('deve chamar submit ao clicar em entrar', () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
