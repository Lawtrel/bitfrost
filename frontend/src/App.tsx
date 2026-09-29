import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CriarVale from './pages/CriarVale';
import ValesAcumulados from './pages/ValesAcumulados';
import ValesProcessados from './pages/ValesProcessados';
import ValesVencidos from './pages/ValesVencidos';
import BaixarVale from './pages/BaixarVale';
import CadastreSeADM from './pages/SingUp/SingUp';
import LoginADM from './pages/Login/Login';
import AprovaADM from './pages/AprovaADM';
import NotFound from './pages/NotFound';
import RequireRole from './components/RequireRole';
import CadastreSeUser from './pages/CadastreSeClientOrTransporter';
import Index from './pages/index/Index';
import Header from './components/layout/header/header';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginADM />} />
          <Route path="/" element={<Index />} />
          <Route path="/cadastre-se" element={<CadastreSeADM />} />

          {/* Rota "Pai" do Dashboard - Protegida e com o Layout */}
          <Route 
            path="/dashboard" 
            element={<Layout/>}
          >
            {/* Rotas "Filhas" que serão renderizadas dentro do Layout */}
            <Route index element={<Dashboard />} /> {/* Rota inicial: /dashboard */}
            <Route path="criar-vale" element={<RequireRole roles={["adm", "supervisor"]}><CriarVale /></RequireRole>} /> {/* Rota: /dashboard/criar-vale */}
            <Route path="baixar-vale" element={<RequireRole roles={["adm", "supervisor"]}><BaixarVale /></RequireRole>} /> {/* Rota: /dashboard/baixar-vale */}
            <Route path="vales-acumulados" element={<ValesAcumulados />} /> {/* Rota: /dashboard/vales-acumulados */}
            <Route path="vales-processados" element={<RequireRole roles={["adm", "supervisor"]}><ValesProcessados /></RequireRole>} /> {/* Rota: /dashboard/vales-processados */}
            <Route path="vales-vencidos" element={<RequireRole roles={["adm", "supervisor"]}><ValesVencidos /></RequireRole>} /> {/* Rota: /dashboard/vales-vencidos */}
            <Route path="apontamento" element={<RequireRole roles={["adm", "supervisor"]}><NotFound /></RequireRole>} /> {/* Rota: /dashboard/apontamento */}
            <Route path="aprova-adm" element={<RequireRole roles={["adm"]}><AprovaADM /></RequireRole>} /> {/* Rota: /dashboard/aprova-adm */}
            <Route path="cadastra-seClientOrTransporter" element={<RequireRole roles={["adm"]}><CadastreSeUser /></RequireRole>} />
          </Route>


          {/* Rota para página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;