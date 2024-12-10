import { useCustomFormik } from "../hooks/useCustomFormik";
import { loginSchema } from "../schemas/validationSchemas";
import { Link } from "react-router-dom";
import { FormInput } from "./FormInput";
import { Popup } from "./Popup";
import logo from "../../../assets/LogoFinancia.svg";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/simulator"); // Redirige al simulador
  };
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    values,
    showPopup,
    formResult,
    closePopup,
  } = useCustomFormik(
    {
      email: "",
      password: "",
    },
    loginSchema,
    "login"
  );
  console.log("%c formResult :", "background-color:#048A81", formResult);
  return (
    <div className="w-login-form flex flex-col justify-center items-center">
      <div className="mb-4">
        <img src={logo} alt="logo" className="w-2/3 mb-4 h-full object-cover" />
      </div>

      {!showPopup ? (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-md w-form-content bg-white space-y-4"
        >
          <div>
            <h3 className="text-heading font-bold text-text-primary ml-10">
              Accede a tu Cuenta
            </h3>
          </div>

          <FormInput
            icon={faEnvelope}
            type="email"
            placeholder="Correo electrónico"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.email}
            error={errors.email}
          />

          <FormInput
            icon={faLock}
            type="password"
            placeholder="Contraseña"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.password}
            error={errors.password}
          />

          <div>
            <a className="text-body text-text-link" href="#">
              ¿Has olvidado tu contraseña?
            </a>
          </div>

          <div className="w-full flex justify-between">
            <button
              onClick={handleLogin}
              className="w-button-large bg-purple-700 text-white py-buttonPadding rounded-3xl hover:bg-purple-950 transition duration-300"
            >
              Ingresar
            </button>

            <Link
              to="/register"
              className="w-button-small flex justify-center items-center text-center border border-purple-700  text-black mx-2 py-buttonPadding rounded-3xl hover:bg-purple-950 hover:text-white hover:border-purple-950 transition duration-300"
            >
              Regístrate
            </Link>
          </div>
        </form>
      ) : (
        <Popup
          onClose={closePopup}
          success={formResult.success} // Solo pasa el valor booleano
          UserId={formResult.userId} // Pasa el UserId al componente Popup
          formType="login"
        />
      )}
    </div>
  );
};