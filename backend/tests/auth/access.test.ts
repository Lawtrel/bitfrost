import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import app from '../../src/server';
import { authSecret, issueToken } from '../../src/auth/token';

jest.mock('@prisma/client', () => {
  const admin = { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() };
  const resource = { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() };
  return { PrismaClient: jest.fn(() => ({ admin, cliente: resource, transportadora: resource, vale: resource })) };
});

const db = new PrismaClient();
const admin = { id: 'admin-1', nome: 'Admin', email: 'admin@heineken.com', role: 'adm', status: 'ativo', senha: '' };
const findUser = db.admin.findUnique as jest.Mock;
const endpoints = [
  ['get', '/api/admins'], ['put', '/api/admins/target/status'],
  ['put', '/api/admins/target/role'], ['delete', '/api/admins/target'],
  ['post', '/api/clientes'], ['delete', '/api/clientes/target'],
  ['post', '/api/transportadoras'], ['delete', '/api/transportadoras/target'],
] as const;

beforeEach(() => {
  jest.clearAllMocks();
  findUser.mockResolvedValue({ ...admin });
  (db.admin.findMany as jest.Mock).mockResolvedValue([]);
  (db.admin.update as jest.Mock).mockResolvedValue({ id: 'target', status: 'ativo' });
  (db.admin.delete as jest.Mock).mockResolvedValue({ id: 'target' });
  (db.cliente.create as jest.Mock).mockResolvedValue({ id: 'new', nome: 'Teste' });
  (db.cliente.delete as jest.Mock).mockResolvedValue({ id: 'target' });
});

describe('rotas administrativas', () => {
  for (const [method, path] of endpoints) {
    it(`bloqueia ${method} ${path} sem token`, async () => {
      const response = await request(app)[method](path).send({ role: 'adm', status: 'ativo', nome: 'Teste' });
      expect(response.status).toBe(401);
      expect(db.admin.update).not.toHaveBeenCalled();
      expect(db.admin.delete).not.toHaveBeenCalled();
      expect(db.cliente.create).not.toHaveBeenCalled();
      expect(db.cliente.delete).not.toHaveBeenCalled();
    });
    it(`bloqueia consultor em ${method} ${path}`, async () => {
      findUser.mockResolvedValue({ ...admin, role: 'consultor' });
      const response = await request(app)[method](path).auth(issueToken(admin.id), { type: 'bearer' })
        .send({ role: 'adm', status: 'ativo', nome: 'Teste' });
      expect(response.status).toBe(403);
      expect(db.admin.update).not.toHaveBeenCalled();
      expect(db.admin.delete).not.toHaveBeenCalled();
      expect(db.cliente.create).not.toHaveBeenCalled();
      expect(db.cliente.delete).not.toHaveBeenCalled();
    });
    it(`permite administrador ativo em ${method} ${path}`, async () => {
      const response = await request(app)[method](path).auth(issueToken(admin.id), { type: 'bearer' })
        .send({ role: 'consultor', status: 'ativo', nome: 'Teste' });
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    });
  }
  for (const path of ['/api/vales', '/api/clientes', '/api/transportadoras', '/api/admins/me']) {
    it(`exige login para ler ${path}`, async () => {
      expect((await request(app).get(path)).status).toBe(401);
    });
  }
  it('retorna 503 sem autorizar quando o banco está indisponível', async () => {
    findUser.mockRejectedValueOnce(new Error('banco indisponível'));
    const response = await request(app).get('/api/admins').auth(issueToken(admin.id), { type: 'bearer' });
    expect(response.status).toBe(503);
    expect(db.admin.findMany).not.toHaveBeenCalled();
  });
  it('consulta status atual: um token de conta desativada deixa de funcionar', async () => {
    const token = issueToken(admin.id);
    findUser.mockResolvedValue({ ...admin, status: 'pendente' });
    expect((await request(app).get('/api/admins').auth(token, { type: 'bearer' })).status).toBe(401);
  });
  it('ignora cargo no token e consulta o cargo atual no banco', async () => {
    const token = jwt.sign({ role: 'adm' }, authSecret(), {
      subject: admin.id, issuer: 'bitfrost-api', audience: 'bitfrost-web', expiresIn: 900,
    });
    findUser.mockResolvedValue({ ...admin, role: 'consultor' });
    expect((await request(app).get('/api/admins').auth(token, { type: 'bearer' })).status).toBe(403);
  });
});

describe('permissões de vales', () => {
  const writes = [['post', '/api/vales'], ['put', '/api/vales/target'], ['delete', '/api/vales/target']] as const;
  for (const [method, path] of writes) {
    it(`exige autenticação em ${method} ${path}`, async () => {
      expect((await request(app)[method](path).send({})).status).toBe(401);
      expect(db.vale.create).not.toHaveBeenCalled();
      expect(db.vale.update).not.toHaveBeenCalled();
      expect(db.vale.delete).not.toHaveBeenCalled();
    });
    for (const role of ['consultor', 'supervisor', 'adm']) {
      it(`${role}: ${method} ${path}`, async () => {
        findUser.mockResolvedValue({ ...admin, role });
        (db.vale.update as jest.Mock).mockResolvedValue({ id: 'target' });
        const response = await request(app)[method](path).auth(issueToken(admin.id), { type: 'bearer' })
          .send({ cliente: 'Teste', transportadora: 'Teste', quantidade: 1, valorUnitario: 1, dataVencimento: '2027-01-01', status: 'acumulado' });
        if (role === 'consultor') {
          expect(response.status).toBe(403);
          expect(db.vale.create).not.toHaveBeenCalled();
          expect(db.vale.update).not.toHaveBeenCalled();
          expect(db.vale.delete).not.toHaveBeenCalled();
        } else {
          expect(response.status).toBeGreaterThanOrEqual(200);
          expect(response.status).toBeLessThan(300);
        }
      });
    }
  }
  it('permite consulta por consultor ativo', async () => {
    findUser.mockResolvedValue({ ...admin, role: 'consultor' });
    (db.vale.findMany as jest.Mock).mockResolvedValue([]);
    expect((await request(app).get('/api/vales').auth(issueToken(admin.id), { type: 'bearer' })).status).toBe(200);
  });
  it('nega acesso a conta excluída mesmo com token válido', async () => {
    findUser.mockResolvedValue(null);
    expect((await request(app).get('/api/admins/me').auth(issueToken(admin.id), { type: 'bearer' })).status).toBe(401);
  });
});

describe('validação de tokens', () => {
  const options = { subject: 'admin-1', issuer: 'bitfrost-api', audience: 'bitfrost-web' };
  const invalidTokens = [
    ['expirado', () => jwt.sign({}, authSecret(), { ...options, expiresIn: -1 })],
    ['assinatura diferente', () => jwt.sign({}, 'another-secret-not-the-application-secret', { ...options, expiresIn: 900 })],
    ['algoritmo diferente', () => jwt.sign({}, authSecret(), { ...options, algorithm: 'HS384', expiresIn: 900 })],
    ['destinatário diferente', () => jwt.sign({}, authSecret(), { ...options, audience: 'another-app', expiresIn: 900 })],
    ['sem expiração', () => jwt.sign({}, authSecret(), options)],
  ] as const;
  for (const [label, token] of invalidTokens) {
    it(`rejeita token ${label} antes de consultar banco`, async () => {
      expect((await request(app).get('/api/admins').auth(token(), { type: 'bearer' })).status).toBe(401);
      expect(findUser).not.toHaveBeenCalled();
    });
  }
  it('recusa configuração sem segredo', () => {
    const value = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try { expect(() => authSecret()).toThrow('JWT_SECRET'); }
    finally { process.env.JWT_SECRET = value; }
  });
});

describe('cadastro e login', () => {
  const signup = { nome: 'Teste', email: 'teste@heineken.com', role: 'consultor', senha: 'senha-local-123' };
  it('impede criação pública de administrador', async () => {
    const response = await request(app).post('/api/admins').send({ ...signup, role: 'adm', status: 'ativo' });
    expect(response.status).toBe(400);
    expect(db.admin.create).not.toHaveBeenCalled();
  });
  it('força status pendente e guarda hash, mesmo se o cliente pedir ativo', async () => {
    (db.admin.create as jest.Mock).mockImplementation(({ data }) => ({ ...data, id: 'new' }));
    const response = await request(app).post('/api/admins').send({ ...signup, status: 'ativo' });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('pendente');
    expect(response.body.senha).toBeUndefined();
    const stored = (db.admin.create as jest.Mock).mock.calls[0][0].data;
    expect(await bcrypt.compare(signup.senha, stored.senha)).toBe(true);
  });
  it('trata email duplicado no servidor', async () => {
    (db.admin.create as jest.Mock).mockRejectedValueOnce({ code: 'P2002' });
    expect((await request(app).post('/api/admins').send(signup)).status).toBe(409);
  });
  it('retorna sessão para usuário ativo sem divulgar hash da senha', async () => {
    findUser.mockResolvedValue({ ...admin, senha: await bcrypt.hash(signup.senha, 4) });
    const response = await request(app).post('/api/admins/login').send({ email: admin.email, senha: signup.senha });
    expect(response.status).toBe(200);
    expect(response.body.user.senha).toBeUndefined();
    expect(jwt.verify(response.body.token, authSecret())).toMatchObject({ sub: admin.id });
    expect(response.body.expiresIn).toBe(900);
  });
  it('não emite token para usuário pendente', async () => {
    findUser.mockResolvedValue({ ...admin, status: 'pendente', senha: await bcrypt.hash(signup.senha, 4) });
    const response = await request(app).post('/api/admins/login').send({ email: admin.email, senha: signup.senha });
    expect(response.status).toBe(403);
    expect(response.body.token).toBeUndefined();
  });
  it('não emite token com senha incorreta', async () => {
    findUser.mockResolvedValue({ ...admin, senha: await bcrypt.hash(signup.senha, 4) });
    const response = await request(app).post('/api/admins/login').send({ email: admin.email, senha: 'incorreta' });
    expect(response.status).toBe(401);
    expect(response.body.token).toBeUndefined();
  });
});
