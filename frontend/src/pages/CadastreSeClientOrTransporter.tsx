import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  createCliente,
  createTransportadora,
  getClientes,
  getTransportadoras,
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
        navigate("/dashboard/cadastre-se");
        setForm({ nome: "", tipo: "cliente" });
      } else {
        const transportadoras = await getTransportadoras();
        const existe = transportadoras.data.some(
          (t: any) => t.nome.toLowerCase() === form.nome.toLowerCase()
        );

        if (existe) {
          toast({
            title: "❌ Transportadora já cadastrada",
            description: "Já existe uma transportadora com esse nome.",
            variant: "destructive",
          });
        } else {
          await createTransportadora(form.nome);
          toast({
            title: "✅ Transportadora cadastrada",
            description: "Transportadora cadastrada com sucesso.",
          });
          navigate("/dashboard/aprova-adm");
          setForm({ nome: "", tipo: "cliente" });
        }
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
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-gray-800">
            Cadastro de Cliente / Transportadora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option value="cliente">Cliente</option>
              <option value="transportadora">Transportadora</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
