"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteController_1 = require("../controllers/clienteController");
const router = (0, express_1.Router)();
router.post('/', clienteController_1.createCliente);
router.get('/', clienteController_1.getAllClientes);
router.delete('/:id', clienteController_1.deleteCliente);
exports.default = router;
