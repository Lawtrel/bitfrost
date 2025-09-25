// src/pages/CriarVale.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createVale, getClientes, getTransportadoras, Cliente, Transportadora } from "@/services/api";
import ClientSearch from "@/components/ClientSearch";
import TransportadoraSearch from "@/components/TransportadoraSearch";

export default function CriarVale() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: "",
    transportadora: "",
    quantidade: "",
    valorUnitario: "",
    dataVencimento: "",
    observacoes: "",
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, transportadorasRes] = await Promise.all([
          getClientes(),
          getTransportadoras()
        ]);
        setClientes(clientesRes.data);
        setTransportadoras(transportadorasRes.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar clientes e transportadoras.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleClientSelect = (clientName: string) => {
    setFormData((prev) => ({ ...prev, cliente: clientName }));
  };

  const handleTransportadoraSelect = (transportadoraName: string) => {
    setFormData((prev) => ({ ...prev, transportadora: transportadoraName }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { cliente, transportadora, quantidade, valorUnitario, dataVencimento } = formData;
    if (!cliente || !transportadora || !quantidade || !valorUnitario || !dataVencimento) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const valeParaSalvar = {
        cliente,
        transportadora,
        quantidade: parseInt(quantidade),
        valorUnitario: parseFloat(valorUnitario.replace(',', '.')),
        dataVencimento: new Date(dataVencimento).toISOString(),
        observacoes: formData.observacoes,
        status: 'acumulado',
      };

      await createVale(valeParaSalvar);

      toast({
        title: "Sucesso!",
        description: "O vale foi criado e enviado para aprovação.",
      });
      navigate('/vales-acumulados');
    } catch (error) {
      console.error("Erro ao criar vale:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o vale. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Vale</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cliente">Cliente</Label>
          <ClientSearch
            clients={clientes}
            onClientSelect={handleClientSelect}
          />
        </div>
        <div>
          <Label htmlFor="transportadora">Transportadora</Label>
          <TransportadoraSearch
            transportadoras={transportadoras}
            onTransportadoraSelect={handleTransportadoraSelect}
          />
        </div>
        <div>
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input id="quantidade" type="number" value={formData.quantidade} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="valorUnitario">Valor Unitário</Label>
          <Input id="valorUnitario" type="text" value={formData.valorUnitario} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input id="dataVencimento" type="date" value={formData.dataVencimento} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" value={formData.observacoes} onChange={handleChange} />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Vale'}
        </Button>
      </form>
    </div>
  );
}