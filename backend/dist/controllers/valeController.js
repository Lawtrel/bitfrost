"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArquivoVale = exports.deleteVale = exports.updateVale = exports.getValeById = exports.getAllVales = exports.createVale = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- Criar um novo Vale ---
const createVale = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel criar o vale.' });
    }
};
exports.createVale = createVale;
// --- Listar todos os Vales ---
const getAllVales = async (req, res) => {
    try {
        const vales = await prisma.vale.findMany();
        res.status(200).json(vales);
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel buscar os vales.' });
    }
};
exports.getAllVales = getAllVales;
// --- Buscar um Vale por ID ---
const getValeById = async (req, res) => {
    try {
        const { id } = req.params;
        const vale = await prisma.vale.findUnique({
            where: { id },
        });
        if (vale) {
            res.status(200).json(vale);
        }
        else {
            res.status(404).json({ error: 'Vale nao encontrado.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel buscar o vale.' });
    }
};
exports.getValeById = getValeById;
// --- Atualizar um Vale ---
const updateVale = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, arquivoBase64, arquivoNome } = req.body;
        const updatedVale = await prisma.vale.update({
            where: { id },
            data: { status, arquivoBase64, arquivoNome },
        });
        res.status(200).json(updatedVale);
    }
    catch (error) {
        console.error("❌ Erro completo:", error); // imprime o erro inteiro
        console.error("❌ Erro mensagem:", error.message); // imprime a mensagem de erro
        console.error("❌ Erro stack:", error.stack); // imprime a stack trace (se existir)
        res.status(500).json({ error: 'Nao foi possivel atualizar o vale.' });
    }
};
exports.updateVale = updateVale;
// --- Deletar um Vale ---
const deleteVale = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vale.delete({
            where: { id },
        });
        res.status(204).send(); // 204 No Content - sucesso sem corpo de resposta
    }
    catch (error) {
        res.status(500).json({ error: 'Nao foi possivel deletar o vale.' });
    }
};
exports.deleteVale = deleteVale;
// Upload de arquivo para um vale
const uploadArquivoVale = async (req, res) => {
    const { id } = req.params;
    console.log("REQ BODY:", req.body);
    const { arquivoBase64, arquivoNome } = req.body;
    try {
        const valeExistente = await prisma.vale.findUnique({
            where: { id },
        });
        if (!valeExistente) {
            return res.status(404).json({ error: "Vale não encontrado." });
        }
        const updated = await prisma.vale.update({
            where: { id },
            data: {
                arquivoBase64,
                arquivoNome,
            },
        });
        res.status(200).json(updated);
    }
    catch (error) {
        console.error("❌ Erro completo:", error); // imprime o erro inteiro
        console.error("❌ Erro mensagem:", error.message); // imprime a mensagem de erro
        console.error("❌ Erro stack:", error.stack); // imprime a stack trace (se existir)
        res.status(500).json({ error: error.message || "Erro interno" });
    }
};
exports.uploadArquivoVale = uploadArquivoVale;
