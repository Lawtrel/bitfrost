import { useEffect, useState } from "react";
import { Card} from "@/components/ui/card/card";
import  Button  from "@/components/ui/Button/button";
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
      const dataAtivos = ativos.data.map((user: any) => ({
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
      buscarTransportadoras();
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
      <Card className="p-6 bg-white space-y-4"><h1 className="text-2xl font-semibold">Parceiros cadastrados</h1>
        <h2 className="font-semibold">Clientes</h2>{clients.length ? clients.map(c => <p key={c.id}>{c.nome}</p>) : <p>Nenhum cliente cadastrado.</p>}
        <h2 className="font-semibold">Transportadoras</h2>{transporters.length ? transporters.map(t => <p key={t.id}>{t.nome}</p>) : <p>Nenhuma transportadora cadastrada.</p>}
      </Card>
      <Card className="p-6 bg-white space-y-4"><h2 className="text-xl font-semibold">Colaboradores aguardando aprovação</h2>
        {pendentes.length ? pendentes.map(u => <div key={u.uid} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><div><p className="font-semibold">{u.nome}</p><p>{u.email} · {u.role}</p></div><Button onClick={() => aprovarUsuario(u)}>Aprovar {u.nome}</Button></div>) : <p>Nenhum cadastro pendente.</p>}
      </Card>

      <Card className="p-6 bg-white space-y-4"><h2 className="text-xl font-semibold">Colaboradores ativos</h2>
        {ativos.length ? ativos.map(u => <div key={u.uid} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><div><p className="font-semibold">{u.nome}</p><p>{u.email} · {u.role}</p></div>{u.role === 'consultor' && <Button variant="outline" onClick={() => promoverConsultor(u)}>Promover {u.nome} a supervisor</Button>}</div>) : <p>Nenhum colaborador ativo.</p>}
      </Card>
    </div>
  );
}
