import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

export interface Cliente {
  id: string;
  nome: string;
}

interface ClientSearchProps {
  clientes: Cliente[];
  onClientSelect: (client: Cliente) => void;
}

const ClienteSearch = ({ clientes, onClientSelect }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Cliente[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clientes) {
      setResults(clientes);
    }
  }, [clientes]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = (clientes || []).filter(client =>
        client.nome && typeof client.nome === 'string' && client.nome.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(clientes || []);
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
       <Label className="text-sm font-medium text-gray-700">🏢 Cliente *</Label>
      <Input
        placeholder="Pesquisar cliente..."
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        className="h-12 border-2 focus:border-blue-500"
        autoComplete="off"
      />
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-48 overflow-auto">
          {results.length > 0 ? results.map((client) => (
            <div
              key={client.id}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded"
              onClick={() => {
                onClientSelect(client);
                // --- CORREÇÃO AQUI ---
                // Garante que o valor seja sempre uma string
                setSearchTerm(client.nome || ""); 
                setIsOpen(false);
              }}
            >
              {client.nome || 'Cliente sem nome'}
            </div>
          )) : <div className="p-2 text-sm text-gray-500">Nenhum cliente encontrado.</div>}
        </div>
      )}
    </div>
  );
};

export default ClienteSearch;