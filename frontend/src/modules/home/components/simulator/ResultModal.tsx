import React from 'react';
import { CreditSimulationResult } from '../../types/CreditTypes.ts';

interface ResultModalProps {
  result: CreditSimulationResult;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Resultado de la Simulación</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Cuota Mensual:</p>
            <p className="text-blue-600">${result.monthly_payment.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Total de Intereses:</p>
            <p className="text-green-600">${result.total_interest.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Pago Total:</p>
            <p className="text-purple-600">${result.total_payment.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Costo Anual:</p>
            <p className="text-red-600">{result.annual_cost.toFixed(2)}%</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Cronograma de Pagos</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Mes</th>
                <th className="p-2 border">Interés</th>
                <th className="p-2 border">Capital</th>
                <th className="p-2 border">Saldo Restante</th>
              </tr>
            </thead>
            <tbody>
              {result.balances.map((balance) => (
                <tr key={balance.month} className="text-center">
                  <td className="p-2 border">{balance.month}</td>
                  <td className="p-2 border">${balance.interest_payment.toFixed(2)}</td>
                  <td className="p-2 border">${balance.principal_payment.toFixed(2)}</td>
                  <td className="p-2 border">${balance.remaining_balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          onClick={onClose} 
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ResultModal;