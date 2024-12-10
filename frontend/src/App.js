import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import  SimulatorPage  from "./modules/Dashboard-cuotas/pages/SimulatorPage.tsx";
import {MainPage} from "./modules/home/pages/main"
import { RegisterPage } from "./modules/auth/pages/RegisterPage";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { DashboardPage } from "./modules/dashboard/pages/DashboardPage";
import CreditSimulator from "./modules/home/components/simulator/CreditSimulator.tsx";
import { CreditScore } from './modules/home/components/credit/CreditScore.tsx';
import { Register } from './modules/home/components/credit/Register.tsx';
import { Login } from './modules/home/components/credit/Login.tsx';
import { Home } from './modules/home/components/credit/Home.tsx';
import FinancingComponent from "./modules/home/components/financing/FinancingComponent.tsx";

import '../src/App.css';



function App() {

  const handleLogin = () => {
    console.log('Login exitoso');
  };
  const routes = [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
    },
     {
      path:"/main",
      element:<MainPage />,
     },
     {
      path: "/credit-simulator", 
      element: <CreditSimulator />,
    },
    {
      path: "/credit-score", 
      element: <CreditScore />,
    },
    {
      path: "/registro", 
      element: <Register />,
    },
    {
      path: "/login2", 
      element: <Login onLogin={handleLogin} />,
    },
    {
      path: "/home", 
      element: <Home />,
    },
    {
      path: "/financing", 
      element: <FinancingComponent />,
    },
    {
      path:"/simulator",
      element: <SimulatorPage/>,
     },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ];

  

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
} 
export default App; 