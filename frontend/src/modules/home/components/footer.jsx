import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
        {/* Primera sección: Información de dirección */}
        <div className="mb-6 md:mb-0 -mt-5">
          <img src="/Logo.png" alt="Financia.al" className="h-20 w-auto" />
          <p className="text-sm">
            Av. del Libertador 1251, Central principal, Piso 12<br />
            B2582BHS Ciudad de Buenos Aires, Argentina
          </p>
          {/* <img src="ruta/a/data-fiscal-qr.png" alt="QR Data Fiscal" className="mt-4 w-16 h-16" /> */}
        </div>

        {/* Segunda sección: Enlaces en dos columnas paralelas */}
        <div className="mb-6 md:mb-0 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 mt-11">
          <div className="flex flex-col space-y-2 md:space-y-1">
            <a href="#" className="hover:underline">Quienes Somos</a>
            <a href="#" className="hover:underline">Preguntas frecuentes</a>
            <a href="#" className="hover:underline">Solicitar crédito</a>
            <a href="#" className="hover:underline">Simulador de crédito</a>
            <a href="#" className="hover:underline">Inversiones</a>
          </div>
          <div className="flex flex-col space-y-2 md:space-y-1">
            <a href="#" className="hover:underline">Términos y condiciones</a>
            <a href="#" className="hover:underline">Políticas de privacidad</a>
            <a href="#" className="hover:underline">Seguridad en FINANCIA.AL</a>
            <a href="#" className="hover:underline">Defensa del consumidor</a>
          </div>
        </div>

        {/* Tercera sección: Contacto */}
        <div className="flex flex-col mt-11">
          <p className="mb-2">¿Tienes alguna pregunta?<br />¡Estamos aquí para ayudarte!</p>
          <button className="border border-white rounded px-4 py-2 hover:bg-white hover:text-purple-800 transition">
            Contáctanos
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
