"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const valeController_1 = require("../controllers/valeController");
const router = (0, express_1.Router)();
// Rota para criar um novo vale (POST /api/vales)
router.post('/', valeController_1.createVale);
// Rota para listar todos os vales (GET /api/vales)
router.get('/', valeController_1.getAllVales);
// Rota para buscar um vale por ID (GET /api/vales/algum-id)
router.get('/:id', valeController_1.getValeById);
// Rota para atualizar um vale (PUT /api/vales/algum-id)
router.put('/:id', valeController_1.updateVale);
// Rota para deletar um vale (DELETE /api/vales/algum-id)
router.delete('/:id', valeController_1.deleteVale);
// Rota específica para upload de arquivo
router.put('/:id', valeController_1.uploadArquivoVale);
exports.default = router;
