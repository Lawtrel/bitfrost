
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ApontamentoVale = () => {
  const [formData, setFormData] = useState({
    tipoMovimento: "",
    valeId: "",
    cliente: "",
    transportadora: "",
    quantidade: "",
    dataMovimento: "",
    responsavel: "",
    observacoes: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Apontamento registrado!",
      description: `Movimento de ${formData.tipoMovimento.toLowerCase()} registrado com sucesso.`,
    });
    
    // Reset form
    setFormData({
      tipoMovimento: "",
      valeId: "",
      cliente: "",
      transportadora: "",
      quantidade: "",
      dataMovimento: "",
      responsavel: "",
      observacoes: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Apontamento de Vale Palete</h1>
        <p className="text-gray-600">Registre a entrega ou recebimento de vale-paletes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Movimento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipoMovimento">Tipo de Movimento</Label>
                    <Select 
                      value={formData.tipoMovimento} 
                      onValueChange={(value) => handleInputChange("tipoMovimento", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o movimento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrega">Entrega</SelectItem>
                        <SelectItem value="recebimento">Recebimento</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="valeId">ID do Vale</Label>
                    <Input
                      id="valeId"
                      placeholder="VP001"
                      value={formData.valeId}
                      onChange={(e) => handleInputChange("valeId", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente">Cliente</Label>
                    <Select 
                      value={formData.cliente} 
                      onValueChange={(value) => handleInputChange("cliente", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industria-abc">Indústria ABC Ltda</SelectItem>
                        <SelectItem value="metalurgica-xyz">Metalúrgica XYZ S.A.</SelectItem>
                        <SelectItem value="quimica-def">Química DEF Ind.</SelectItem>
                        <SelectItem value="construcao-alpha">Construção Alpha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transportadora">Transportadora</Label>
                    <Select 
                      value={formData.transportadora} 
                      onValueChange={(value) => handleInputChange("transportadora", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a transportadora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transportes-silva">Transportes Silva</SelectItem>
                        <SelectItem value="logtrans">LogTrans Express</SelectItem>
                        <SelectItem value="rodo-cargo">Rodo Cargo</SelectItem>
                        <SelectItem value="transcarga">TransCarga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade de Paletes</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      placeholder="0"
                      value={formData.quantidade}
                      onChange={(e) => handleInputChange("quantidade", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataMovimento">Data do Movimento</Label>
                    <Input
                      id="dataMovimento"
                      type="date"
                      value={formData.dataMovimento}
                      onChange={(e) => handleInputChange("dataMovimento", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input
                      id="responsavel"
                      placeholder="Nome do responsável"
                      value={formData.responsavel}
                      onChange={(e) => handleInputChange("responsavel", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações adicionais sobre o movimento..."
                    rows={4}
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Registrar Movimento
                  </Button>
                  <Button type="button" variant="outline">
                    Limpar Formulário
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Últimos Movimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="font-medium text-green-800">Entrega Registrada</p>
                <p className="text-sm text-green-600">15 paletes - Cliente ABC</p>
                <p className="text-xs text-green-500">há 10 minutos</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="font-medium text-blue-800">Recebimento</p>
                <p className="text-sm text-blue-600">8 paletes - Transp. Silva</p>
                <p className="text-xs text-blue-500">há 25 minutos</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <p className="font-medium text-purple-800">Transferência</p>
                <p className="text-sm text-purple-600">12 paletes - Interno</p>
                <p className="text-xs text-purple-500">há 1 hora</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Dicas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use o ID do vale para rastreamento automático</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Registre movimentos em tempo real</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Adicione observações para histórico detalhado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApontamentoVale;
