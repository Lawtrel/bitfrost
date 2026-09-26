import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Cadastro from './SingUp';

vi.mock('./SingUpForm', () => ({
  default: () => <div>Mocked SingUpForm</div>,
}));

describe('Cadastro', () => {
  it('deve renderizar a seção principal do cadastro', () => {
    render(<Cadastro />);

    expect(screen.getByText('Junte-se ao Vale Pallet')).toBeInTheDocument();
    expect(screen.getByText('Faça parte de uma plataforma que')).toBeInTheDocument();
    expect(screen.getByText('Cadastro de Colaborador')).toBeInTheDocument();
    expect(screen.getByText('Preencha os campos abaixo para criar sua conta')).toBeInTheDocument();
  });

  it('deve renderizar os benefícios da página', () => {
    render(<Cadastro />);

    expect(screen.getByText('Mais controle')).toBeInTheDocument();
    expect(screen.getByText('Mais produtividade')).toBeInTheDocument();
    expect(screen.getByText('Mais resultados')).toBeInTheDocument();
  });

  it('deve renderizar o formulário dentro do card', () => {
    render(<Cadastro />);

    expect(screen.getByText('Mocked SingUpForm')).toBeInTheDocument();
  });
});
