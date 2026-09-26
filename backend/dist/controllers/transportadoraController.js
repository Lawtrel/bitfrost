"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransportadora = exports.getAllTransportadoras = exports.createTransportadora = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- Criar uma nova Transportadora ---
const createTransportadora = async (req, res) => {
    try {
        const { nome } = req.body;
        const newTransportadora = await prisma.transportadora.create({
            data: { nome },
        });
        res.status(201).json(newTransportadora);
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel criar a transportadora.' });
    }
};
exports.createTransportadora = createTransportadora;
// --- Listar todas as Transportadoras ---
const getAllTransportadoras = async (req, res) => {
    try {
        const transportadoras = await prisma.transportadora.findMany();
        res.status(200).json(transportadoras);
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel buscar as transportadoras.' });
    }
};
exports.getAllTransportadoras = getAllTransportadoras;
// --- Deletar uma Transportadora ---
const deleteTransportadora = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.transportadora.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel deletar a transportadora.' });
    }
};
exports.deleteTransportadora = deleteTransportadora;
