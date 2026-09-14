import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const countries = [
    ["IN", "India"],
    ["US", "United States"],
    ["GB", "United Kingdom"],
    ["CA", "Canada"],
    ["AU", "Australia"],
    ["DE", "Germany"],
    ["FR", "France"],
    ["IT", "Italy"],
    ["ES", "Spain"],
    ["PT", "Portugal"],
    ["BR", "Brazil"],
    ["MX", "Mexico"],
    ["AR", "Argentina"],
    ["CL", "Chile"],
    ["CO", "Colombia"],
    ["PE", "Peru"],
    ["JP", "Japan"],
    ["KR", "South Korea"],
    ["CN", "China"],
    ["SG", "Singapore"],
    ["MY", "Malaysia"],
    ["TH", "Thailand"],
    ["ID", "Indonesia"],
    ["PH", "Philippines"],
    ["VN", "Vietnam"],
    ["BD", "Bangladesh"],
    ["LK", "Sri Lanka"],
    ["NP", "Nepal"],
    ["PK", "Pakistan"],
    ["AE", "United Arab Emirates"],
    ["SA", "Saudi Arabia"],
    ["QA", "Qatar"],
    ["KW", "Kuwait"],
    ["OM", "Oman"],
    ["BH", "Bahrain"],
    ["IL", "Israel"],
    ["TR", "Turkey"],
    ["EG", "Egypt"],
    ["ZA", "South Africa"],
    ["NG", "Nigeria"],
    ["KE", "Kenya"],
    ["GH", "Ghana"],
    ["ET", "Ethiopia"],
    ["NZ", "New Zealand"],
    ["RU", "Russia"],
    ["UA", "Ukraine"],
    ["PL", "Poland"],
    ["NL", "Netherlands"],
    ["BE", "Belgium"],
    ["CH", "Switzerland"],
    ["AT", "Austria"],
    ["SE", "Sweden"],
    ["NO", "Norway"],
    ["DK", "Denmark"],
    ["FI", "Finland"],
    ["IE", "Ireland"],
    ["GR", "Greece"],
    ["CZ", "Czech Republic"],
    ["HU", "Hungary"],
    ["RO", "Romania"],
    ["BG", "Bulgaria"],
    ["HR", "Croatia"],
    ["RS", "Serbia"],
    ["IS", "Iceland"],
    ["LU", "Luxembourg"],
    ["MT", "Malta"],
    ["CY", "Cyprus"],
];

const languages = [
    ["en", "English"],
    ["ml", "Malayalam"],
    ["ta", "Tamil"],
    ["hi", "Hindi"],
    ["te", "Telugu"],
];

export default function Settings() {
    const navigate = useNavigate();

    const {
        language,
        setLanguage,
        t,
    } = useLanguage();

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    const [temperatureUnit, setTemperatureUnit] = useState(
        localStorage.getItem("temperatureUnit") || "C"
    );

    const [windUnit, setWindUnit] = useState(
        localStorage.getItem("windUnit") || "kmh"
    );

    const [rainUnit, setRainUnit] = useState(
        localStorage.getItem("rainUnit") || "mm"
    );

    const [pressureUnit, setPressureUnit] = useState(
        localStorage.getItem("pressureUnit") || "hpa"
    );

    const [region, setRegion] = useState(
        localStorage.getItem("region") || "IN"
    );

    const [alertPreferences, setAlertPreferences] = useState({
        rain: true,
        temperature: true,
        uv: true,
        wind: true,
        thunderstorm: true,
    });

    const [alertLoading, setAlertLoading] = useState(true);
    const [alertSaving, setAlertSaving] = useState(false);

    const [rating, setRating] = useState(
        Number(localStorage.getItem("skySenseRating")) || 0
    );

    const [infoModal, setInfoModal] = useState("");

    // ==============================
    // THEME
    // ==============================

    function applyTheme(value) {
        document.body.classList.toggle(
            "dark-mode",
            value
        );

        localStorage.setItem(
            "darkMode",
            value
        );

        window.dispatchEvent(
            new Event("themeChanged")
        );
    }

    function handleDarkMode() {
        const newValue = !darkMode;

        setDarkMode(newValue);

        applyTheme(newValue);
    }

    // ==============================
    // WEATHER UNITS
    // ==============================

    function savePreference(key, value) {
        localStorage.setItem(
            key,
            value
        );

        window.dispatchEvent(
            new Event("weatherUnitsChanged")
        );
    }

    function handleTemperature(value) {
        setTemperatureUnit(value);

        savePreference(
            "temperatureUnit",
            value
        );
    }

    function handleWind(value) {
        setWindUnit(value);

        savePreference(
            "windUnit",
            value
        );
    }

    function handleRain(value) {
        setRainUnit(value);

        savePreference(
            "rainUnit",
            value
        );
    }

    function handlePressure(value) {
        setPressureUnit(value);

        savePreference(
            "pressureUnit",
            value
        );
    }

    // ==============================
    // REGION
    // ==============================

    function handleRegion(value) {
        setRegion(value);

        savePreference(
            "region",
            value
        );
    }

    // ==============================
    // LANGUAGE
    // ==============================

    function handleLanguage(value) {
        setLanguage(value);

        localStorage.setItem(
            "language",
            value
        );
    }

    // ==============================
    // WEATHER ALERTS
    // ==============================

    async function loadAlertPreferences() {
        try {
            setAlertLoading(true);

            const response =
                await api.get(
                    "/auth/alert-preferences"
                );

            if (
                response.data?.alertPreferences
            ) {
                setAlertPreferences(
                    response.data.alertPreferences
                );
            }
        } catch (err) {
            console.error(
                "Failed to load alert preferences:",
                err
            );
        } finally {
            setAlertLoading(false);
        }
    }

    async function toggleAlertPreference(type) {
        const updatedPreferences = {
            ...alertPreferences,
            [type]:
                !alertPreferences[type],
        };

        setAlertPreferences(
            updatedPreferences
        );

        try {
            setAlertSaving(true);

            await api.put(
                "/auth/alert-preferences",
                {
                    alertPreferences:
                        updatedPreferences,
                }
            );
        } catch (err) {
            console.error(
                "Failed to save alert preferences:",
                err
            );

            setAlertPreferences(
                alertPreferences
            );
        } finally {
            setAlertSaving(false);
        }
    }

    // ==============================
    // SHARE APP
    // ==============================

    async function shareApp() {
        const shareData = {
            title: "SkySense AI",

            text:
                "☁️ Check out SkySense AI - Intelligent Weather Monitoring and Personalized Recommendation System.",

            url:
                window.location.origin,
        };

        try {
            if (
                navigator.share
            ) {
                await navigator.share(
                    shareData
                );
            } else if (
                navigator.clipboard
            ) {
                await navigator.clipboard.writeText(
                    window.location.origin
                );

                alert(
                    "SkySense AI link copied to clipboard!"
                );
            } else {
                alert(
                    "Share link: " +
                    window.location.origin
                );
            }
        } catch (error) {
            if (
                error.name !==
                "AbortError"
            ) {
                console.error(
                    "Share failed:",
                    error
                );
            }
        }
    }

    // ==============================
    // RATING
    // ==============================

    function handleRating(value) {
        setRating(value);

        localStorage.setItem(
            "skySenseRating",
            value
        );
    }

    // ==============================
    // LOAD
    // ==============================

    useEffect(() => {
        loadAlertPreferences();
    }, []);

    useEffect(() => {
        document.body.classList.toggle(
            "dark-mode",
            darkMode
        );
    }, [darkMode]);

    // ==============================
    // UI
    // ==============================

    return (
        <main className="settings-page">

            {/* ==========================
                PAGE HEADER
            =========================== */}

            <div className="settings-header">

                <span className="settings-label">
                    {t("PREFERENCES")}
                </span>

                <h1>
                    {t("Settings")}
                </h1>

                <p>
                    {t(
                        "Customize your SkySense AI experience."
                    )}
                </p>

            </div>


            {/* ==========================
                APPEARANCE
            =========================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <span className="settings-icon">
                        🎨
                    </span>

                    <div>

                        <h2>
                            {t("Appearance")}
                        </h2>

                        <p>
                            {t(
                                "Choose how SkySense AI looks."
                            )}
                        </p>

                    </div>

                </div>


                <div className="setting-row">

                    <div>

                        <strong>
                            {darkMode
                                ? t("Dark Mode")
                                : t("Light Mode")}
                        </strong>

                        <small>
                            {darkMode
                                ? t(
                                    "Dark dashboard theme is enabled."
                                )
                                : t(
                                    "Light dashboard theme is enabled."
                                )}
                        </small>

                    </div>


                    <button
                        type="button"
                        className={
                            darkMode
                                ? "theme-toggle on"
                                : "theme-toggle"
                        }
                        onClick={
                            handleDarkMode
                        }
                    >

                        <span>
                            {darkMode
                                ? "🌙"
                                : "☀️"}
                        </span>

                    </button>

                </div>

            </section>


            {/* ==========================
                WEATHER UNITS
            =========================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <span className="settings-icon">
                        🌡️
                    </span>

                    <div>

                        <h2>
                            {t("Weather Units")}
                        </h2>

                        <p>
                            {t(
                                "Select the units used throughout the weather dashboard."
                            )}
                        </p>

                    </div>

                </div>


                <div className="settings-grid">

                    <label className="setting-field">

                        <span>
                            {t("Temperature")}
                        </span>

                        <select
                            value={
                                temperatureUnit
                            }
                            onChange={(e) =>
                                handleTemperature(
                                    e.target.value
                                )
                            }
                        >

                            <option value="C">
                                Celsius (°C)
                            </option>

                            <option value="F">
                                Fahrenheit (°F)
                            </option>

                        </select>

                    </label>


                    <label className="setting-field">

                        <span>
                            {t("Wind Speed")}
                        </span>

                        <select
                            value={windUnit}
                            onChange={(e) =>
                                handleWind(
                                    e.target.value
                                )
                            }
                        >

                            <option value="kmh">
                                Kilometres/hour (km/h)
                            </option>

                            <option value="ms">
                                Metres/second (m/s)
                            </option>

                            <option value="mph">
                                Miles/hour (mph)
                            </option>

                        </select>

                    </label>


                    <label className="setting-field">

                        <span>
                            {t("Rain")}
                        </span>

                        <select
                            value={rainUnit}
                            onChange={(e) =>
                                handleRain(
                                    e.target.value
                                )
                            }
                        >

                            <option value="mm">
                                Millimetres (mm)
                            </option>

                            <option value="in">
                                Inches (in)
                            </option>

                        </select>

                    </label>


                    <label className="setting-field">

                        <span>
                            {t("Pressure")}
                        </span>

                        <select
                            value={pressureUnit}
                            onChange={(e) =>
                                handlePressure(
                                    e.target.value
                                )
                            }
                        >

                            <option value="hpa">
                                Hectopascal (hPa)
                            </option>

                            <option value="inhg">
                                Inches of Mercury (inHg)
                            </option>

                        </select>

                    </label>

                </div>

            </section>


            {/* ==========================
                REGION & LANGUAGE
            =========================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <span className="settings-icon">
                        🌍
                    </span>

                    <div>

                        <h2>
                            {t(
                                "Region & Language"
                            )}
                        </h2>

                        <p>
                            {t(
                                "Set your preferred region and language."
                            )}
                        </p>

                    </div>

                </div>


                <div className="settings-grid">

                    {/* COUNTRY */}

                    <label className="setting-field">

                        <span>
                            {t(
                                "Country / Region"
                            )}
                        </span>

                        <select
                            value={region}
                            onChange={(e) =>
                                handleRegion(
                                    e.target.value
                                )
                            }
                        >

                            {countries.map(
                                ([code, name]) => (
                                    <option
                                        key={code}
                                        value={code}
                                    >
                                        {name}
                                    </option>
                                )
                            )}

                        </select>

                    </label>


                    {/* LANGUAGE */}

                    <label className="setting-field">

                        <span>
                            {t("Language")}
                        </span>

                        <select
                            value={language}
                            onChange={(e) =>
                                handleLanguage(
                                    e.target.value
                                )
                            }
                        >

                            {languages.map(
                                ([code, name]) => (
                                    <option
                                        key={code}
                                        value={code}
                                    >
                                        {name}
                                    </option>
                                )
                            )}

                        </select>

                    </label>

                </div>

            </section>


            {/* ==========================
                WEATHER ALERTS
            =========================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <span className="settings-icon">
                        ⚠️
                    </span>

                    <div>

                        <h2>
                            {t(
                                "Weather Alert Preferences"
                            )}
                        </h2>

                        <p>
                            {t(
                                "Choose which weather alerts you want to receive."
                            )}
                        </p>

                    </div>

                </div>


                {alertLoading ? (

                    <div className="setting-row">

                        <div>

                            <strong>
                                Loading alert preferences...
                            </strong>

                        </div>

                    </div>

                ) : (

                    <div className="alert-preference-list">

                        {/* RAIN */}

                        <div className="alert-preference-row">

                            <div>

                                <strong>
                                    🌧️{" "}
                                    {t(
                                        "Rain Alerts"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "Get notified when significant rainfall is expected."
                                    )}
                                </small>

                            </div>


                            <button
                                type="button"
                                className={
                                    alertPreferences.rain
                                        ? "preference-switch active"
                                        : "preference-switch"
                                }
                                onClick={() =>
                                    toggleAlertPreference(
                                        "rain"
                                    )
                                }
                                disabled={
                                    alertSaving
                                }
                            >

                                <span />

                            </button>

                        </div>


                        {/* TEMPERATURE */}

                        <div className="alert-preference-row">

                            <div>

                                <strong>
                                    🌡️{" "}
                                    {t(
                                        "Temperature Alerts"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "Get notified about unusually high temperatures."
                                    )}
                                </small>

                            </div>


                            <button
                                type="button"
                                className={
                                    alertPreferences.temperature
                                        ? "preference-switch active"
                                        : "preference-switch"
                                }
                                onClick={() =>
                                    toggleAlertPreference(
                                        "temperature"
                                    )
                                }
                                disabled={
                                    alertSaving
                                }
                            >

                                <span />

                            </button>

                        </div>


                        {/* UV */}

                        <div className="alert-preference-row">

                            <div>

                                <strong>
                                    ☀️{" "}
                                    {t(
                                        "UV Alerts"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "Get notified when UV levels are high."
                                    )}
                                </small>

                            </div>


                            <button
                                type="button"
                                className={
                                    alertPreferences.uv
                                        ? "preference-switch active"
                                        : "preference-switch"
                                }
                                onClick={() =>
                                    toggleAlertPreference(
                                        "uv"
                                    )
                                }
                                disabled={
                                    alertSaving
                                }
                            >

                                <span />

                            </button>

                        </div>


                        {/* WIND */}

                        <div className="alert-preference-row">

                            <div>

                                <strong>
                                    💨{" "}
                                    {t(
                                        "Strong Wind Alerts"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "Get notified when strong winds are expected."
                                    )}
                                </small>

                            </div>


                            <button
                                type="button"
                                className={
                                    alertPreferences.wind
                                        ? "preference-switch active"
                                        : "preference-switch"
                                }
                                onClick={() =>
                                    toggleAlertPreference(
                                        "wind"
                                    )
                                }
                                disabled={
                                    alertSaving
                                }
                            >

                                <span />

                            </button>

                        </div>


                        {/* THUNDERSTORM */}

                        <div className="alert-preference-row">

                            <div>

                                <strong>
                                    ⛈️{" "}
                                    {t(
                                        "Thunderstorm Alerts"
                                    )}
                                </strong>

                                <small>
                                    {t(
                                        "Get notified when thunderstorms are expected."
                                    )}
                                </small>

                            </div>


                            <button
                                type="button"
                                className={
                                    alertPreferences.thunderstorm
                                        ? "preference-switch active"
                                        : "preference-switch"
                                }
                                onClick={() =>
                                    toggleAlertPreference(
                                        "thunderstorm"
                                    )
                                }
                                disabled={
                                    alertSaving
                                }
                            >

                                <span />

                            </button>

                        </div>

                    </div>

                )}

            </section>


            {/* ==========================
                APP & SUPPORT
            =========================== */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <span className="settings-icon">
                        📱
                    </span>

                    <div>

                        <h2>
                            {t(
                                "App & Support"
                            )}
                        </h2>

                        <p>
                            {t(
                                "Explore, share and learn more about SkySense AI."
                            )}
                        </p>

                    </div>

                </div>


                <div className="settings-action-list">

                    {/* SHARE */}

                    <button
                        type="button"
                        className="settings-action"
                        onClick={
                            shareApp
                        }
                    >

                        <span className="settings-action-icon">
                            📤
                        </span>

                        <div>

                            <strong>
                                {t(
                                    "Share SkySense AI"
                                )}
                            </strong>

                            <small>
                                {t(
                                    "Share the app with your friends"
                                )}
                            </small>

                        </div>

                        <span className="settings-arrow">
                            →
                        </span>

                    </button>


                    {/* RATING */}

                    <button
                        type="button"
                        className="settings-action"
                        onClick={() =>
                            setInfoModal(
                                "rating"
                            )
                        }
                    >

                        <span className="settings-action-icon">
                            ⭐
                        </span>

                        <div>

                            <strong>
                                {t(
                                    "Rate SkySense AI"
                                )}
                            </strong>

                            <small>
                                {t(
                                    "Tell us how you like the app"
                                )}
                            </small>

                        </div>

                        <span className="settings-arrow">
                            →
                        </span>

                    </button>


                    {/* ABOUT APP */}

                    <button
                        type="button"
                        className="settings-action"
                        onClick={() =>
                            setInfoModal(
                                "about"
                            )
                        }
                    >

                        <span className="settings-action-icon">
                            ℹ️
                        </span>

                        <div>

                            <strong>
                                {t(
                                    "About SkySense AI"
                                )}
                            </strong>

                            <small>
                                {t(
                                    "Learn about this weather platform"
                                )}
                            </small>

                        </div>

                        <span className="settings-arrow">
                            →
                        </span>

                    </button>


                    {/* ABOUT US */}

                    <button
                        type="button"
                        className="settings-action"
                        onClick={() =>
                            navigate(
                                "/about"
                            )
                        }
                    >

                        <span className="settings-action-icon">
                            👥
                        </span>

                        <div>

                            <strong>
                                {t(
                                    "About Us"
                                )}
                            </strong>

                            <small>
                                {t(
                                    "Learn more about the project"
                                )}
                            </small>

                        </div>

                        <span className="settings-arrow">
                            →
                        </span>

                    </button>


                    {/* TERMS */}

                    <button
                        type="button"
                        className="settings-action"
                        onClick={() =>
                            setInfoModal(
                                "terms"
                            )
                        }
                    >

                        <span className="settings-action-icon">
                            📄
                        </span>

                        <div>

                            <strong>
                                {t(
                                    "Terms of Use"
                                )}
                            </strong>

                            <small>
                                {t(
                                    "Usage guidelines for SkySense AI"
                                )}
                            </small>

                        </div>

                        <span className="settings-arrow">
                            →
                        </span>

                    </button>


                    {/* PRIVACY */}

                    <button
                        type="button"
                        className="settings-action"
                        onClick={() =>
                            setInfoModal(
                                "privacy"
                            )
                        }
                    >

                        <span className="settings-action-icon">
                            🔒
                        </span>

                        <div>

                            <strong>
                                {t(
                                    "Privacy Policy"
                                )}
                            </strong>

                            <small>
                                {t(
                                    "How your information is handled"
                                )}
                            </small>

                        </div>

                        <span className="settings-arrow">
                            →
                        </span>

                    </button>

                </div>

            </section>


            {/* ==========================
                APP INFORMATION
            =========================== */}

            <section className="settings-card app-info-card">

                <div className="settings-card-header">

                    <span className="settings-icon">
                        ☁️
                    </span>

                    <div>

                        <h2>
                            SkySense AI
                        </h2>

                        <p>
                            Intelligent Weather Monitoring
                            and Personalized Recommendation System
                        </p>

                    </div>

                </div>


                <div className="app-info-content">

                    <p>
                        SkySense AI provides real-time
                        weather information, forecasts,
                        location-based monitoring,
                        weather alerts and AI-powered
                        personalized recommendations.
                    </p>


                    <div className="app-version">

                        <span>
                            {t("Version")}
                        </span>

                        <strong>
                            1.0.0
                        </strong>

                    </div>


                    <div className="app-version">

                        <span>
                            {t("Platform")}
                        </span>

                        <strong>
                            {t(
                                "Weather Intelligence Platform"
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==========================
                FOOTER
            =========================== */}

            <div className="settings-footer">

                <span>
                    ☁️ SkySense AI
                </span>

                <span>•</span>

                <span>
                    Weather Intelligence Platform
                </span>

                <span>•</span>

                <span>
                    Version 1.0.0
                </span>

            </div>


            {/* ==========================
                MODALS
            =========================== */}

            {infoModal && (

                <div
                    className="settings-modal-overlay"
                    onClick={() =>
                        setInfoModal("")
                    }
                >

                    <div
                        className="settings-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="settings-modal-close"
                            onClick={() =>
                                setInfoModal("")
                            }
                        >
                            ×
                        </button>


                        {/* ==================
                            RATING
                        =================== */}

                        {infoModal ===
                            "rating" && (

                                <>

                                    <div className="settings-modal-icon">
                                        ⭐
                                    </div>

                                    <h2>
                                        {t(
                                            "Rate SkySense AI"
                                        )}
                                    </h2>

                                    <p>
                                        How would you rate your
                                        SkySense AI experience?
                                    </p>


                                    <div className="star-rating">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (

                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        handleRating(
                                                            star
                                                        )
                                                    }
                                                    className={
                                                        star <= rating
                                                            ? "star selected"
                                                            : "star"
                                                    }
                                                >
                                                    ★
                                                </button>

                                            )
                                        )}

                                    </div>


                                    {rating > 0 && (

                                        <p className="rating-message">

                                            Thank you for rating
                                            SkySense AI ⭐

                                        </p>

                                    )}

                                </>

                            )}


                        {/* ==================
                            ABOUT APP
                        =================== */}

                        {infoModal ===
                            "about" && (

                                <>

                                    <div className="settings-modal-icon">
                                        ☁️
                                    </div>

                                    <h2>
                                        {t(
                                            "About SkySense AI"
                                        )}
                                    </h2>

                                    <p>
                                        SkySense AI is an
                                        intelligent weather
                                        monitoring and
                                        personalized
                                        recommendation system.
                                    </p>

                                    <p>
                                        The platform combines
                                        real-time weather data,
                                        forecasts, location
                                        services, alerts,
                                        favorites, weather
                                        history and AI-powered
                                        recommendations in
                                        one application.
                                    </p>

                                    <strong>
                                        Version 1.0.0
                                    </strong>

                                </>

                            )}


                        {/* ==================
                            TERMS
                        =================== */}

                        {infoModal ===
                            "terms" && (

                                <>

                                    <div className="settings-modal-icon">
                                        📄
                                    </div>

                                    <h2>
                                        {t(
                                            "Terms of Use"
                                        )}
                                    </h2>

                                    <p>
                                        SkySense AI is designed
                                        for weather information
                                        and general informational
                                        purposes.
                                    </p>

                                    <p>
                                        Weather information may
                                        change and should not
                                        be considered guaranteed
                                        or completely accurate.
                                    </p>

                                    <p>
                                        Users are responsible
                                        for using weather
                                        information appropriately
                                        and should follow official
                                        safety guidance during
                                        severe weather.
                                    </p>

                                </>

                            )}


                        {/* ==================
                            PRIVACY
                        =================== */}

                        {infoModal ===
                            "privacy" && (

                                <>

                                    <div className="settings-modal-icon">
                                        🔒
                                    </div>

                                    <h2>
                                        {t(
                                            "Privacy Policy"
                                        )}
                                    </h2>

                                    <p>
                                        SkySense AI may store
                                        account information,
                                        favorites, weather
                                        searches and
                                        preferences to provide
                                        application features.
                                    </p>

                                    <p>
                                        Location information may
                                        be used to provide
                                        location-based weather
                                        information.
                                    </p>

                                    <p>
                                        Your information is used
                                        only to support the
                                        functionality of the
                                        application.
                                    </p>

                                </>

                            )}

                    </div>

                </div>

            )}

        </main>
    );
}