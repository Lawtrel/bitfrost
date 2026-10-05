import { RequestHandler } from 'express';
import { prisma } from '../infra/prisma';
import { tokenSubject } from './token';

export const requireAuth: RequestHandler = async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  const match = /^Bearer ([^\s]+)$/i.exec(req.get('authorization') || '');
  if (!match) { res.status(401).json({ error: 'Autenticação necessária.' }); return; }
  let id: string;
  try { id = tokenSubject(match[1]); }
  catch { res.status(401).json({ error: 'Sessão inválida ou expirada.' }); return; }
  try {
    const user = await prisma.admin.findUnique({
      where: { id }, select: { id: true, nome: true, email: true, role: true, status: true },
    });
    if (!user || user.status !== 'ativo') {
      res.status(401).json({ error: 'Sessão inválida ou acesso desativado.' }); return;
    }
    // Permissões vêm do banco em cada acesso; nunca do corpo ou cargo enviado pelo navegador.
    res.locals.user = user;
    next();
  } catch { res.status(503).json({ error: 'Não foi possível verificar a sessão.' }); }
};

export const requireAdmin: RequestHandler = (_req, res, next) => {
  if (res.locals.user?.role !== 'adm') {
    res.status(403).json({ error: 'Acesso restrito ao administrador.' }); return;
  }
  next();
};

export const requireSupervisor: RequestHandler = (_req, res, next) => {
  if (!['adm', 'supervisor'].includes(res.locals.user?.role)) {
    res.status(403).json({ error: 'Acesso restrito ao supervisor ou administrador.' }); return;
  }
  next();
};
