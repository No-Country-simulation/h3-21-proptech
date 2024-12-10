import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <nav className="bg-[#693196] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/Logo.png " // Reemplaza con la URL o ruta del logo
              alt="Logo"
              className="w-25 h-12"
            />
            
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#quienes-somos" className="hover:text-gray-300">
              Quienes Somos
            </a>
            <a href="#inversiones" className="hover:text-gray-300">
              Inversiones
            </a>
            <a href="#faq" className="hover:text-gray-300">
              Preguntas Frecuentes
            </a>
            <a href="#contacto" className="hover:text-gray-300">
              Contáctanos
            </a>
          </div>
          {/* Avatar */}
          <div>
            <img
              src="https://via.placeholder.com/40" // Reemplaza con la URL o ruta de la imagen
              alt="Usuario"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
          className={`md:hidden bg-gray-700 overflow-hidden transform transition-all duration-300 ${
              isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
          <a href="#quienes-somos" className="block px-4 py-2 hover:bg-gray-600">Quienes Somos</a>
          <a href="#inversiones" className="block px-4 py-2 hover:bg-gray-600">Inversiones</a>
          <a href="#faq" className="block px-4 py-2 hover:bg-gray-600">Preguntas Frecuentes</a>
          <a href="#contacto" className="block px-4 py-2 hover:bg-gray-600">Contáctanos</a>
      </div>
        )}
      </nav>
    );
};

export default Navbar;