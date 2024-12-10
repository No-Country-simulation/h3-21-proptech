import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faTimes } from "@fortawesome/free-solid-svg-icons";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 right-4">
      {/* Botón del Chatbot */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 focus:outline-none"
      >
        <FontAwesomeIcon icon={faRobot} className="h-6 w-6" />
      </button>

      {/* Cuadro de diálogo */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center px-4 py-2 bg-blue-600 text-white rounded-t-lg">
            <h2 className="text-lg font-semibold">Chatbot</h2>
            <button onClick={toggleChat}>
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-700">Hola! Soy tu asistente virtual.</p>
            <p className="text-gray-700 mt-2">
              ¿En qué puedo ayudarte hoy? 😊
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
