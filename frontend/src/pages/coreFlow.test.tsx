import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import CriarVale from './CriarVale';
import AprovaADM from './AprovaADM';
import BaixarVale from './BaixarVale';
import ValesVencidos from './ValesVencidos';
import ValesProcessados from './ValesProcessados';
import { createVale, deleteCliente, deleteTransportadora, getClientes, getTransportadoras, getUsuariosByStatus, getVales, updateUsuariosByRole, updateUsuariosByStatus, updateValeStatus } from '@/services/api';

vi.mock('@/services/api', () => ({
  createVale: vi.fn(), getClientes: vi.fn(), getTransportadoras: vi.fn(), getVales: vi.fn(),
  getUsuariosByStatus: vi.fn(), updateUsuariosByStatus: vi.fn(), updateUsuariosByRole: vi.fn(),
  deleteCliente: vi.fn(), deleteTransportadora: vi.fn(), deleteUsuario: vi.fn(), updateArquivoVale: vi.fn(), updateValeStatus: vi.fn(),
}));
vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn(), useToast: () => ({ toast: vi.fn() }) }));
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
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('fluxo principal com componentes reais', () => {
  it('inclui o vencimento de hoje tanto na lista como no contador de ativos', async () => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T00:00:00.000Z`;
    vi.mocked(getVales).mockResolvedValue({ data: [vale, { ...vale, id: 'today', dataVencimento: today }] } as never);
    render(<BaixarVale />);
    expect(await screen.findByRole('button', { name: 'Processar vale today' })).toBeInTheDocument();
    expect(screen.getByLabelText('Quantidade de vales ativos')).toHaveTextContent('2');
  });
  it('aprova um cadastro pendente e atualiza as listas após a API', async () => {
    let approved = false;
    const person = { id: 'pending', nome: 'Pessoa Pendente', email: 'pendente@heineken.com', role: 'consultor' };
    vi.mocked(getUsuariosByStatus).mockImplementation(async status => ({ data: status === (approved ? 'ativo' : 'pendente') ? [{ ...person, status }] : [] }) as never);
    vi.mocked(updateUsuariosByStatus).mockImplementation(async () => { approved = true; return {} as never; });
    render(<MemoryRouter><AprovaADM /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: 'Aprovar Pessoa Pendente' }));
    await waitFor(() => expect(updateUsuariosByStatus).toHaveBeenCalledWith('pending', 'ativo'));
    expect(await screen.findByText('Nenhum cadastro pendente.')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Promover Pessoa Pendente a supervisor' })).toBeInTheDocument();
  });

  it('promove um consultor e remove a ação após confirmar o novo cargo', async () => {
    let role = 'consultor';
    vi.mocked(getUsuariosByStatus).mockImplementation(async status => ({ data: status === 'ativo' ? [{ id: 'u', nome: 'Pessoa Ativa', email: 'ativa@heineken.com', role, status }] : [] }) as never);
    vi.mocked(updateUsuariosByRole).mockImplementation(async () => { role = 'supervisor'; return {} as never; });
    render(<MemoryRouter><AprovaADM /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: 'Promover Pessoa Ativa a supervisor' }));
    await waitFor(() => expect(updateUsuariosByRole).toHaveBeenCalledWith('u', 'supervisor'));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Promover Pessoa Ativa a supervisor' })).not.toBeInTheDocument());
    expect(screen.getByText('ativa@heineken.com · supervisor')).toBeInTheDocument();
  });

  it('cancelar a confirmação preserva o cliente e não chama a API', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<MemoryRouter><AprovaADM /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: `Remover cliente ${vale.cliente}` }));
    expect(deleteCliente).not.toHaveBeenCalled();
    expect(screen.getByText(vale.cliente)).toBeInTheDocument();
  });

  it.each(['cliente', 'transportadora'] as const)('remover %s atualiza apenas sua lista após confirmação', async kind => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fetch = kind === 'cliente' ? getClientes : getTransportadoras;
    const remove = kind === 'cliente' ? deleteCliente : deleteTransportadora;
    const name = kind === 'cliente' ? vale.cliente : vale.transportadora;
    vi.mocked(remove).mockImplementation(async () => { vi.mocked(fetch).mockResolvedValue({ data: [] } as never); return {} as never; });
    render(<MemoryRouter><AprovaADM /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: `Remover ${kind} ${name}` }));
    await waitFor(() => expect(remove).toHaveBeenCalledWith(kind === 'cliente' ? 'c' : 't'));
    await waitFor(() => expect(screen.queryByText(name)).not.toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(kind === 'cliente' ? getTransportadoras : getClientes).toHaveBeenCalledTimes(1);
  });

  it('falha na consulta de processados termina o carregamento e exibe o erro', async () => {
    vi.mocked(getVales).mockRejectedValue(new Error('offline'));
    render(<ValesProcessados />);
    expect(await screen.findByText('Falha ao carregar os vales processados.')).toBeInTheDocument();
    expect(screen.queryByText('Carregando vales processados...')).not.toBeInTheDocument();
  });

  it('lista apenas vencidos e processa o registro após confirmação da API', async () => {
    vi.mocked(getVales).mockResolvedValue({ data: [vale, { ...vale, id: 'expired', dataVencimento: '2000-01-01T00:00:00.000Z' }] } as never);
    render(<MemoryRouter><ValesVencidos /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: 'Processar vale expired' }));
    expect(screen.queryByRole('button', { name: 'Processar vale vale-1' })).not.toBeInTheDocument();
    await waitFor(() => expect(updateValeStatus).toHaveBeenCalledWith('expired', 'processado'));
    expect(await screen.findByText('Nenhum vale vencido.')).toBeInTheDocument();
  });
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

  it('envia a quantidade numérica informada mesmo com notação exponencial', async () => {
    render(<CriarVale />);
    await fillVale();
    fireEvent.change(screen.getByLabelText('Quantidade de paletes'), { target: { value: '1e3' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Criar vale' }).closest('form')!);
    await waitFor(() => expect(createVale).toHaveBeenCalledWith(expect.objectContaining({ quantidade: 1000 })));
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
