import React, { useState } from "react";
import Navbar from '../components/navbar';
import { Username } from "../components/Username";
import { Sidebar } from "../components/Sidebar";
import FooterDashboard from "../components/FooterDashboard";
import ResultModal from '../../home/components/simulator/ResultModal.tsx';
import { simulateCredit } from '../../home/utils/creditCalculations.ts';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Esquema de validación con Zod
const creditSchema = z.object({
  loan_amount: z.number().min(1000, "Monto mínimo $1,000").max(100000, "Monto máximo $100,000"),
  interest_rate: z.number().min(1, "Tasa mínima 1%").max(50, "Tasa máxima 50%"),
  term_months: z.number().min(1, "Mínimo 1 mes").max(60, "Máximo 60 meses"),
});

// Tipo para los datos del formulario basado en el esquema de Zod
type CreditFormInputs = z.infer<typeof creditSchema>;

export const SimulatorPage: React.FC = () => {
    const [activePage, setActivePage] = useState<string>("calculator");
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        setValue,
    } = useForm<CreditFormInputs>({
        resolver: zodResolver(creditSchema),
        defaultValues: {
            interest_rate: 7, // Valor predeterminado
          },
    });

    // Manejo del envío del formulario
    const onSubmit: SubmitHandler<CreditFormInputs> = async (data) => {
        console.log("Datos enviados desde el formulario:", data);
        setIsLoading(true);
        setError(null);
        
        try {
            const simulationResult = await simulateCredit(data);
            console.log("Resultado de la simulación:", simulationResult);
            setResult(simulationResult);
        } catch (err) {
            console.error("Error al simular crédito:", err);
            setError(err instanceof Error ? err.message : 'No se pudo realizar la simulación');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (activePage === "calculator") {
            return (
                <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
                    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                        <h1 className="text-2xl font-bold mb-6 text-center">Simulador de Crédito</h1>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block mb-2">Monto del Préstamo ($)</label>
                                <input 
                                    type="number" 
                                    {...register('loan_amount', { valueAsNumber: true })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Ej: 10000"
                                />
                                {errors.loan_amount && <p className="text-red-500">{errors.loan_amount.message}</p>}
                            </div>

                            <div>
                              <label className="block mb-2">Tasa de Interés Anual (%)</label>
                              <input 
                                type="number" 
                                {...register('interest_rate', { valueAsNumber: true })}
                                className="w-full p-2 border rounded"
                                placeholder="Ej: 7"
                                step="0.1"
                                />
                          </div>

                            <div>
                                <label className="block mb-2">Plazo (meses)</label>
                                <input 
                                    type="number" 
                                    {...register('term_months', { valueAsNumber: true })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Ej: 12"
                                />
                                {errors.term_months && <p className="text-red-500">{errors.term_months.message}</p>}
                            </div>

                            <button 
                              type="submit" 
                              disabled={isLoading}
                              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            >
                              {isLoading ? 'Simulando...' : 'Simular Crédito'}
                            </button>
                        </form>

                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>

                    {result && <ResultModal result={result} onClose={() => setResult(null)} />}
                </div>
            );
        }
        return null; 
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <Username />
            <div className="flex flex-1">
                <Sidebar setActivePage={(page: string) => setActivePage(page)} />
                <main className="flex-1 pl-4 pr-4 bg-white">{renderContent()}</main>
            </div>
            <FooterDashboard />
        </div>
    );
};

export default SimulatorPage;