import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CriarVale from './pages/CriarVale';
import ValesAcumulados from './pages/ValesAcumulados';
import ValesProcessados from './pages/ValesProcessados';
import ValesVencidos from './pages/ValesVencidos';
import ApontamentoVale from './pages/ApontamentoVale';
import BaixarVale from './pages/BaixarVale';
import AprovaADM from './pages/AprovaADM';
import LoginADM from './pages/LoginADM';
import CadastreSeADM from './pages/CadastreSeADM';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginADM />} />
        <Route path="/cadastro" element={<CadastreSeADM />} />
        
        {/* Rotas Protegidas dentro do Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/criar-vale" element={<CriarVale />} />
          <Route path="/vales-acumulados" element={<ValesAcumulados />} />
          <Route path="/vales-processados" element={<ValesProcessados />} />
          <Route path="/vales-vencidos" element={<ValesVencidos />} />
          <Route path="/apontamento-vale" element={<ApontamentoVale />} />
          <Route path="/baixar-vale" element={<BaixarVale />} />
          <Route path="/aprova-adm" element={<AprovaADM />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;