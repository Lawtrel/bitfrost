import { useState, useEffect, useCallback } from 'react';
import { getVales, Vale } from '../services/api'; // Importando de nosso novo serviço

export const useVales = (statusFilter?: 'acumulado' | 'processado' | 'vencido') => {
  const [vales, setVales] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVales();
      let filteredVales = response.data;

      // Se um filtro de status for fornecido, aplica o filtro
      if (statusFilter) {
        filteredVales = response.data.filter(
          (vale) => vale.status === statusFilter
        );
      }
      
      setVales(filteredVales);
    } catch (err) {
      console.error("Erro ao buscar vales:", err);
      setError('Não foi possível carregar os vales.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchVales();
  }, [fetchVales]);

  // Retornamos a função fetchVales para que os componentes possam recarregar a lista
  return { vales, loading, error, refetchVales: fetchVales };
};