import axios from 'axios';

// Define a URL base da nossa API.
// Durante o desenvolvimento, será http://localhost:3001
const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

// --- TIPOS (para ajudar o TypeScript) ---
// É uma boa prática definir os tipos dos dados que esperamos da API
export interface Vale {
  id: string;
  cliente: string;
  transportadora: string;
  quantidade: number;
  valorUnitario: number;
  dataVencimento: string; // A API retorna como string ISO
  dataCriacao: string;
  observacoes?: string;
  status: string;
}

export interface Cliente {
    id: string;
    nome: string;
}

export interface Transportadora {
    id: string;
    nome: string;
}


// --- FUNÇÕES DE API ---

// Vales
export const getVales = () => api.get<Vale[]>('/vales');
export const createVale = (valeData: Omit<Vale, 'id' | 'dataCriacao'>) => api.post('/vales', valeData);
export const updateValeStatus = (id: string, status: string) => api.put(`/vales/${id}`, { status });
export const deleteVale = (id: string) => api.delete(`/vales/${id}`);

// Clientes
export const getClientes = () => api.get<Cliente[]>('/clientes');
export const createCliente = (nome: string) => api.post('/clientes', { nome });

// Transportadoras
export const getTransportadoras = () => api.get<Transportadora[]>('/transportadoras');
export const createTransportadora = (nome: string) => api.post('/transportadoras', { nome });

export default api;