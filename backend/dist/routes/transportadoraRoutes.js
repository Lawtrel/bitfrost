"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transportadoraController_1 = require("../controllers/transportadoraController");
const router = (0, express_1.Router)();
router.post('/', transportadoraController_1.createTransportadora);
router.get('/', transportadoraController_1.getAllTransportadoras);
router.delete('/:id', transportadoraController_1.deleteTransportadora);
exports.default = router;
