"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const valeRoutes_1 = __importDefault(require("./routes/valeRoutes"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const transportadoraRoutes_1 = __importDefault(require("./routes/transportadoraRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// ✅ Use apenas express.json com limite aumentado
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.get('/', (req, res) => {
    const status = "ok";
    const message = "A API Bitfrost está funcionando nos conformes!";
    const timestamp = new Date().toISOString();
    const asciiArt = `
      -----------------
    /     B I T       /|
   / F R O S T       / |
  -----------------  /
  |   ( o ) ( o )   | /
  |      ^          |/
  |    (---)        |
  -----------------
    `;
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`
Status: ${status}
Message: ${message}
Timestamp: ${timestamp}
${asciiArt}
  `);
});
app.use('/api/vales', valeRoutes_1.default);
app.use('/api/clientes', clienteRoutes_1.default);
app.use('/api/transportadoras', transportadoraRoutes_1.default);
app.use('/api/admins', adminRoutes_1.default);
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://${HOST}:${PORT}`);
    });
}
exports.default = app;
