// src/components/CreditScore.tsx
import React, { useState, useEffect } from 'react';
import { creditScoreService } from '../../../../services/creditScoreService.ts';
import { CreditScore as CreditScoreType } from '../../types/CreditScore.ts';

export const CreditScore: React.FC = () => {
  const [creditScore, setCreditScore] = useState<CreditScoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*useEffect(() => {
    const fetchCreditScore = async () => {
      /*const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }*/
  
     /* try {
        const score = await creditScoreService.getUserCreditScore();
        
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
      }
    };
  
    fetchCreditScore();
  }, []);*/

  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
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
      }
    };
  
    fetchCreditScore();
  }, []);

  const getRiskColorClass = (category?: string) => {
    switch (category) {
      case 'VERY_LOW': return 'bg-green-100 text-green-800';
      case 'LOW': return 'bg-green-50 text-green-600';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'VERY_HIGH': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Cargando puntaje crediticio...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className={`p-6 rounded-lg shadow-md ${creditScore?.risk_category ? getRiskColorClass(creditScore.risk_category.category) : ''}`}>
      <h2 className="text-2xl font-bold mb-4">Puntaje Crediticio</h2>
      {creditScore && (
        <div>
          <p className="text-xl">Puntaje: <span className="font-bold">{creditScore.score}</span></p>
          {creditScore.risk_category && (
            <div>
              <p>Categoría de Riesgo: {creditScore.risk_category.description}</p>
            </div>
          )}
          <div className="mt-4">
            <p>Ingresos: ${creditScore.income.toLocaleString()}</p>
            <p>Historial Crediticio: {creditScore.credit_history ? 'Sí' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
};