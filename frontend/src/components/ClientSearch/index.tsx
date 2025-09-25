// src/components/ClientSearch/index.tsx
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Cliente } from '../../services/api'; // Importa a interface

interface ClientSearchProps {
  clients: Cliente[];
  onClientSelect: (clientName: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ clients, onClientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Cliente[]>([]);
  const [isListVisible, setIsListVisible] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredClients(
        clients.filter(client =>
          client.nome.toLowerCase().includes(term.toLowerCase())
        )
      );
      setIsListVisible(true);
    } else {
      setIsListVisible(false);
    }
  };

  const handleSelectClient = (client: Cliente) => {
    setSearchTerm(client.nome);
    onClientSelect(client.nome);
    setIsListVisible(false);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => searchTerm && setIsListVisible(true)}
        placeholder="Digite para buscar um cliente..."
      />
      {isListVisible && filteredClients.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {filteredClients.map(client => (
            <li
              key={client.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectClient(client)}
            >
              {client.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientSearch;