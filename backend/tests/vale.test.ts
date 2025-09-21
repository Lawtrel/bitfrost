import request from 'supertest';
import app from '../src/server';
import { PrismaClient } from '@prisma/client'; // REMOVIDO A IMPORTAÇÃO DO VALE

const prisma = new PrismaClient();

describe('API de Vales - /api/vales', () => {
  let valeId: string;

  beforeAll(async () => {
    await prisma.vale.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar um novo vale', async () => {
    const response = await request(app)
      .post('/api/vales')
      .send({
        cliente: 'Cliente Teste',
        transportadora: 'Transportadora Teste',
        quantidade: 100,
        valorUnitario: 1.5,
        dataVencimento: '2025-12-31T00:00:00.000Z',
        observacoes: 'Vale de teste',
        status: 'acumulado',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.cliente).toBe('Cliente Teste');

    valeId = response.body.id;
  });

  it('deve listar todos os vales', async () => {
    const response = await request(app).get('/api/vales');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // TIPO ALTERADO PARA 'any'
    expect(response.body.some((vale: any) => vale.id === valeId)).toBe(true);
  });

  it('deve deletar um vale', async () => {
    const response = await request(app).delete(`/api/vales/${valeId}`);
    expect(response.status).toBe(204);

    const getResponse = await request(app).get(`/api/vales/${valeId}`);
    expect(getResponse.status).toBe(404);
  });
});