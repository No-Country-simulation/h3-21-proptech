// src/components/Register.tsx
import React, { useState } from 'react';
import { creditScoreService } from '../../../../services/creditScoreService.ts';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [income, setIncome] = useState<number>(0);
    const [creditHistory, setCreditHistory] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const userData = {
          username,
          password,
          income,
          credit_history: creditHistory
        };
  
        // Crear el puntaje crediticio en la API
        const score = await creditScoreService.createCreditScore(userData);
        console.log("el score es: ", score);
  
        // Calcular el puntaje crediticio
        const calculatedScore = await creditScoreService.calculateCreditScore(score.id);
        console.log("el puntaje es: ", calculatedScore);
  
        console.log('Usuario registrado y puntaje crediticio calculado:', calculatedScore);
        setError(null);
        // Redirigir a la página de inicio
        navigate('/home');
      } catch (err) {
        setError('Error al registrar el usuario');
        console.error('Error al registrar el usuario:', err);
      }
    };
  
    return (
      <div className="p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="income" className="block text-gray-700 font-bold mb-2">Ingresos</label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Historial Crediticio</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={creditHistory}
                onChange={(e) => setCreditHistory(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">Tengo un historial crediticio positivo</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    );
  };