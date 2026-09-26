import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Login from './Login';

vi.mock('./LoginForm', () => ({
  default: () => <div>Mocked LoginForm</div>,
}));

describe('Login', () => {
  it('deve renderizar a seção principal do login', () => {
    render(<Login />);

    expect(screen.getByText('Bem vindo de volta')).toBeInTheDocument();
    expect(screen.getByText('A gestão dos seus pallets,')).toBeInTheDocument();
    expect(screen.getByText('Login de Colaborador')).toBeInTheDocument();
    expect(screen.getByText('Acesse sua conta para gerenciar vales paletes')).toBeInTheDocument();
  });

  it('deve renderizar os benefícios principais da página', () => {
    render(<Login />);

    expect(screen.getByText('Rastreamento em tempo real')).toBeInTheDocument();
    expect(screen.getByText('Relatórios e Indicadores')).toBeInTheDocument();
    expect(screen.getByText('Gestão de Parceiros')).toBeInTheDocument();
    expect(screen.getByText('Mais controle e Eficiência')).toBeInTheDocument();
  });

  it('deve renderizar o formulário dentro do card', () => {
    render(<Login />);

    expect(screen.getByText('Mocked LoginForm')).toBeInTheDocument();
  });
});
