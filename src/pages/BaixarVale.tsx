import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search } from "lucide-react";
import { useVales, Vale } from '@/hooks/useVales'; // 1. Importar nosso hook
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BaixarVale = () => {
  // 2. Usar o hook para buscar e dar baixa nos vales
  const { buscarVales, baixarVale, loading } = useVales();
  const [vales, setVales] = useState<Vale[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVale, setSelectedVale] = useState<Vale | null>(null);

  // 3. Efeito para buscar os vales pendentes do Firebase
  useEffect(() => {
    const fetchVales = async () => {
      setError(null);
      try {
        const data = await buscarVales('valescadastrados', 'acumulado');
        setVales(data);
      } catch (e) {
        setError("Falha ao carregar os vales pendentes.");
        console.error(e);
      }
    };
    fetchVales();
  }, []); // O array vazio [] garante que a busca ocorra apenas uma vez

  const handleSearch = () => {
    const foundVale = vales.find(v => v.id === searchTerm);
    if (foundVale) {
      setSelectedVale(foundVale);
      setError(null);
    } else {
      setSelectedVale(null);
      setError(`Nenhum vale acumulado encontrado com o ID: ${searchTerm}`);
    }
  };

  const handleBaixarVale = async () => {
    if (selectedVale && selectedVale.id) {
      await baixarVale(selectedVale.id);
      // Após a baixa, limpa a seleção e atualiza a lista de vales
      setSelectedVale(null);
      setSearchTerm("");
      const data = await buscarVales('valescadastrados', 'acumulado');
      setVales(data);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Processar Vales Recebidos</h1>
        <p className="text-gray-600">Busque um vale pelo ID para dar baixa no sistema.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Buscar Vale por ID</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Digite o ID do vale (ex: VP-12345)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto h-12">
            {loading ? 'Buscando...' : 'Buscar Vale'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedVale && (
        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Detalhes do Vale Encontrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-800">{selectedVale.cliente}</h3>
              <Badge className="font-mono text-lg px-3 py-1">
                {`VP-${selectedVale.id}`}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg">
              <div><span className="text-sm font-medium text-gray-600 block">Transportadora</span><p className="font-semibold text-gray-800">{selectedVale.transportadora}</p></div>
              <div><span className="text-sm font-medium text-gray-600 block">Quantidade</span><p className="font-semibold text-gray-800">{selectedVale.quantidade} paletes</p></div>
              <div><span className="text-sm font-medium text-gray-600 block">Data de Criação</span><p className="font-semibold text-gray-800">{new Date(selectedVale.dataCriacao).toLocaleDateString('pt-BR')}</p></div>
            </div>
            <Button onClick={handleBaixarVale} disabled={loading} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-6 h-6 mr-3" />
              {loading ? 'Processando...' : 'Confirmar Baixa do Vale'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BaixarVale;