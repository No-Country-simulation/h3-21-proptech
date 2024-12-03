import React from "react";

// Componente para una característica individual
const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <img
      src={icon}
      alt={title}
      className={"w-12 h-12 mb-4"} // Ajusta el tamaño del icono aquí
    />
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-black text-xl mt-[35px]">{description}</p>
    </div>
  );
};

// Componente principal para la sección
const InversionSection = () => {
  // Función de evento para el botón
  const handleInvestNow = () => {
    alert("¡Gracias por tu interés en invertir!"); // Simula una acción
  };

  return (
    <section className="bg-[#E0F2F1]  py-12 px-6 md:px-16">
      {/* Título y subtítulo */}
      <div className=" mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Invierte en el futuro de Latinoamérica
        </h2>
        <p className=" font-nunito text-[22px] text-black ">
          Únete a una nueva generación de inversores que están transformando el
          paisaje inmobiliario mientras generan impacto social positivo y
          retornos consistentes.
        </p>
      </div>

      {/* Características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Feature
          icon="/Vector.png"
          title="Activos reales"
          description="Fortalece tu cartera con activos reales en mercados emergentes de alto potencial."
        />
        <Feature
          icon="/heart.png"
          title="Impacto social"
          description="Transforma vidas facilitando el acceso a la propiedad mientras tu inversión crece."
        />
        <Feature
          icon="/trading.png"
          title="Rendimientos atractivos"
          description="Maximiza tu capital con retornos superiores al mercado inmobiliario tradicional."
        />
      </div>

      {/* Botón de acción */}
      <div className="text-center">
        <button
          onClick={handleInvestNow}
          className="bg-purple-700 text-white text-lg font-bold py-3 px-6 rounded-full hover:bg-purple-800 transition"
        >
          Invertir ahora
        </button>
      </div>
    </section>
  );
};

export default InversionSection;
