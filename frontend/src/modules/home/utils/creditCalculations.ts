import { CreditSimulationInput, CreditSimulationResult } from '../types/CreditTypes.ts';

export const simulateCredit = async (data: CreditSimulationInput): Promise<CreditSimulationResult> => {
  try {
    // Simula llamada a API (reemplazar con tu endpoint real)
    const response = await fetch('http://127.0.0.1:8000/simulator/simulate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en la simulación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la simulación:', error);
    throw error;
  }
};