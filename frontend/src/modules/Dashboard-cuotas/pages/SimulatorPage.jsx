import { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import { Username } from "../components/Username";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import Calculator from '../components/calculator';
import { ToggleSection } from '../components/ToggleSection';
import FooterDashboard from "../components/FooterDashboard";

export const SimulatorPage = () => {
    const [activePage, setActivePage] = useState("calculator");
    const [incomeData, setIncomeData] = useState([]);
    const [expendData, setExpendData] = useState([]);
    const UserId = localStorage.getItem("userId");

    const conexionDashboard = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE}/users/dashboard`,
            {
              params: { userId: UserId },
            }
          );
          const incomeArray = response.data[2]?.income || [];
          const expenseArray = response.data[1]?.expense || [];
          setExpendData(expenseArray);
          setIncomeData(incomeArray);
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      };
      useEffect(() => {
        conexionDashboard();
      }, []);

     const renderContent = () => {
        switch (activePage) {
          case "calculator":
            return <Calculator incomeData={incomeData} expendData={expendData} />;
          case "ToggleSection":
            return <ToggleSection />;
          default:
            return <Calculator />;
        }
      };
      return (
        <div className="flex flex-col h-screen">
          <Navbar />
          <Username/>
          <div className="flex flex-1">
            <Sidebar setActivePage={setActivePage} />*
            <main className="flex-1 pl-4 pr-4 bg-white">{renderContent()}</main>
          </div>
        <FooterDashboard/>
        </div>
      );


};