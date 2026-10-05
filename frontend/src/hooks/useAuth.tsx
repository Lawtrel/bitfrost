import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { clearSession, getSession, SESSION_CLEARED, type Usuario } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const retry = () => {
    setError(null);
    setLoading(true);
    setAttempt(value => value + 1);
  };

  useEffect(() => {
    let active = true;
    const endSession = () => {
      // Invalida também uma consulta de sessão que ainda esteja em andamento.
      active = false;
      setUser(null);
      setError(null);
      setLoading(false);
    };
    window.addEventListener(SESSION_CLEARED, endSession);
    getSession().then(({ data }) => {
      if (!active) return;
      localStorage.setItem('usuario', JSON.stringify(data));
      setUser(data);
    }).catch(cause => {
      if (!active) return;
      if (isAxiosError(cause) && cause.response?.status === 401) clearSession();
      else setError('Não foi possível confirmar sua sessão. Tente novamente.');
    }).finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      window.removeEventListener(SESSION_CLEARED, endSession);
    };
  }, [attempt]);

  return { user, loading, error, retry, isAuthenticated: user !== null };
};
