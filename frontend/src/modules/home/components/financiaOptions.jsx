const FinanciaSection = ({ image, title, description, features = [], onButtonClick }) => {
    return (
      <section className="bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
        {/* Imagen */}
        <div className="mb-8 md:mb-0 md:mr-8">
          <h2 className="text-3xl font-bold text-black  mb-4">{title}</h2>

          <div className="ml-10 ">
            <img
              src={image}
              alt="Plano arquitectónico"
              className="rounded-lg shadow-lg max-w-sm w-full"
            />
          </div>
        </div>

        {/* Texto y características */}
        <div className="max-w-md">
          <p className="text-black mb-6 text-lg">{description}</p>

          <ul className="space-y-4 mb-6 text-lg">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <img
                  src="/icono.png"
                  alt="Ícono personalizado"
                  className="w-6 h-6 mr-2"
                />
                <p className="text-black ">{feature}</p>
              </li>
            ))}
          </ul>

          <button
            onClick={onButtonClick}
            className="bg-purple-700 text-white text-lg font-bold py-3 px-6 rounded-lg hover:bg-purple-800 transition"
          >
            Solicitar financiamiento
          </button>
          
        </div>
      </section>
    );
  };
  export default FinanciaSection;
