// src/modules/home/components/credit/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos el inicio de sesión
    // En una implementación real, aquí se verificaría la autenticación con la API
    // Por ahora, simplemente redirigimos al usuario a la página de inicio
    onLogin();
    navigate('/home');
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Iniciar Sesión
          </button>
        </div>
      </form>
      <div className="mt-4">
        <button
          onClick={() => navigate('/registro')}
          className="text-blue-500 hover:text-blue-700"
        >
          No tienes una cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
};