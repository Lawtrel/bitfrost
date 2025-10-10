import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Eye, CheckCircle, Clock, AlertTriangle, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getVales, updateArquivoVale, updateValeStatus, Vale } from "@/services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BaixarVale = () => {
  const [vales, setVales] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [transportadoraFiltro, setTransportadoraFiltro] = useState("");
  const [modalVale, setModalVale] = useState<Vale | null>(null);
  const { toast } = useToast();
  const [valeSelecionado, setValeSelecionado] = useState<Vale | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [openModalUpload, setOpenModalUpload] = useState(false);

  const fetchVales = async () => {
  setLoading(true);
  setError(null);
  try {
    // 1. Buscar todos os vales via API
    const response = await getVales();
    const todosVales = response.data; // Vale[]
    console.log("Todos os vales:", todosVales);

    // 2. Filtrar só os “cadastrados” (ou “acumulado”, conforme seu status)
    const data = todosVales.filter((vale) => vale.status === "acumulado");
    console.log("Vales com status acumulado:", data);

    // 3. Verificar vencidos: se a data de vencimento já passou
    const hoje = new Date();

    // map para “atualizar status” localmente
    const valesAtivos = data.map(v => {
      const venc = new Date(v.dataVencimento);
      const novoStatus = venc < hoje ? "vencido" : v.status;
      return {
        ...v,
        status: novoStatus,
      };
    });

    const valesVencidos = valesAtivos.filter(v => v.status === "vencido");
    const valesPendentes = valesAtivos.filter(v => v.status !== "vencido");

    // 4. Atualizar no backend para os vales vencidos
    for (const vale of valesVencidos) {
      try {
        await updateValeStatus(vale.id, "vencido");
        console.log(`Vale ${vale.id} atualizado para vencido via API`);
      } catch (err) {
        console.error(`Erro ao atualizar status do vale ${vale.id}:`, err);
      }
    }

    // 5. Ajustar estado local com vales que não são vencidos
    setVales(valesPendentes);

  } catch (e) {
    console.error("Erro ao buscar dados do Dashboard:", e);
    setError("Falha ao carregar os vales.");
  } finally {
    setLoading(false);
  }
};

// Uso dentro de useEffect
useEffect(() => {
  fetchVales();
}, []);


const darBaixa = async (id: string) => {
  try {
    // 1. Encontrar o vale na lista local
    const valeParaBaixar = vales.find(vale => vale.id === id);
    if (!valeParaBaixar) {
      toast({
        title: "Erro",
        description: "Vale não encontrado",
        variant: "destructive",
      });
      return;
    }

    // 2. Chamar a API para atualizar o status para "processado"
    await updateValeStatus(id, "processado");

    // 3. Atualizar o estado local removendo ele dos pendentes
    setVales(old => old.filter(vale => vale.id !== id));

    toast({
      title: "✅ Vale processado com sucesso!",
      description: `Vale ${id} foi baixado e removido da lista pendente.`,
    });
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Erro",
      description: "Falha ao processar o vale. Tente novamente.",
      variant: "destructive",
    });
  }
};

  const valesFiltrados = vales.filter(vale => {
    const clienteMatch = vale.cliente.toLowerCase().includes(filtro.toLowerCase());
    const transportadoraMatch =  vale.transportadora.toLowerCase().includes(transportadoraFiltro.toLowerCase());
    return clienteMatch && transportadoraMatch;
  }).sort((a, b) => {
      const dataA = new Date(a.dataVencimento).getTime();
      const dataB = new Date(b.dataVencimento).getTime();
      return dataA - dataB; // mais próximo primeiro
    });;
  const transportadoras = Array.from(new Set(vales.map(vale => vale.transportadora ?? ""))).filter(t => t);

  const getStatusColor = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDays = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) return "text-red-600 bg-red-50";
    if (diffDays <= 3){
      return "text-orange-600 bg-orange-50";
    } 
    return "text-green-600 bg-green-50";
  };

  const getStatusIcon = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDays = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 0) return <AlertTriangle className="w-4 h-4" />;
    if (diffDays <= 3) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (loading) return <div className="p-6 text-center">Carregando vales...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  const confirmarContato = async () => {
    if (!valeSelecionado) return;

    try {
      // Envia para processados e remove dos cadastrados
      await darBaixa(valeSelecionado.id);

      setVales(old => old.filter(v => v.id !== valeSelecionado.id));
      setOpenModal(false);

      toast({
        title: "📞 Cliente contatado!",
        description: `Vale ${valeSelecionado.id} foi movido para processados.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Falha ao processar o contato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const baixarPDF = (vale: Vale) => {
    const doc = new jsPDF();
    const dataVencimentoFormatada = vale.dataVencimento
        ? new Date(vale.dataVencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        : '-';

    doc.setFontSize(18);
    doc.text(`Detalhes do Vale - VP-${vale.id}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Cliente", vale.cliente || "-"],
        ["Transportadora", vale.transportadora || "-"],
        ["Quantidade", `${vale.quantidade || 0} paletes`],
        ["Valor Unitário", `R$ ${vale.valorUnitario?.toFixed(2) || '0.00'}`],
        ["Data de Vencimento", dataVencimentoFormatada],
        ["Observações", vale.observacoes || "-"]
      ],
      theme: 'striped'
    });

    doc.save(`vale-${vale.id}.pdf`);
  };

  return (
    <>
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Processar Vales Recebidos</h1>
            <p className="text-green-100">Gerencie e dê baixa nos vales palete recebidos</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{vales.filter(vale => new Date(vale.dataVencimento) >= new Date()).length}</div>
            <div className="text-green-200">Vales Ativos</div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Filter className="h-5 w-5 text-blue-600" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">🔍 Buscar por Cliente</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Digite o nome do cliente..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">🚛 Buscar por Transportadora</label>
              <Input
                  placeholder="Digite o nome da transportadora..."
                  value={transportadoraFiltro}
                  onChange={(e) => setTransportadoraFiltro(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-blue-500"
                />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            📊 Encontrados {valesFiltrados.length} vale(s) correspondente(s) aos filtros aplicados
          </p>
        </div>

      {/* Vales List */}
      <div className="space-y-4">
        {valesFiltrados.map(vale => (
          <Card key={vale.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1 bg-blue-50 border-blue-300">{`VP-${vale.id}`}</Badge>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vale.dataVencimento.toString())}`}>
                    {getStatusIcon(vale.dataVencimento.toString())}
                    {new Date(vale.dataVencimento) < new Date() ? 'Vencido' :
                     Math.ceil((new Date(vale.dataVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) <= 3 ? 'Vence em breve' : 'No prazo'}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalVale(vale)}
                    className="hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                    {(() => {
                      const hoje = new Date();
                      const vencimento = new Date(vale.dataVencimento);
                      const diffDays = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
                      if (diffDays <= 3) {
                        // Vence em breve → contatar cliente
                        return (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setValeSelecionado(vale);
                              setOpenModal(true);
                            }}
                          >
                            Contatar Cliente
                          </Button>
                        );
                      }
                      return (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => darBaixa(vale.id)}
                          disabled={!vale.arquivoBase64 || !vale.arquivoNome || uploading === vale.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Dar Baixa
                        </Button>
                      );
                    })()}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      disabled={uploading === vale.id}
                      onClick={() => {
                        if (vale.arquivoBase64) {
                          setValeSelecionado(vale); // define o vale para o modal
                          setOpenModalUpload(true);        // abre o modal de confirmação
                        } else {
                          document.getElementById(`file-${vale.id}`)?.click();
                        }
                      }}
                    >
                      {uploading === vale.id ? "Enviando..." : "📤 Upload Arquivo"}
                    </Button>
                    <input
                      id={`file-${vale.id}`}
                      type="file"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(vale.id);
                        const reader = new FileReader();
                        reader.onload = async () => {
                          try {
                            const base64 = reader.result as string;
                            await updateArquivoVale(vale.id, base64, file.name);
                            toast({
                              title: "✅ Upload concluído!",
                              description: "Arquivo salvo no Banco de daos.",
                            });
                          } catch (err) {
                            console.error("Erro ao enviar arquivo:", err);
                            if (err.response) {
                              console.error("Resposta do servidor:", err.response.data);
                            }
                            toast({
                              title: "Erro",
                              description: "Falha ao enviar o arquivo.",
                              variant: "destructive",
                            });
                          } finally {
                            setUploading(null);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {openModalUpload && valeSelecionado && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                          <h2 className="text-xl font-semibold mb-4">Substituir Arquivo?</h2>
                          <p className="mb-6">Já existe um arquivo para este vale. Deseja substituí-lo?</p>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setOpenModal(false);
                                setValeSelecionado(null);
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() => {
                                setOpenModal(false);
                                document.getElementById(`file-${valeSelecionado.id}`)?.click();
                              }}
                            >
                              Substituir
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Download do arquivo em base64 */}
                    {vale.arquivoBase64 && vale.arquivoNome && (
                      <a
                        href={vale.arquivoBase64.startsWith("data:") ? vale.arquivoBase64 : `data:application/octet-stream;base64,${vale.arquivoBase64}`}
                        download={vale.arquivoNome}
                        className="inline-block mt-0 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        📥 Baixar Arquivo
                      </a>
                    )}
                    {openModal && valeSelecionado && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Cliente já foi contatado?
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Deseja dar baixa no vale <strong>{valeSelecionado.id}</strong> e mover para processados?
                      </p>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setOpenModal(false);
                            setValeSelecionado(null);
                          }}
                        >
                          Não, fechar
                        </Button>
                        <Button>
                          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=exemplo@email.com&su=Contato%20do%20site&body=Olá,%20quero%20saber%20mais..."
                            target="_blank" 
                            rel="noopener noreferrer">
                            Enviar email ao cliente
                          </a>
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={confirmarContato}
                        >
                          Sim, dar baixa
                        </Button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-xl text-gray-800 mb-3">{vale.cliente}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="text-sm font-medium text-gray-600 block">🚛 Transportadora</span><p className="font-semibold text-gray-800">{vale.transportadora}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="text-sm font-medium text-gray-600 block">📦 Quantidade</span><p className="font-semibold text-gray-800">{vale.quantidade} paletes</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="text-sm font-medium text-gray-600 block">📅 Vencimento</span><p className="font-semibold text-gray-800">{new Date(vale.dataVencimento).toLocaleDateString('pt-BR')}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="text-sm font-medium text-gray-600 block">💰 Valor</span><p className="font-semibold text-green-600">{`R$ ${((vale.valorUnitario || 0) * (vale.quantidade || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}</p></div>
                </div>
                  <Dialog open={!!modalVale} onOpenChange={() => setModalVale(null)}>
                    <DialogContent className="max-w-3xl rounded-2xl p-6">
                      {modalVale && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                              Vale {modalVale.id} - {modalVale.cliente}
                            </DialogTitle>
                            <DialogDescription>
                              Visualização detalhada do vale (tire print ou foto para registro).
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="block text-sm text-gray-600">🚛 Transportadora</span>
                              <p className="font-semibold">{modalVale.transportadora}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="block text-sm text-gray-600">📦 Quantidade</span>
                              <p className="font-semibold">{modalVale.quantidade} paletes</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="block text-sm text-gray-600">📅 Vencimento</span>
                              <p className="font-semibold">{new Date(modalVale.dataVencimento).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="block text-sm text-gray-600">💰 Valor</span>
                              <p className="font-semibold text-green-600">
                                {`R$ ${((modalVale.valorUnitario || 0) * (modalVale.quantidade || 0)).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}`}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-gray-800 mb-2">📝 Observações</h4>
                            <p className="text-gray-700">{modalVale.observacoes || "Sem observações."}</p>
                          </div>

                          <DialogFooter className="mt-6 flex justify-end">
                            <Button onClick={() => setModalVale(null)} variant="outline">
                              Fechar
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog> 
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
                    <h4 className="font-semibold text-gray-800 mb-2">📝 Detalhes Adicionais</h4>
                    <p className="text-gray-700 mb-4"><strong>Observações:</strong> {vale.observacoes}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="hover:bg-white" onClick={() => baixarPDF(vale)}><Download className="w-4 h-4 mr-2"/> Baixar PDF</Button>
                      <Button variant="outline" size="sm" className="hover:bg-white"><a href="https://mail.google.com/mail/?view=cm&fs=1&to=exemplo@email.com&su=Contato%20do%20site&body=Olá,%20quero%20saber%20mais..."
                            target="_blank" 
                            rel="noopener noreferrer">
                            📧 Enviar email ao cliente
                          </a>
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-white">📋 Copiar Dados</Button>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    {/* Summary Footer */}
      {vales.length > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{vales.length}</div>
                <div className="text-sm text-gray-600">Total de Vales Processados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  R${" "}
                  {vales
                    .reduce((acc, vale) => {
                      const valorUnitarioNum = vale.valorUnitario
                        ? Number(String(vale.valorUnitario).replace(/[R$\s\.]/g, "").replace(",", "."))
                        : 0;
                      const quantidadeNum = vale.quantidade || 0;
                      return acc + valorUnitarioNum * quantidadeNum;
                    }, 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {vales.reduce((acc, vale) => acc + vale.quantidade, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Paletes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BaixarVale;
