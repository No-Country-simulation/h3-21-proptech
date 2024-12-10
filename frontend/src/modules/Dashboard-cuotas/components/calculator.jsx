import React, { useState } from "react";

function Calculator() {
  const [amount, setAmount] = useState(10000); // Monto del préstamo
  const [months, setMonths] = useState(24); // Plazo en meses
  const [rate, setRate] = useState(7); // Tasa de interés anual
  const [result, setResult] = useState(null); // Resultado del cálculo

  const calculateCredit = () => {
    const monthlyRate = rate / 12 / 100;
    const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    setResult(payment.toFixed(2));
  };

  return (
    <div className="bg-white min-h-screen flex flex-col  p-3">
      <main className="bg-white rounded-lg shadow-md p-6 mt-6 w-full max-w-2xl ml-3">
        
        <div className="flex  gap-4  mb-6 mt-6">
          <div>
            <h1 className="text-[#693196]">Score</h1>
            <h1 className="text-xl font-bold">25666</h1>
          </div>
          <div className="ml-20">
            <p className="text-[#1C768F]">Tasa de interés</p>
            <p className="text-xl font-bold">{rate}%</p>
          </div>
        </div>
        
        <div>
          <label className="block text-black mb-2">
            Monto del préstamo:
          </label>
          <input
            type="number"
            className="w-80 border rounded-lg p-2 mb-4"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-black mb-2">Plazo (meses):</label>
          <input
            type="number"
            className="w-80 border rounded-lg p-2 mb-4"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-black mb-2">
            Tasa de interés anual:
          </label>
          <input
            type="number"
            className="w-80 border rounded-lg p-2 mb-4"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>
        <button
          onClick={calculateCredit}
          className="border-2 border-purple-700 text-purple-700 py-2 px-4 rounded-full hover:bg-[#693196] hover:text-white transition  w-80"
        >
          Calcular crédito
        </button>
        {result && (
          <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-lg">
            <p>
              Pago mensual estimado:{" "}
              <span className="font-bold">${result}</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Calculator;
