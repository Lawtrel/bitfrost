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
    const { role, email } = req.query;

    const where: any = {};
    if (role) where.role = String(role);
    if (email) where.email = String(email);

    const admins = await prisma.admin.findMany({
      where,
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
    res.status(500).json({ error: 'Não foi possível buscar os admins.' });
  }
};
// --- Login do Admin ---
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o email existe
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Remove a senha da resposta
    const { senha: _, ...adminSemSenha } = admin;

    return res.status(200).json(adminSemSenha);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: 'Erro interno no login.' });
  }
};

// --- Atualizar o status de um Admin ---
export const updateAdminStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validação simples (opcional)
    const statusesPermitidos = ["ativo", "pendente"];
    if (!statusesPermitidos.includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const adminExistente = await prisma.admin.findUnique({
      where: { id },
    });

    if (!adminExistente) {
      return res.status(404).json({ error: "Admin não encontrado." });
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        status,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        status: true,
      }
    });

    return res.status(200).json(updatedAdmin);
  } catch (error: any) {
    console.error("Erro ao atualizar status do admin:", error);
    return res.status(500).json({ error: error.message || "Erro interno ao atualizar status." });
  }
};

// --- Deletar um Admin ---
export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verifica se o admin existe
    const adminExistente = await prisma.admin.findUnique({
      where: { id }
    });

    if (!adminExistente) {
      return res.status(404).json({ error: "Admin não encontrado." });
    }

    // Remove o admin
    await prisma.admin.delete({
      where: { id }
    });

    // Você pode retornar status 204 (No Content) ou 200 com mensagem
    return res.status(204).send();  
    // ou: res.status(200).json({ message: "Admin removido com sucesso." });
  } catch (error: any) {
    console.error("Erro ao deletar admin:", error);
    return res.status(500).json({ error: error.message || "Erro interno ao deletar admin." });
  }
};

// --- Atualizar a role de um Admin ---
export const updateAdminRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validação opcional
    const rolesPermitidos = ["adm", "consultor", "supervisor"]; 
    if (!rolesPermitidos.includes(role)) {
      return res.status(400).json({ error: "Role inválida" });
    }

    const adminExistente = await prisma.admin.findUnique({
      where: { id },
    });
    if (!adminExistente) {
      return res.status(404).json({ error: "Admin não encontrado." });
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        status: true,
      }
    });

    return res.status(200).json(updated);
  } catch (error: any) {
    console.error("Erro ao atualizar role do admin:", error);
    return res.status(500).json({ error: error.message || "Erro interno ao atualizar role." });
  }
};