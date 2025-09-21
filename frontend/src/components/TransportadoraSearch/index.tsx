import { useState, useRef, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export interface Transportadora {
  id: string;
  nome: string;
}

interface TransportadoraSearchProps {
  transportadoras: Transportadora[];
  onTransportadoraSelect: (transportadora: Transportadora) => void;
}

const TransportadoraSearch = ({ transportadoras, onTransportadoraSelect }: TransportadoraSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Transportadora[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transportadoras) {
      setResults(transportadoras);
    }
  }, [transportadoras]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = (transportadoras || []).filter(transp =>
        transp.nome && typeof transp.nome === 'string' && transp.nome.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(transportadoras || []);
    }
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <Label className="text-sm font-medium text-gray-700">🚛 Transportadora *</Label>
      <Input
        placeholder="Pesquisar transportadora..."
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        className="h-12 border-2 focus:border-blue-500"
        autoComplete="off"
      />
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-48 overflow-auto">
          {results.length > 0 ? results.map((transportadora) => (
            <div
              key={transportadora.id}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded"
              onClick={() => {
                onTransportadoraSelect(transportadora);
                // --- CORREÇÃO AQUI ---
                // Garante que o valor seja sempre uma string
                setSearchTerm(transportadora.nome || "");
                setIsOpen(false);
              }}
            >
              {transportadora.nome || 'Transportadora sem nome'}
            </div>
          )) : <div className="p-2 text-sm text-gray-500">Nenhuma transportadora encontrada.</div>}
        </div>
      )}
    </div>
  );
};

export default TransportadoraSearch;