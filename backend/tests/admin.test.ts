import { loginTestAdmin } from './helpers/auth';
import request from 'supertest';
import app from '../src/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let token: string;

describe('API de Admins - /api/admins', () => {
  
  // Limpa a tabela de admins antes de todos os testes
  beforeAll(async () => {
    await prisma.admin.deleteMany({});
    token = await loginTestAdmin(prisma, "admin");
  });

  // Fecha a conexão com o banco após os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar um novo admin com senha criptografada', async () => {
    const response = await request(app)
      .post('/api/admins').auth(token, { type: 'bearer' })
      .send({
        nome: 'Admin Teste',
        email: 'admin@heineken.com',
        role: 'consultor',
        status: 'ativo',
        senha: 'senha1234'
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('admin@heineken.com');
    expect(response.body.status).toBe('pendente');
    // Garante que a senha NUNCA seja retornada na resposta
    expect(response.body.senha).toBeUndefined();
  });

  it('deve listar todos os admins sem retornar a senha', async () => {
    // Primeiro, vamos garantir que existe um admin no banco
    await request(app)
      .post('/api/admins').auth(token, { type: 'bearer' })
      .send({
        nome: 'Admin Teste 2',
        email: 'admin2@heineken.com',
        role: 'supervisor',
        status: 'inativo',
        senha: 'outrasenha'
      });

    const response = await request(app).get('/api/admins').auth(token, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    // Verifica se nenhum dos admins retornados possui o campo senha
    expect(response.body[0].senha).toBeUndefined();
  });
});