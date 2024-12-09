import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SimulatorPage } from "./modules/Dashboard-cuotas/pages/SimulatorPage";
import {MainPage} from "./modules/home/pages/main"
import { RegisterPage } from "./modules/auth/pages/RegisterPage";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { DashboardPage } from "./modules/dashboard/pages/DashboardPage";


function App() {
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