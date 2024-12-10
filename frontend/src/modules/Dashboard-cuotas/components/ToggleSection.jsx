import { useState } from "react";
import { handleDataSave } from "../services/handleDataSave";

import { FieldGroup } from "./FieldGroup";
import { TotalCount } from "./TotalCount";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowsRotate,
  faChevronDown,
  //faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";

export const ToggleSection = () => {
  const [showIncome, setShowIncome] = useState(true);
  const [incomeData, setIncomeData] = useState(
    Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      title: "",
      date: "",
      amount: "",
      errors: {},
    }))
  );
  const [expendData, setExpendData] = useState(
    Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      title: "",
      date: "",
      amount: "",
      errors: {},
    }))
  );

  const handleToggle = () => setShowIncome(!showIncome);

  const currentData = showIncome ? incomeData : expendData;
  const setCurrentData = showIncome ? setIncomeData : setExpendData;

  const [saveStatus, setSaveStatus] = useState("idle");

  const handleSave = () => {
    const dataToSave = showIncome ? incomeData : expendData;
    const result = handleDataSave(dataToSave);

    if (result.success) {
      setSaveStatus("success");
    } else {
      setSaveStatus("error");
    }

    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  return (
    <div className="mb-12 mt-12">
      <div className="w-full flex flex-row justify-between items-center pb-4">
        <button
          onClick={handleToggle}
          className="relative w-52 h-11 rounded-md bg-gray-200 cursor-pointer transition-all duration-500 flex justify-between items-center outline outline-1 outline-gray-300 border-2 border-purple-700"
        >
          <span className="w-1/2 text-black opacity-50">Cuotas a Pagar</span>
          <span className="w-1/2 text-black opacity-50">Simular credito</span>

          <span
            className={`w-1/2 h-full absolute rounded-md top-0 transition-all duration-500 font-bold text-base text-white flex items-center justify-center bg-[#693196]
          ${showIncome ? "left-0" : "left-1/2"}`}
          >
            {showIncome ? "Cuotas a Pagar" : "Simular credito"}
          </span>
        </button>

        <div className="w-fit flex flex-row items-center gap-5">
          <div className="flex flex-row items-center gap-5">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-primary-dark"
            />

            <FontAwesomeIcon
              icon={faArrowsRotate}
              className="text-lg text-primary-dark"
            />
          </div>

          <hr className="w-px h-6 bg-gray-200" />

          <div className="flex flex-row items-center gap-5">
            <button className="w-28 h-6 p-4 flex items-center justify-between rounded-md outline outline-1 outline-gray-300">
              <span className="text-primary-dark text-sm">Mes</span>

              <FontAwesomeIcon
                icon={faChevronDown}
                className="text-xs text-primary-dark"
              />
            </button>

           {/* <button className="w-36 h-6 p-4 flex items-center justify-center gap-2 rounded-md outline outline-1 outline-gray-300">
              <FontAwesomeIcon
                icon={faFileArrowDown}
                className="text-xs text-primary-dark"
              />

              <span className="text-primary-dark text-sm font-bold">
                Exportar PDF
              </span>
            </button>*/}

            <button
              onClick={handleSave}
              className={`w-36 h-10 p-3 flex items-center justify-center rounded-md font-bold transition-colors duration-300 ${
                saveStatus === "success"
                  ? "bg-green-500 text-white"
                  : saveStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-[#693196] text-white"
              }`}
            >
              {saveStatus === "success"
                ? "Guardado!"
                : saveStatus === "error"
                ? "Error"
                : "Pedir Prestamo"}
            </button>
          </div>
        </div>
      </div>

      <hr className="border-b border-gray-200" />

      <TotalCount data={currentData} />

      <div className="w-full flex flex-row gap-5 pt-4">
        <span className="font-medium text-base text-gray-600 w-60 text-left">
          Numero de cuota
        </span>
        <span className="font-medium text-base text-gray-600 w-60 text-left">
          Estado
        </span>
        <span className="font-medium text-base text-gray-600 w-60 text-left">
          Fecha
        </span>
        <span className="font-medium text-base text-gray-600 w-60 text-left ">
          Monto
        </span>
      </div>
      <hr className="border-b border-gray-200" />
      <FieldGroup data={currentData} setData={setCurrentData} />
    </div>
  );
};