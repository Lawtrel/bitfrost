import express from 'express';
import cors from 'cors';

import valeRoutes from './routes/valeRoutes';
import clienteRoutes from './routes/clienteRoutes';
import transportadoraRoutes from './routes/transportadoraRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/vales', valeRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/transportadoras', transportadoraRoutes);
app.use('/api/admins', adminRoutes);


const PORT = process.env.PORT || 3001;
// Apenas inicie o servidor se este arquivo for executado diretamente
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}
export default app;