// src/components/TransportadoraSearch/index.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Transportadora } from '@/services/api';

interface TransportadoraSearchProps {
  transportadoras: Transportadora[];
  onTransportadoraSelect: (transportadora: Transportadora) => void;
}

const TransportadoraSearch: React.FC<TransportadoraSearchProps> = ({ transportadoras, onTransportadoraSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransportadoras, setFilteredTransportadoras] = useState<Transportadora[]>([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredTransportadoras(
        transportadoras.filter(t =>
          t.nome.toLowerCase().includes(term.toLowerCase())
        )
      );
      setIsListVisible(true);
    } else {
      setIsListVisible(false);
    }
  };

  const handleSelect = (transportadora: Transportadora) => {
    setSearchTerm(transportadora.nome);
    onTransportadoraSelect(transportadora);
    setIsListVisible(false);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => searchTerm && setIsListVisible(true)}
        placeholder="Digite para buscar uma transportadora..."
      />
      {isListVisible && filteredTransportadoras.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {filteredTransportadoras.map(t => (
            <li
              key={t.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(t)}
            >
              {t.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransportadoraSearch;