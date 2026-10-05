import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import RequireRole from './RequireRole';

afterEach(cleanup);
describe('permissão das telas', () => {
  for (const role of ['adm', 'supervisor', 'consultor']) {
    it(`valida acesso de ${role} à emissão de vales`, async () => {
      render(<MemoryRouter initialEntries={['/dashboard/criar']}><Routes>
        <Route path="/dashboard" element={<Outlet context={{ role }} />}>
          <Route index element={<p>Visão geral</p>} />
          <Route path="criar" element={<RequireRole roles={['adm', 'supervisor']}><p>Emissão de vales</p></RequireRole>} />
        </Route>
      </Routes></MemoryRouter>);
      expect(await screen.findByText(role === 'consultor' ? 'Visão geral' : 'Emissão de vales')).toBeInTheDocument();
    });
  }
});
