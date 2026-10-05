import { Card } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import  Button  from "@/components/ui/Button/button";
import type { Cliente, Transportadora } from "@/pages/CriarVale";
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
      <Card className="shadow-lg border-0 bg-white p-6">
        <h2 className="text-xl font-semibold mb-6">Dados do vale</h2>
        <form onSubmit={event => { event.preventDefault(); onSubmit(); }} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Label htmlFor="vale-cliente">Cliente</Label>
              <select id="vale-cliente" required value={formData.cliente} onChange={e => onInputChange('cliente', e.target.value)} className="w-full border rounded-md p-3 mt-2">
                <option value="">Selecione um cliente</option>{clientes.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              </select>
            </div>
            <div><Label htmlFor="vale-transporte">Transportadora</Label>
              <select id="vale-transporte" required value={formData.transportadora} onChange={e => onInputChange('transportadora', e.target.value)} className="w-full border rounded-md p-3 mt-2">
                <option value="">Selecione uma transportadora</option>{transportadoras.map(t => <option key={t.id} value={t.nome}>{t.nome}</option>)}
              </select>
            </div>
            <div><Label htmlFor="vale-quantidade">Quantidade de paletes</Label><Input id="vale-quantidade" type="number" required min="1" step="1" value={formData.quantidade} onChange={e => onInputChange('quantidade', e.target.value)} /></div>
            <div><Label htmlFor="vale-valor">Valor unitário (R$)</Label><Input id="vale-valor" type="number" required min="0" step="0.01" value={formData.valorUnitario} onChange={e => onInputChange('valorUnitario', e.target.value)} /></div>
            <div><Label htmlFor="vale-vencimento">Vencimento</Label><Input id="vale-vencimento" type="date" required value={formData.dataVencimento} onChange={e => onInputChange('dataVencimento', e.target.value)} /></div>
          </div>
          <div><Label htmlFor="vale-observacoes">Observações</Label><Textarea id="vale-observacoes" value={formData.observacoes} onChange={e => onInputChange('observacoes', e.target.value)} /></div>
          {(!clientes.length || !transportadoras.length) && <p className="text-sm text-amber-800">Peça ao administrador para cadastrar clientes e transportadoras antes da emissão.</p>}
          <div className="flex flex-wrap gap-3"><Button type="submit" disabled={isLoading || !clientes.length || !transportadoras.length}>{isLoading ? 'Criando...' : 'Criar vale'}</Button><Button type="button" variant="outline" onClick={salvarRascunho}>Salvar rascunho</Button></div>
        </form>
      </Card>
    </div>
  );
}
