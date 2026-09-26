"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.getAllClientes = exports.createCliente = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- Criar um novo Cliente ---
const createCliente = async (req, res) => {
    try {
        console.log("Recebido no backend:", req.body); // 🔹 log do corpo
        const { nome } = req.body;
        if (!nome || nome.trim() === "") {
            return res.status(400).json({ error: "Nome inválido" });
        }
        const newCliente = await prisma.cliente.create({
            data: { nome },
        });
        console.log("Cliente criado:", newCliente); // 🔹 log do resultado
        res.status(201).json(newCliente);
    }
    catch (error) {
        console.error("Erro ao criar cliente:", error); // 🔹 log do erro real
        res.status(500).json({ error: 'Nao foi possivel criar o cliente.' });
    }
    console.log('DATABASE_URL =', process.env.DATABASE_URL);
};
exports.createCliente = createCliente;
// --- Listar todos os Clientes ---
const getAllClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel buscar os clientes.' });
    }
};
exports.getAllClientes = getAllClientes;
// --- Deletar um Cliente ---
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cliente.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel deletar o cliente.' });
    }
};
exports.deleteCliente = deleteCliente;
