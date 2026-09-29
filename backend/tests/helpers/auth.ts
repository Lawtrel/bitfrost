import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import app from '../../src/server';

// Usado somente após a validação do banco descartável pelo runner/Jest.
export async function loginTestAdmin(prisma: PrismaClient, suite: string): Promise<string> {
  const email = `fixture-${suite}@heineken.com`;
  const senha = 'senha-exclusiva-de-teste';
  const data = { nome: 'Fixture de testes', email, role: 'adm', status: 'ativo', senha: await bcrypt.hash(senha, 4) };
  await prisma.admin.upsert({ where: { email }, create: data, update: data });
  const response = await request(app).post('/api/admins/login').send({ email, senha });
  if (response.status !== 200 || !response.body.token) throw new Error('Falha no login da fixture de testes.');
  return response.body.token;
}
