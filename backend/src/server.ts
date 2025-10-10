import express from 'express';
import cors from 'cors';
import valeRoutes from './routes/valeRoutes';
import clienteRoutes from './routes/clienteRoutes';
import transportadoraRoutes from './routes/transportadoraRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors());

// ✅ Use apenas express.json com limite aumentado
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

app.use('/api/vales', valeRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/transportadoras', transportadoraRoutes);
app.use('/api/admins', adminRoutes);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';


if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://${HOST}:${PORT}`);
    });
}

export default app;
