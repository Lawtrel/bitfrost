import { Outlet, useLocation, useNavigate } from "react-router-dom";
// CORREÇÃO: Adicionamos SidebarProvider e garantimos que AppSidebar é uma importação nomeada
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar-button/sidebar";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar"; 
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface UsuarioLogado {
  nome: string;
  role: string;
  email: string;
}

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const usuarioString = localStorage.getItem("usuario");
    if (usuarioString) {
      try {
        setUsuario(JSON.parse(usuarioString));
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error);
        handleLogout();
      }
    } else {
        navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("admId");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };

  const getPageTitle = () => {
    // Esta função define o título da página com base na rota
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/dashboard/baixar-vale": return "Processar Vales Recebidos";
      case "/dashboard/vales-vencidos": return "Vale Paletes Vencidos";
      case "/dashboard/vales-acumulados": return "Vale Paletes Acumulados";
      case "/dashboard/apontamento": return "Apontamento de Vale Palete";
      case "/dashboard/criar-vale": return "Criar Vale Palete";
      case "/dashboard/vales-processados": return "Verificar vales processados";
      default: return "Cargo Token";
    }
  };

  const getPageDescription = () => {
    // Esta função define a descrição da página
    switch (location.pathname) {
      case "/dashboard": return "Visão geral e métricas do sistema";
      case "/dashboard/baixar-vale": return "Gerencie e processe os vales recebidos";
      case "/dashboard/vales-vencidos": return "Monitore vales em atraso";
      case "/dashboard/vales-acumulados": return "Controle de vales em aberto";
      case "/dashboard/apontamento": return "Registre movimentações de paletes";
      case "/dashboard/criar-vale": return "Gere novos vales palete digitais";
      case "/dashboard/vales-processados": return "Verifique quais vales estão aprovados";
      default: return "Sistema de Gestão de Vale Paletes";
    }
  };
  
 return (
    // CORREÇÃO: Envolvemos tudo com o SidebarProvider
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {getPageDescription()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {showSearch ? (
                <input
                  type="text"
                  autoFocus
                  placeholder="Digite para buscar..."
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  onBlur={() => setShowSearch(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Buscar</span>
                </Button>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                    title="Notificações"
                    aria-label="Abrir notificações"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      3
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <h4 className="text-sm font-semibold mb-2">Notificações</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="bg-gray-100 rounded-md p-2">Vale nº 1023 aprovado</li>
                    <li className="bg-gray-100 rounded-md p-2">Novo vale pendente</li>
                    <li className="bg-gray-100 rounded-md p-2">Relatório gerado</li>
                  </ul>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <div
                    className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer"
                    title="Perfil do usuário"
                    aria-label="Abrir menu de usuário"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-700">{usuario?.nome || 'Carregando...'}</p>
                      <p className="text-xs text-gray-500">{usuario?.role || '...'}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-medium">{getInitials(usuario?.nome || '')}</span>
                    </div>
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-64 p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{usuario?.nome}</p>
                    <p className="text-xs text-gray-500">{usuario?.email}</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate("/signUser")}
                  >
                    Cadastrar novo usuário
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;