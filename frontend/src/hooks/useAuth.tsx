import { useEffect, useState } from 'react';
import { clearSession, getSession, SESSION_CLEARED, type Usuario } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const endSession = () => {
      // Invalida também uma consulta de sessão que ainda esteja em andamento.
      active = false;
      setUser(null);
      setLoading(false);
    };
    window.addEventListener(SESSION_CLEARED, endSession);
    getSession().then(({ data }) => {
      if (!active) return;
      localStorage.setItem('usuario', JSON.stringify(data));
      setUser(data);
    }).catch(() => {
      if (active) clearSession();
    }).finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      window.removeEventListener(SESSION_CLEARED, endSession);
    };
  }, []);

  return { user, loading, isAuthenticated: user !== null };
};
