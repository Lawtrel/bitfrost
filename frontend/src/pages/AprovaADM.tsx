import { useEffect, useState } from "react";
import { Card} from "@/components/ui/card/card";
import  Button  from "@/components/ui/button/button";
import { useToast } from "@/hooks/use-toast";
import { deleteCliente, deleteTransportadora, deleteUsuario, getClientes, getTransportadoras, getUsuariosByStatus, updateUsuariosByRole, updateUsuariosByStatus } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import { Cliente, Transportadora } from "./CriarVale";


interface Usuario {
  uid: string;
  nome: string;
  email: string;
  role: string;
  status: string;
}

export default function AprovarAdms() {
  const [pendentes, setPendentes] = useState<Usuario[]>([]);
  const [ativos, setAtivos] = useState<Usuario[]>([]);
  const [transporters, setTransporters] = useState<Transportadora[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    try {
      // Busca usuários com status 'pendente'
      const pendentes = await getUsuariosByStatus("pendente");
      const dataPendentes = pendentes.data.map((user: any) => ({
        uid: user.id, 
        nome: user.nome,
        email: user.email,
        role: user.role,
        status: user.status,
      }));
      setPendentes(dataPendentes.filter((user: Usuario) => user.status === "pendente"));

      // Busca usuários com status 'ativo'
      const ativos =  await getUsuariosByStatus("ativo");;
      const dataAtivos = pendentes.data.map((user: any) => ({
        uid: user.id, 
        nome: user.nome,
        email: user.email,
        role: user.role,
        status: user.status,
      }));
      setAtivos(dataAtivos.filter((user: Usuario) => user.status === "ativo"));

    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({ title: "Erro ao carregar", description: "Não foi possível buscar a lista de colaboradores.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const aprovarUsuario = async (user: Usuario) => {
    try {
      await updateUsuariosByStatus(user.uid, "ativo" );
      toast({ title: "✅ Aprovado", description: `${user.nome} agora está ativo.` });
      fetchUsuarios(); // Re-busca os usuários para atualizar as listas
    } catch {
      toast({ title: "Erro", description: "Não foi possível aprovar", variant: "destructive" });
    }
  };


  const desaprovarUsuario = async (user: Usuario) => {
    try {
      await deleteUsuario(user.uid);
      toast({ title: "🗑️ Removido", description: `${user.nome} foi removido.` });
      fetchUsuarios(); // Re-busca os usuários para atualizar as listas
    } catch {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };

  const promoverConsultor = async (user: Usuario) => {
    try {
      await updateUsuariosByRole(user.uid, "supervisor" );
      toast({ title: "🚀 Promovido", description: `${user.nome} agora é supervisor.` });
      fetchUsuarios(); // Re-busca os usuários para atualizar as listas
    } catch {
      toast({ title: "Erro", description: "Falha ao promover", variant: "destructive" });
    }
  };
  useEffect(() => {
    buscarTransportadoras();
    buscarClientes();
  }, []);
  const buscarTransportadoras = async () => {
    try{
      const transportadoras = await getTransportadoras();
      const reponse = transportadoras.data.map((t) =>({
        id: t.id,
        nome: t.nome
      }) 
    );
      setTransporters(reponse);

      console.log(transportadoras.data);
    }catch(error){
      console.error("Erro ao buscar transportadoras:", error);
      toast({ title: "Erro ao carregar", description: "Não foi possível buscar a lista de transportadoras.", variant: "destructive" });
    }
  };
  const buscarClientes = async () => {
    try{
      const clientes = await getClientes();
      setClients(clientes.data.map((t) => ({
        id: t.id,
        nome: t.nome
      })));
    }catch(error){
      console.error("Erro ao buscar transportadoras:", error);
      toast({ title: "Erro ao carregar", description: "Não foi possível buscar a lista de transportadoras.", variant: "destructive" });
    }
  };
  const removerTransportadora = async (transporter: Transportadora) => {
    try {
      await deleteTransportadora(transporter.id);
      toast({ title: "🗑️ Removido", description: `${transporter.nome} foi removido.` });
      fetchUsuarios(); // Re-busca os usuários para atualizar as listas
    } catch {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };
  const removerCliente= async (client: Cliente) => {
    try {
      await deleteCliente(client.id);
      toast({ title: "🗑️ Removido", description: `${client.nome} foi removido.` });
      fetchUsuarios(); // Re-busca os usuários para atualizar as listas
    } catch {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <Button
        variant="secondary"
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => navigate("/dashboard/cadastra-seClientOrTransporter")}
      >
        Cadastrar novo Cliente/Transportadora
      </Button>
      {/* Lista de Clientes e Transportadoras */}
      <Card>
        
      </Card>
      {/* Lista de usuários pendentes */}
      <Card>
        
      </Card>

      {/* Lista de usuários ativos */}
      <Card>
        
      </Card>
    </div>
  );
}
