import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">🏢 Clientes e Transportadoras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between border-b py-3">
            <div className="w-full py-3">
              <p className="font-semibold">Transportadoras</p>
              {transporters.length === 0 ? (
                <p className="text-gray-600">Nenhuma transportadora cadastrada.</p>
              ) : (
                <ul className="flex flex-col gap-4 my-2 text-gray-700 w-full">
                  {transporters.map((transporter) => (
                    <li
                      key={transporter.id} 
                      className="flex justify-between w-full items-center py-3 px-2 rounded"
                    >
                      <span>{transporter.nome}</span>
                      <Button
                        onClick={() => removerTransportadora(transporter)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              )
                }
            </div>
          </div>
        </CardContent>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center border-b py-3">
            <div className="w-full py-3">
              <p className="font-semibold">Clientes</p>
              {clients.length === 0 ? (
                <p className="text-gray-600">Nenhum cliente cadastrado.</p>
              ) : (
                <ul className="flex flex-col gap-4 my-2 text-gray-700">
                  {clients.map((client) => ( 
                    <li key={client.id}
                      className="flex justify-between w-full items-center py-3 px-2 rounded"
                    >
                      <span>{client.nome}</span>
                      <Button
                        onClick={() => removerCliente(client)}
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              )
                }
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Lista de usuários pendentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">👥 Aprovação de Usuários Pendentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendentes.length === 0 ? (
            <p className="text-gray-600">Nenhum cadastro pendente.</p>
          ) : (
            pendentes.map((user) => (
              <div key={user.uid} className="flex justify-between items-center border-b py-3">
                <div>
                  <p className="font-semibold">{user.nome}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="text-xs text-orange-600">Cargo: {user.role}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => aprovarUsuario(user)} className="bg-green-600 hover:bg-green-700 text-white">
                    Aprovar
                  </Button>
                  <Button onClick={() => desaprovarUsuario(user)} variant="destructive">
                    Desaprovar
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Lista de usuários ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-blue-700">🔐 Usuários Ativos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ativos.length === 0 ? (
            <p className="text-gray-600">Nenhum usuário ativo.</p>
          ) : (
            <>
              {/* Consultores */}
              <h4 className="text-lg font-semibold text-gray-700 mt-4">👨‍💼 Consultores</h4>
              {ativos.filter((u) => u.role === "consultor").map((user) => (
                <div key={user.uid} className="flex justify-between items-center border-b py-3">
                  <div>
                    <p className="font-semibold">{user.nome}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => promoverConsultor(user)} className="bg-blue-600 text-white">
                      Promover a Supervisor
                    </Button>
                    <Button onClick={() => desaprovarUsuario(user)} variant="destructive">
                      Remover
                    </Button>
                  </div>
                </div>
              ))}

              {/* Adms */}
              <h4 className="text-lg font-semibold text-gray-700 mt-6">🛡️ Supervisores</h4>
              {ativos.filter((u) => u.role === "supervisor").map((user) => (
                <div key={user.uid} className="flex justify-between items-center border-b py-3">
                  <div>
                    <p className="font-semibold">{user.nome}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button onClick={() => desaprovarUsuario(user)} variant="destructive">
                    Remover
                  </Button>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
