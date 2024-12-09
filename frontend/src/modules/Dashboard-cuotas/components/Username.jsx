
import { getUserName } from "../utils/getUserName";

export const Username = () => {
  const userName = getUserName();
  return (
    <div className="ml-4 lg:ml-16  mt-2">
      <h2 className="text-2xl font-semibold mb-4">
        {`¡Bienvenido, ${userName}!`}
      </h2>
      <p className="text-base text-gray-600">
      Puedes consultar en este espacio informacion de tus creditos y simular un credito
      </p>
    </div>
  );
};
