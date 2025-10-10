import axios from 'axios';

// Define a URL base da nossa API.
// Durante o desenvolvimento, será http://localhost:3001
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
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
  arquivoBase64?: string;
  arquivoNome?: string;
}

export interface Cliente {
    id: string;
    nome: string;
}

export interface Transportadora {
    id: string;
    nome: string;
}
export interface Usuario {
    id: string;
    nome: string;
    senha: string;
    email: string;
    role: string;
    status: string;
}


// --- FUNÇÕES DE API ---

//Usuários
export const createUsuario = (usuario: Omit<Usuario, "id">) => api.post('/admins', usuario);
export const getUsuariosByRole = (role: string) => api.get<Usuario[]>(`/admins?role=${role}`);
export const loginUsuario = (email: string, senha: string) => api.post<Usuario>('/admins/login', { email, senha });
export const getUsuariosByEmail = (email: string) => api.get<Usuario[]>(`/admins?email=${email}`);
export const getUsuariosByStatus = (status: string) => api.get<Usuario[]>(`/admins?status=${status}`);
export const updateUsuariosByStatus = (id: string, status: string) => api.put<Usuario[]>(`/admins/${id}/status`, { status });
export const updateUsuariosByRole = (id: string, role: string) => api.put<Usuario[]>(`/admins/${id}/role`, { role });
export const deleteUsuario = (id: string) => api.delete<Usuario[]>(`/admins/${id}`);

// Vales
export const getVales = () => api.get<Vale[]>('/vales');
export const createVale = (valeData: Omit<Vale, 'id' | 'dataCriacao'>) => api.post('/vales', valeData);
export const updateValeStatus = (id: string, status: string) => api.put(`/vales/${id}`, { status });
export const updateArquivoVale = (id: string, arquivoBase64: string, arquivoNome: string) => api.put(`/vales/${id}`, { arquivoBase64, arquivoNome });
export const deleteVale = (id: string) => api.delete(`/vales/${id}`);

// Clientes
export const getClientes = () => api.get<Cliente[]>('/clientes');
export const createCliente = (nome: string) => api.post('/clientes', {nome});

// Transportadoras
export const getTransportadoras = () => api.get<Transportadora[]>('/transportadoras');
export const createTransportadora = (nome: string) => api.post('/transportadoras', { nome });

export default api;