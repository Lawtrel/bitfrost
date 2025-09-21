import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Criar um novo Vale ---
export const createVale = async (req: Request, res: Response) => {
  try {
    const { cliente, transportadora, quantidade, valorUnitario, dataVencimento, observacoes, status } = req.body;
    const newVale = await prisma.vale.create({
      data: {
        cliente,
        transportadora,
        quantidade,
        valorUnitario,
        dataVencimento: new Date(dataVencimento), // Garante que a data está no formato correto
        observacoes,
        status,
      },
    });
    res.status(201).json(newVale);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel criar o vale.' });
  }
};

// --- Listar todos os Vales ---
export const getAllVales = async (req: Request, res: Response) => {
  try {
    const vales = await prisma.vale.findMany();
    res.status(200).json(vales);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel buscar os vales.' });
  }
};

// --- Buscar um Vale por ID ---
export const getValeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vale = await prisma.vale.findUnique({
      where: { id },
    });
    if (vale) {
      res.status(200).json(vale);
    } else {
      res.status(404).json({ error: 'Vale nao encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel buscar o vale.' });
  }
};

// --- Atualizar um Vale ---
export const updateVale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Exemplo: atualizando apenas o status
    const updatedVale = await prisma.vale.update({
      where: { id },
      data: { status },
    });
    res.status(200).json(updatedVale);
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel atualizar o vale.' });
  }
};

// --- Deletar um Vale ---
export const deleteVale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.vale.delete({
      where: { id },
    });
    res.status(204).send(); // 204 No Content - sucesso sem corpo de resposta
  } catch (error) {
    res.status(500).json({ error: 'Nao foi possivel deletar o vale.' });
  }
};