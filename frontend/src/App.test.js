// App.test.js

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Verifica que la pantalla de login se muestre en la ruta "/"
test('muestra login en la ruta inicial', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
