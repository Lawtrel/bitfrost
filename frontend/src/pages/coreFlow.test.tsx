import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import CriarVale from './CriarVale';
import AprovaADM from './AprovaADM';
import BaixarVale from './BaixarVale';
import { createVale, getClientes, getTransportadoras, getUsuariosByStatus, getVales, updateValeStatus } from '@/services/api';

vi.mock('@/services/api', () => ({
  createVale: vi.fn(), getClientes: vi.fn(), getTransportadoras: vi.fn(), getVales: vi.fn(),
  getUsuariosByStatus: vi.fn(), updateUsuariosByStatus: vi.fn(), updateUsuariosByRole: vi.fn(),
  deleteCliente: vi.fn(), deleteTransportadora: vi.fn(), deleteUsuario: vi.fn(), updateArquivoVale: vi.fn(), updateValeStatus: vi.fn(),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('@/components/ui/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
const vale = { id: 'vale-1', cliente: 'Cliente Teste', transportadora: 'Transporte Teste', quantidade: 25, valorUnitario: 15, status: 'acumulado', dataCriacao: '2030-01-01T00:00:00.000Z', dataVencimento: '2099-12-31T00:00:00.000Z' };

beforeEach(() => {
  vi.resetAllMocks(); localStorage.clear();
  vi.mocked(getVales).mockResolvedValue({ data: [] } as never);
  vi.mocked(getClientes).mockResolvedValue({ data: [{ id: 'c', nome: vale.cliente }] } as never);
  vi.mocked(getTransportadoras).mockResolvedValue({ data: [{ id: 't', nome: vale.transportadora }] } as never);
  vi.mocked(createVale).mockResolvedValue({ data: vale } as never);
  vi.mocked(updateValeStatus).mockResolvedValue({ data: vale } as never);
  vi.mocked(getUsuariosByStatus).mockResolvedValue({ data: [] } as never);
});
afterEach(cleanup);

describe('fluxo principal com componentes reais', () => {
  it('mostra indicadores válidos para banco vazio', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('0.0%')).toBeInTheDocument();
    expect(screen.queryByText(/NaN|Infinity/)).not.toBeInTheDocument();
    expect(screen.getByText('Total de vales')).toBeInTheDocument();
  });

  it('exibe a falha do painel sem ficar preso no carregamento', async () => {
    vi.mocked(getVales).mockRejectedValue(new Error('offline'));
    render(<Dashboard />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  async function fillVale() {
    await screen.findByRole('option', { name: vale.cliente });
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: vale.cliente } });
    fireEvent.change(screen.getByLabelText('Transportadora'), { target: { value: vale.transportadora } });
    fireEvent.change(screen.getByLabelText('Quantidade de paletes'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Valor unitário (R$)'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Vencimento'), { target: { value: '2030-12-31' } });
  }

  it('emite um vale a partir do formulário visível, preservando a data escolhida', async () => {
    render(<CriarVale />);
    await fillVale();
    fireEvent.click(screen.getByRole('button', { name: 'Criar vale' }));
    await waitFor(() => expect(createVale).toHaveBeenCalledWith(expect.objectContaining({ cliente: vale.cliente, transportadora: vale.transportadora, quantidade: 25, valorUnitario: 15, dataVencimento: '2030-12-31T00:00:00.000Z', status: 'acumulado' })));
  });

  it('não emite vale com quantidade zero mesmo se o envio contornar a validação nativa', async () => {
    render(<CriarVale />);
    await fillVale();
    fireEvent.change(screen.getByLabelText('Quantidade de paletes'), { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Criar vale' }).closest('form')!);
    expect(createVale).not.toHaveBeenCalled();
  });

  it('mostra usuários ativos vindos da consulta correta, com pendentes vazios', async () => {
    vi.mocked(getUsuariosByStatus).mockImplementation(async status => ({ data: status === 'ativo' ? [{ id: 'u', nome: 'Pessoa Ativa', email: 'ativa@heineken.com', role: 'supervisor', status: 'ativo' }] : [] }) as never);
    render(<MemoryRouter><AprovaADM /></MemoryRouter>);
    expect(await screen.findByText('Pessoa Ativa')).toBeInTheDocument();
    expect(screen.getByText('Nenhum cadastro pendente.')).toBeInTheDocument();
  });

  it('processa o vale exibido e o retira da lista após confirmação da API', async () => {
    vi.mocked(getVales).mockResolvedValue({ data: [vale] } as never);
    render(<BaixarVale />);
    fireEvent.click(await screen.findByRole('button', { name: 'Processar vale vale-1' }));
    await waitFor(() => expect(updateValeStatus).toHaveBeenCalledWith('vale-1', 'processado'));
    expect(await screen.findByText('Nenhum vale em aberto corresponde aos filtros.')).toBeInTheDocument();
  });

  it('abrir a listagem não altera automaticamente o status dos vales vencidos', async () => {
    vi.mocked(getVales).mockResolvedValue({ data: [{ ...vale, dataVencimento: '2000-01-01T00:00:00.000Z' }] } as never);
    render(<BaixarVale />);
    await screen.findByText('Nenhum vale em aberto corresponde aos filtros.');
    expect(updateValeStatus).not.toHaveBeenCalled();
  });
});
