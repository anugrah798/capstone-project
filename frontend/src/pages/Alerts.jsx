import { useEffect, useState } from "react";
import api from "../services/api";

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadAlerts() {
        try {
            setLoading(true);
            const { data } = await api.get("/alerts");
            setAlerts(data.alerts || []);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load weather alerts"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAlerts();
    }, []);

    async function markRead(id) {
        try {
            await api.put(`/alerts/${id}/read`);
            loadAlerts();
        } catch (err) {
            console.log("Unable to mark alert as read");
        }
    }

    async function removeAlert(id) {
        try {
            await api.delete(`/alerts/${id}`);
            loadAlerts();
        } catch (err) {
            console.log("Unable to delete alert");
        }
    }

    async function clearAll() {
        try {
            await api.delete("/alerts");
            setAlerts([]);
        } catch (err) {
            console.log("Unable to clear alerts");
        }
    }

    function getIcon(type) {
        const value = type?.toLowerCase() || "";

        if (value.includes("rain")) return "🌧️";
        if (value.includes("thunder")) return "⛈️";
        if (value.includes("temperature")) return "🌡️";
        if (value.includes("uv")) return "☀️";
        if (value.includes("wind")) return "💨";

        return "⚠️";
    }

    function getSeverityClass(severity) {
        return `alert-${severity || "medium"}`;
    }

    return (
        <main className="container">

            <div className="title-row">
                <h1>🔔 Weather Alerts</h1>

                {alerts.length > 0 && (
                    <button
                        className="secondary"
                        onClick={clearAll}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {loading && (
                <div className="panel">
                    <p>Loading alerts...</p>
                </div>
            )}

            {error && (
                <div className="panel">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && alerts.length === 0 && (
                <div className="panel alert-empty">
                    <div className="alert-empty-icon">
                        🔔
                    </div>

                    <h2>No Weather Alerts</h2>

                    <p>
                        You're all clear! Weather alerts for your
                        locations will appear here.
                    </p>
                </div>
            )}

            {!loading && alerts.length > 0 && (
                <div className="alerts-list">

                    {alerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`weather-alert ${getSeverityClass(
                                alert.severity
                            )} ${alert.isRead ? "alert-read" : ""
                                }`}
                        >

                            <div className="alert-icon">
                                {getIcon(alert.type)}
                            </div>

                            <div className="alert-content">

                                <div className="alert-top">
                                    <h3>
                                        {alert.type}
                                    </h3>

                                    <span className="alert-severity">
                                        {alert.severity}
                                    </span>
                                </div>

                                <p className="alert-city">
                                    📍 {alert.city}
                                </p>

                                <p className="alert-message">
                                    {alert.message}
                                </p>

                                <small>
                                    {new Date(
                                        alert.createdAt
                                    ).toLocaleString()}
                                </small>

                            </div>

                            <div className="alert-actions">

                                {!alert.isRead && (
                                    <button
                                        className="secondary"
                                        onClick={() =>
                                            markRead(alert._id)
                                        }
                                    >
                                        Mark as Read
                                    </button>
                                )}

                                <button
                                    className="danger"
                                    onClick={() =>
                                        removeAlert(alert._id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </main>
    );
}