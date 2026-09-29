import { Navigate, useOutletContext } from 'react-router-dom';
import type { ReactElement } from 'react';

export default function RequireRole({ roles, children }: { roles: string[]; children: ReactElement }) {
  // O Layout só fornece este contexto depois de consultar /admins/me.
  const user = useOutletContext<{ role: string } | null>();
  return user && roles.includes(user.role) ? children : <Navigate to="/dashboard" replace />;
}
