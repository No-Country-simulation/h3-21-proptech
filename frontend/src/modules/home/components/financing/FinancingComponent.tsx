// src/components/FinancingComponent.tsx
import React, { useEffect, useState } from 'react';
import { getFinancings, createFinancing } from '../../../../services/financingService.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Financing {
  id: number;
  user: number;
  loan_amount: number;
  annual_interest_rate: number;
  term_months: number;
  start_date: string;
  payment_due_day: number;
  status: string;
  created_at: string;
  updated_at: string;
  monthly_payment: number;
  payment_schedule: any[];
  van_and_tir: any;
}

// Esquema de validación
const financingSchema = z.object({
  loan_amount: z.number().min(1000, "Monto mínimo $1,000").max(100000, "Monto máximo $100,000"),
  annual_interest_rate: z.number().min(1, "Tasa mínima 1%").max(50, "Tasa máxima 50%"),
  term_months: z.number().min(1, "Mínimo 1 mes").max(60, "Máximo 60 meses"),
  start_date: z.string().min(1, "Fecha de inicio es requerida"),
  payment_due_day: z.number().min(1, "Día mínimo 1").max(28, "Día máximo 28"),
});

const FinancingComponent: React.FC<{ userId: number }> = ({ userId }) => {
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(financingSchema)
  });

  useEffect(() => {
    const fetchFinancings = async () => {
      setIsLoading(true);
      try {
        const f = await getFinancings(userId);
        setFinancings(f);
      } catch (err) {
        setError('No se pudo obtener los financiamientos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancings();
  }, [userId]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const financing = await createFinancing({ ...data, user: userId });
      setFinancings([...financings, financing]);
    } catch (err) {
      setError('No se pudo crear el financiamiento');
    }
    setIsLoading(false);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Financiamientos</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2">Monto del Préstamo ($)</label>
            <input 
              type="number" 
              {...register('loan_amount', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Ej: 10000"
            />
            {errors.loan_amount && <p className="text-red-500">{errors.loan_amount.message as string}</p>}
          </div>

          <div>
            <label className="block mb-2">Tasa de Interés Anual (%)</label>
            <input 
              type="number" 
              {...register('annual_interest_rate', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Ej: 7"
              step="0.1"
            />
            {errors.annual_interest_rate && <p className="text-red-500">{errors.annual_interest_rate.message as string}</p>}
          </div>

          <div>
            <label className="block mb-2">Plazo (meses)</label>
            <input 
              type="number" 
              {...register('term_months', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Ej: 12"
            />
            {errors.term_months && <p className="text-red-500">{errors.term_months.message as string}</p>}
          </div>

          <div>
            <label className="block mb-2">Fecha de Inicio</label>
            <input 
              type="date" 
              {...register('start_date')}
              className="w-full p-2 border rounded"
            />
            {errors.start_date && <p className="text-red-500">{errors.start_date.message as string}</p>}
          </div>

          <div>
            <label className="block mb-2">Día de Pago</label>
            <input 
              type="number" 
              {...register('payment_due_day', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Ej: 10"
              step="1"
            />
            {errors.payment_due_day && <p className="text-red-500">{errors.payment_due_day.message as string}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {isLoading ? 'Creando...' : 'Crear Financiamiento'}
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Mis Financiamientos</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Tasa Anual</th>
              <th className="p-2 border">Plazo (meses)</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Pago Mensual</th>
            </tr>
          </thead>
          <tbody>
            {financings.map(financing => (
              <tr key={financing.id} className="text-center">
                <td className="p-2 border">{financing.id}</td>
                <td className="p-2 border">${financing.loan_amount.toFixed(2)}</td>
                <td className="p-2 border">{financing.annual_interest_rate}%</td>
                <td className="p-2 border">{financing.term_months}</td>
                <td className="p-2 border">{financing.status}</td>
                <td className="p-2 border">${financing.monthly_payment.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancingComponent;