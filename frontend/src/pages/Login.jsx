import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      nav("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  }

  return (
    <AuthForm
      title="Welcome Back"
      button="Login"
      form={form}
      setForm={setForm}
      submit={submit}
      error={error}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
    >
      <div className="auth-links">
        <Link
          to="/forgot-password"
          className="forgot-password"
        >
          Forgot Password?
        </Link>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}

function AuthForm({
  title,
  button,
  form,
  setForm,
  submit,
  error,
  children,
  nameField = false,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={submit}
      >
        <h1>{title}</h1>

        {nameField && (
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            required
          />

          <button
            type="button"
            className="password-eye"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          className="primary"
          type="submit"
        >
          {button}
        </button>

        {children}
      </form>
    </div>
  );
}

export { AuthForm };