import { Outlet, useLocation, useNavigate } from "react-router-dom";
// CORREÇÃO: Adicionamos SidebarProvider e garantimos que AppSidebar é uma importação nomeada
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar-button/sidebar";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import  Button from "@/components/ui/Button/button";
import { useEffect } from "react";
import { clearSession } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: usuario, loading: checkingSession, error: sessionError, retry } = useAuth();
  const isAdm = usuario?.role === 'adm';
  const online = usuario !== null;

  useEffect(() => {
    if (!checkingSession && !usuario && !sessionError) navigate('/login', { replace: true });
  }, [checkingSession, usuario, sessionError, navigate]);

  const handleLogout = () => {
    clearSession();
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
      case "/dashboard/aprova-adm": return "Administração";
      case "/dashboard/cadastra-seClientOrTransporter": return "Cadastrar parceiro";
      default: return "Bifrost";
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

 if (checkingSession) return <p role="status">Verificando sessão...</p>;
 if (sessionError) return <div className="p-6 space-y-4"><p role="alert">{sessionError}</p><Button onClick={retry}>Tentar novamente</Button><Button variant="outline" onClick={handleLogout}>Sair</Button></div>;
 if (!usuario) return null;
 return (
    // CORREÇÃO: Envolvemos tudo com o SidebarProvider
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50">
        <AppSidebar role={usuario.role} />
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
              {isAdm ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:bg-blue-500 border border-black"
                >
                  <a href="/dashboard/aprova-adm">Dashboard do Administrador</a>
                </Button>
              ) : (
                <></>
              )}

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
                    variant="primary"
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
            <Outlet context={usuario} />
          </main>
          <footer className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>© {new Date().getFullYear()} Bifrost</span>
                <div className={`flex items-center gap-2 text-xs ${online ? "text-green-700" : "text-red-700"} font-medium`}>
                  <div className={`w-2 h-2 ${online ? "bg-green-500" : "bg-red-500"} rounded-full animate-pulse`}></div>
                  { online ? "Sistema Online" : "Sistema Offline"}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <span>Gestão de vales palete</span>
                <span>•</span>

              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
