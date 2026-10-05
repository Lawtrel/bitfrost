import { useState } from "react";
import { Card } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  Button  from "@/components/ui/Button/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  createCliente,
  createTransportadora,
} from "@/services/api";

export default function CadastreSeUser() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    tipo: "cliente", // ou "transportadora"
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nome) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const admInfo = localStorage.getItem("usuario");
    const admLogado = admInfo ? JSON.parse(admInfo) : null;

    if (!admLogado || admLogado.role !== "adm") {
      toast({
        title: "❌ Sem administrador associado",
        description: "Você deve estar logado como administrador.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (form.tipo === "cliente") {

        // Chamada correta pro backend via axios
        await createCliente(form.nome); 

        toast({
          title: "✅ Cliente cadastrado",
          description: "Cliente cadastrado com sucesso.",
        });
        navigate("/dashboard/aprova-adm");
        setForm({ nome: "", tipo: "cliente" });
      } else {
          await createTransportadora(form.nome);
          toast({
            title: "✅ Transportadora cadastrada",
            description: "Transportadora cadastrada com sucesso.",
          });
          navigate("/dashboard/aprova-adm");
          setForm({ nome: "", tipo: "cliente" });
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast({
        title: "❌ Erro no cadastro",
        description: "Ocorreu um erro ao cadastrar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white p-6">
        <h1 className="text-2xl font-semibold mb-6">Cadastrar parceiro</h1>
        <form onSubmit={e => { e.preventDefault(); void handleSubmit(); }} className="space-y-5">
          <div><Label htmlFor="parceiro-tipo">Tipo de parceiro</Label><select id="parceiro-tipo" className="w-full border rounded-md p-3 mt-2" value={form.tipo} onChange={e => handleChange('tipo', e.target.value)}><option value="cliente">Cliente</option><option value="transportadora">Transportadora</option></select></div>
          <div><Label htmlFor="parceiro-nome">Nome</Label><Input id="parceiro-nome" required maxLength={120} value={form.nome} onChange={e => handleChange('nome', e.target.value)} /></div>
          <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar parceiro'}</Button>
        </form>
      </Card>
    </div>
  );
}
