import React from "react";
import FinanciaSection from "../components/financiaOptions";

const App = () => {
  const handleFinancingRequest = () => {
    alert("¡Gracias por solicitar financiamiento!");
  };

  return (
    <div>
      <FinanciaSection
        image="/plano.png" // Sustituye por la URL real
        title="Tu terreno, tu futuro. Financia tu sueño."
        description="Accede a opciones de financiamiento flexibles y personalizadas para adquirir el terreno de tus sueños."
        features={[
          "Flexibilidad a tu medida",
          "Tasas de interés atractivas",
          "Proceso sencillo y rápido",
        ]}
        onButtonClick={handleFinancingRequest}
        descriptionClass="text-lg" // Tamaño de la letra de la descripción
        imageClass="ml-4" // Mueve la imagen a la derecha

      />
    </div>
  );
};

export default App;
