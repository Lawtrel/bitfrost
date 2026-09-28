import request from 'supertest';
import app from '../src/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('API de Transportadoras - /api/transportadoras', () => {
  let transportadoraId: string;

  // Limpa a tabela de transportadoras antes de todos os testes
  beforeAll(async () => {
    await prisma.transportadora.deleteMany({});
  });

  // Fecha a conexão com o banco após os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar uma nova transportadora', async () => {
    const response = await request(app)
      .post('/api/transportadoras')
      .send({ nome: 'Transportadora de Teste' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe('Transportadora de Teste');

    transportadoraId = response.body.id;
  });

  it('deve listar todas as transportadoras', async () => {
    const response = await request(app).get('/api/transportadoras');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((transportadora: any) => transportadora.id === transportadoraId)).toBe(true);
  });

  it('deve deletar uma transportadora', async () => {
    const response = await request(app).delete(`/api/transportadoras/${transportadoraId}`);
    expect(response.status).toBe(204);

    // Verifica se a transportadora foi realmente deletada
    const allTransportadoras = await prisma.transportadora.findMany();
    const transportadoraDeletada = allTransportadoras.find((transportadora) => transportadora.id === transportadoraId);
    expect(transportadoraDeletada).toBeUndefined();
  });
});
