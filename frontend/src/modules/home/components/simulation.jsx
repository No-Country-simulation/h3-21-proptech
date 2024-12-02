import React, { useState, useEffect } from "react";

const CreditSimulator = () => {
  // Estados para manejar el monto, plazo y cuota calculada
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState("");
  const [cuota, setCuota] = useState(null);

  // Función para calcular la cuota mensual
  const calcularCuota = () => {
    if (monto && plazo) {
      const tasaInteres = 0.02; // 2% mensual
      const cuotaMensual =
        (monto * tasaInteres) / (1 - Math.pow(1 + tasaInteres, -plazo));
      setCuota(cuotaMensual.toFixed(2));
    } else {
      setCuota(null); // Restablece el valor de la cuota si los datos no están completos
    }
  };

  // Calcular automáticamente cuando los valores cambian (opcional con useEffect)
  useEffect(() => {
    calcularCuota();
  }, [monto, plazo]);

  // Manejo de eventos para los inputs
  const handleMontoChange = (e) => setMonto(e.target.value);
  const handlePlazoChange = (e) => setPlazo(e.target.value);

  return (
    <div className="bg-[#E0F2F1] py-8 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between">
      {/* Sección izquierda: Título y descripción */}
      <div className="max-w-md mb-8 md:mb-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ¿Querés acceder a un crédito y querés saber cuánto vas a pagar?
        </h2>
        <p className="text-gray-600">
          Simulá el valor de tu cuota y elegí en qué plazo lo querés pagar
        </p>
      </div>

      {/* Sección derecha: Formulario */}
      <div className="  rounded-lg p-6 max-w-sm w-full">
      <h1 className="text-gray-600">
          Carga los datos para simular tu crédito
        </h1>
        
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Evitar recargar la página
            calcularCuota();
          }}
        >
          <div className="mb-4">
            <input
              type="number"
              placeholder="Ingresa el monto"
              value={monto}
              onChange={handleMontoChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Ingresa el plazo (en meses)"
              value={plazo}
              onChange={handlePlazoChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white rounded-lg py-2 hover:bg-purple-800 transition"
          >
            Calcular crédito
          </button>
        </form>

        {/* Mostrar el resultado de la cuota */}
        {cuota && (
          <div className="mt-4 text-center">
            <p className="text-lg text-gray-800">
              Tu cuota mensual será de:{" "}
              <span className="font-bold text-purple-700">${cuota}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditSimulator;
