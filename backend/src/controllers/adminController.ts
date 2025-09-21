import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// --- Criar um novo Admin (com senha criptografada) ---
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { nome, email, role, status, senha } = req.body;

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const newAdmin = await prisma.admin.create({
      data: {
        nome,
        email,
        role,
        status,
        senha: hashedPassword, // Salva a senha criptografada
      },
    });

    // Remove a senha da resposta
    const { senha: _, ...adminSemSenha } = newAdmin;
    res.status(201).json(adminSemSenha);

  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel criar o admin.' });
  }
};

// --- Listar todos os Admins (sem a senha) ---
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      // Seleciona os campos que queremos retornar
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        status: true,
      }
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel buscar os admins.' });
  }
};