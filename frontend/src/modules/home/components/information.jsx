import React from "react";


const InfoSection = ({ title, description, buttonText, onButtonClick }) => (
  <div className="flex flex-col items-center text-center md:text-left md:items-start">
    <h2 className="font-nunito text-[30px] font-bold text-[#693196]">{title}</h2>
    <p className="font-nunito text-[23px]  text-black my-2">{description}</p>
    <div className=" mt-[23px]">
    <button
      onClick={onButtonClick}
      className="bg-[#693196] text-white py-2 px-6 rounded-full hover:bg-[#5a287e] transition-all relative ml-[200px]"
    >
      {buttonText}
    </button>
    </div>
  </div>
);

const FeaturesSection = () => {
  const handleLoanClick = () => alert("Solicitar préstamo clicado");
  const handleDiscoverClick = () => alert("Descubre más clicado");

  return (
    <div className="bg-gray-50 py-8 px-4 md:px-16">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
        {/* Imagen */}
        <div className="w-full md:w-1/2 flex flex-col space-y-[49px]">
          <img
            src="/family.png "
            alt="Familia invirtiendo"
            className="rounded-lg shadow-md w-full"
          />

            <InfoSection
              title="Invierte en el futuro. Construye el tuyo."
              description="Accede a oportunidades de financiamiento para la compra de terrenos en Latinoamérica y construye un futuro más sólido."
              buttonText="Solicitar préstamo"
              onButtonClick={handleLoanClick}
            />
        </div>

        {/* Contenido */}
        <div className="w-full md:w-1/2 ">
          <ul className="font-nunito text-[23px] space-y-4 mb-8 mt-[35px]">
            <li className="flex items-start space-x-2">
            <img src="/icono.png" alt="Icono de check" className="w-8 h-8"/>
              <p className="text-black">
                Amplía tu cartera de inversiones con un activo de valor tangible
                y creciente.
              </p>
            </li>
            <li className="flex items-start space-x-2">
            <img src="/icono.png" alt="Icono de check" className="w-8 h-8"/>
              <p className="text-black">
                Sé parte de una solución que mejora la calidad de vida de miles
                de familias.
              </p>
            </li>
            <li className="flex items-start space-x-2">
            <img src="/icono.png" alt="Icono de check" className="w-8 h-8"/>
              <p className="text-black">
                Accede a información detallada sobre tus inversiones en tiempo
                real.
              </p>
            </li>
          </ul>

         
          <div className="mt-[149px]">
            <InfoSection
              title="Descubre quienes somos"
              description="Conectamos sueños de hogar con oportunidades de inversión, construyendo un futuro más próspero para todos."
              buttonText="Descubre más"
              onButtonClick={handleDiscoverClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
