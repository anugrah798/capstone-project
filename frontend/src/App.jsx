import { LanguageProvider } from "./context/LanguageContext";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ForecastPage from "./pages/ForecastPage";
import WeatherMap from "./pages/WeatherMap";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Alerts from "./pages/Alerts";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import { useAuth } from "./context/AuthContext";


function AdminRoute() {
  const { user } = useAuth();

  return user?.role === "admin"
    ? <Admin />
    : <Navigate to="/" replace />;
}


export default function App() {
  return (
    <LanguageProvider>

      <Navbar />

      <Routes>

        {/* ================================
            PUBLIC ROUTES
        ================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/about"
          element={<About />}
        />


        {/* ================================
            PROTECTED ROUTES
        ================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/forecast"
            element={<ForecastPage />}
          />

          <Route
            path="/weather-map"
            element={<WeatherMap />}
          />

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/assistant"
            element={<Assistant />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/admin"
            element={<AdminRoute />}
          />

        </Route>


        {/* ================================
            404
        ================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </LanguageProvider>
  );
}