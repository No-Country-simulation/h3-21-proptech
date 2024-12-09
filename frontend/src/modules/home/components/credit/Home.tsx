// src/components/Home.tsx
import React, { useState, useEffect } from 'react';
import { CreditScore } from './CreditScore.tsx';
import { creditScoreService } from '../../../../services/creditScoreService.ts';

import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const [creditScore, setCreditScore] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        // Aquí deberías obtener el ID del usuario autenticado
        // Por ahora, simulamos que el usuario tiene ID 1
        const userId = 22;
        const score = await creditScoreService.getUserCreditScore(userId);
        
        // Si no tiene puntaje, calcularlo
        if (!score.score) {
          const calculatedScore = await creditScoreService.calculateCreditScore(score.id);
          setCreditScore(calculatedScore);
        } else {
          setCreditScore(score);
        }
        
        setLoading(false);
      } catch (err) {
        setError('No se pudo cargar el puntaje crediticio');
        setLoading(false);
        console.error('Error al obtener o calcular el puntaje crediticio:', err);
        // Redirigir a la página de login en caso de error
        navigate('/login');
      }
    };

    fetchCreditScore();
  }, [navigate]);

  if (loading) return <div>Cargando puntaje crediticio...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a tu Panel de Crédito</h1>
      {creditScore && <CreditScore />}
    </div>
  );
};