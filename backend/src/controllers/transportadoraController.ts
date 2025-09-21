import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Criar uma nova Transportadora ---
export const createTransportadora = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    const newTransportadora = await prisma.transportadora.create({
      data: { nome },
    });
    res.status(201).json(newTransportadora);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel criar a transportadora.' });
  }
};

// --- Listar todas as Transportadoras ---
export const getAllTransportadoras = async (req: Request, res: Response) => {
  try {
    const transportadoras = await prisma.transportadora.findMany();
    res.status(200).json(transportadoras);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel buscar as transportadoras.' });
  }
};

// --- Deletar uma Transportadora ---
export const deleteTransportadora = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.transportadora.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel deletar a transportadora.' });
  }
};