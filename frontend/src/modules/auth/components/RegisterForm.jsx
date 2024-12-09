import { useCustomFormik } from "../hooks/useCustomFormik";
import { registerSchema } from "../schemas/validationSchemas";
import { FormInput } from "./FormInput";
import { Popup } from "./Popup";
import { Link } from "react-router-dom";
import logo from "../../../assets/LogoFinancia.svg";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

export const RegisterForm = () => {
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
      name: "",
      email: "",
      password: "",
    },
    registerSchema,
    "register"
  );

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
            <h3 className="text-heading font-bold text-text-primary">
              Regístrate
            </h3>
            <p className="text-body text-text-secondary">Crea tu cuenta</p>
          </div>

          <FormInput
            icon={faUser}
            type="text"
            placeholder="Nombre completo"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.name}
            error={errors.name}
          />

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

          <button
            type="submit"
            className="w-button-large bg-purple-700 text-white py-buttonPadding rounded-3xl hover:bg-purple-950 transition duration-300"
          >
            Registrarme
          </button>

          <div>
            <Link className="text-body text-text-link" to="/login">
              ¿Ya tienes una cuenta?
            </Link>
          </div>
        </form>
      ) : (
        <Popup
          success={formResult.success}
          formType="register"
          UserId={formResult.userId}
          onClose={closePopup}
        />
      )}
    </div>
  );
};