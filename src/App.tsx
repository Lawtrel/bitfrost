import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CriarVale from './pages/CriarVale';
import ValesAcumulados from './pages/ValesAcumulados';
import ValesProcessados from './pages/ValesProcessados';
import ValesVencidos from './pages/ValesVencidos';
import BaixarVale from './pages/BaixarVale';
import ApontamentoVale from './pages/ApontamentoVale';
import CadastreSeADM from './pages/CadastreSeADM';
import LoginADM from './pages/LoginADM';
import AprovaADM from './pages/AprovaADM';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div>Carregando...</div>;
    return user ? children : <Navigate to="/" />;
  };

  if (loading) {
    return <div>Carregando Aplicação...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginADM />} />
        <Route path="/register" element={<CadastreSeADM />} />

        {/* Rota "Pai" do Dashboard - Protegida e com o Layout */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Layout /></PrivateRoute>}
        >
          {/* Rotas "Filhas" que serão renderizadas dentro do Layout */}
          <Route index element={<Dashboard />} /> {/* Rota inicial: /dashboard */}
          <Route path="criar-vale" element={<CriarVale />} /> {/* Rota: /dashboard/criar-vale */}
          <Route path="baixar-vale" element={<BaixarVale />} /> {/* Rota: /dashboard/baixar-vale */}
          <Route path="vales-acumulados" element={<ValesAcumulados />} /> {/* Rota: /dashboard/vales-acumulados */}
          <Route path="vales-processados" element={<ValesProcessados />} /> {/* Rota: /dashboard/vales-processados */}
          <Route path="vales-vencidos" element={<ValesVencidos />} /> {/* Rota: /dashboard/vales-vencidos */}
          <Route path="apontamento" element={<ApontamentoVale />} /> {/* Rota: /dashboard/apontamento */}
          <Route path="aprova-adm" element={<AprovaADM />} /> {/* Rota: /dashboard/aprova-adm */}
        </Route>

        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;