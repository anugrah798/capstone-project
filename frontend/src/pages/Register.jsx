import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "./Login";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try { await register(form.name, form.email, form.password); nav("/"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed"); }
  }

  return <AuthForm title="Create Account" button="Register" form={form} setForm={setForm} submit={submit} error={error} nameField>
    <p>Already have an account? <Link to="/login">Login</Link></p>
  </AuthForm>;
}