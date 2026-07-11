import { Card } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import  Button  from "@/components/ui/button/button";
import { Cliente, Transportadora } from "@/pages/CriarVale";
import ClienteSearch from "@/components/ClientSearch";
import TransportadoraSearch from "@/components/TransportadoraSearch";
import { FileText, Plus, Save } from "lucide-react";
import { useToast } from "../use-toast";
import { useEffect } from "react";

// Interface atualizada para corresponder ao que 'CriarVale' envia
interface FormCreatePaletProps {
  formData: {
    cliente: string;
    transportadora: string;
    quantidade: string;
    dataVencimento: string;
    observacoes: string;
    valorUnitario: string;
  };
  clientes: Cliente[];
  transportadoras: Transportadora[];
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function FormCreatePalet({
  formData,
  clientes,
  transportadoras,
  onInputChange,
  onSubmit,
  isLoading,
}: FormCreatePaletProps) {
  const { toast } = useToast();
  const DRAFT_KEY = "formCreatePalet_draft";

  const salvarRascunho = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    toast({
      title: "💾 Rascunho salvo",
      description: "Os dados foram salvos localmente.",
    });
  };
   // 🔹 Carregar rascunho salvo no primeiro render
    useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // percorre as chaves do rascunho e atualiza o formulário
        Object.keys(parsedDraft).forEach((key) => {
          onInputChange(key, parsedDraft[key as keyof typeof parsedDraft]);
        });
        toast({
          title: "📂 Rascunho carregado",
          description: "Dados recuperados do último rascunho salvo.",
        });
      } catch (err) {
        console.error("Erro ao carregar rascunho:", err);
      }
    }
    }, []);

  // --- ESTA É A CORREÇÃO CRUCIAL ---
  // Esta função recebe o cliente selecionado e informa a página principal
  const handleClienteSelect = (cliente: Cliente) => {
    onInputChange("cliente", cliente.nome);
  };
  
  // Esta função recebe a transportadora selecionada e informa a página principal
  const handleTransportadoraSelect = (transportadora: Transportadora) => {
    onInputChange("transportadora", transportadora.nome);
  };

  return (
    <div className="lg:col-span-2">
      <Card className="shadow-lg border-0">
      </Card>
    </div>
  );
}