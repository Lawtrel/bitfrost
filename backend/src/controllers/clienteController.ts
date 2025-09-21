import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Criar um novo Cliente ---
export const createCliente = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    const newCliente = await prisma.cliente.create({
      data: { nome },
    });
    res.status(201).json(newCliente);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel criar o cliente.' });
  }
};

// --- Listar todos os Clientes ---
export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel buscar os clientes.' });
  }
};

// --- Deletar um Cliente ---
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cliente.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel deletar o cliente.' });
  }
};