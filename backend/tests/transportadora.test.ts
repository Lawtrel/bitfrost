import request from 'supertest';
import app from '../src/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('API de Clientes - /api/clientes', () => {
  let clienteId: string;

  // Limpa a tabela de clientes antes de todos os testes
  beforeAll(async () => {
    await prisma.cliente.deleteMany({});
  });

  // Fecha a conexão com o banco após os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar um novo cliente', async () => {
    const response = await request(app)
      .post('/api/clientes')
      .send({ nome: 'Cliente de Teste' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe('Cliente de Teste');

    clienteId = response.body.id;
  });

  it('deve listar todos os clientes', async () => {
    const response = await request(app).get('/api/clientes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((cliente: any) => cliente.id === clienteId)).toBe(true);
  });

  it('deve deletar um cliente', async () => {
    const response = await request(app).delete(`/api/clientes/${clienteId}`);
    expect(response.status).toBe(204);

    // Verifica se o cliente foi realmente deletado
    const allClientes = await prisma.cliente.findMany();
    const clienteDeletado = allClientes.find((cliente) => cliente.id === clienteId);
    expect(clienteDeletado).toBeUndefined();
  });
});