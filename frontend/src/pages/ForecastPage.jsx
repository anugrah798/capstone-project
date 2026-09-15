import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";
import api from "../services/api";

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "🌤️";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 57) return "🌦️";
    if (code >= 61 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95) return "⛈️";
    return "🌤️";
}

function formatDay(date) {
    return new Date(date + "T00:00:00").toLocaleDateString(
        "en-US",
        {
            weekday: "short",
        }
    );
}

export default function ForecastPage() {
    const [searchParams] = useSearchParams();

    const [data, setData] = useState(null);
    const [city, setCity] = useState(
        searchParams.get("city") || ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadForecast(place = city) {
        if (!place.trim()) return;

        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                `/weather/city/${encodeURIComponent(place)}`
            );

            setData(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load forecast"
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    async function loadForecastByCoordinates(latitude, longitude) {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(
                `/weather/coordinates?latitude=${latitude}&longitude=${longitude}`
            );

            setData({
                location: {
                    name: "Your Location",
                    country: "",
                    latitude,
                    longitude,
                },
                weather: response.data.weather,
            });
            setCity("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load location forecast"
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const cityFromUrl = searchParams.get("city");
        const latitude = searchParams.get("latitude");
        const longitude = searchParams.get("longitude");
        const mode = searchParams.get("mode");

        // HOME -> searched city
        // Example: /forecast?mode=city&city=Chennai
        if (mode === "city" && cityFromUrl) {
            setCity(cityFromUrl);
            loadForecast(cityFromUrl);
            return;
        }

        // HOME -> Your Location
        // Example: /forecast?mode=location&latitude=...&longitude=...
        if (
            mode === "location" &&
            latitude &&
            longitude
        ) {
            loadForecastByCoordinates(
                latitude,
                longitude
            );
            return;
        }

        // Backward-compatible handling if the URL contains
        // coordinates/city but no mode.
        if (cityFromUrl) {
            setCity(cityFromUrl);
            loadForecast(cityFromUrl);
            return;
        }

        if (latitude && longitude) {
            loadForecastByCoordinates(
                latitude,
                longitude
            );
            return;
        }

        // Forecast opened directly:
        // use the user's current browser location.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    loadForecastByCoordinates(
                        coords.latitude,
                        coords.longitude
                    );
                },
                () => {
                    setError(
                        "Please allow location access or search for a city."
                    );
                }
            );
        } else {
            setError(
                "Please search for a city to view the forecast."
            );
        }
    }, [searchParams]);

    const daily = data?.weather?.daily;

    const chartData =
        daily?.time?.map((date, index) => ({
            day: formatDay(date),
            max:
                daily.temperature_2m_max?.[index] ?? 0,
            min:
                daily.temperature_2m_min?.[index] ?? 0,
            rain:
                daily.precipitation_probability_max?.[index] ?? 0,
        })) || [];

    // WEATHER ANALYTICS
    const analytics = daily?.time?.length
        ? {
            avgTemp:
                daily.temperature_2m_max.reduce((a, b) => a + b, 0) /
                daily.temperature_2m_max.length,
            highestTemp: Math.max(...daily.temperature_2m_max),
            lowestTemp: Math.min(...daily.temperature_2m_min),
            highestRain: Math.max(...daily.precipitation_probability_max),
            maxUV: Math.max(...daily.uv_index_max),
            bestDayIndex: daily.precipitation_probability_max.indexOf(
                Math.min(...daily.precipitation_probability_max)
            ),
        }
        : null;

    return (
        <main className="container">

            <div className="forecast-page-title">
                <div className="forecast-title-icon">📊</div>
                <div>
                    <h1>Weather Forecast</h1>
                    <p>Explore the next 7 days and understand upcoming weather trends.</p>
                </div>
            </div>

            {/* SEARCH */}

            <div className="forecast-search-panel">
                <div className="forecast-search-label">
                    <span>⌕</span>
                    <div>
                        <strong>Search another location</strong>
                        <small>Get a 7-day forecast for any city</small>
                    </div>
                </div>

                <div className="forecast-search-row">
                    <input
                        type="text"
                        value={city}
                        placeholder="Search city..."
                        spellCheck="false"
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                loadForecast();
                            }
                        }}
                        className="forecast-city-input"
                    />

                    <button
                        type="button"
                        className="forecast-search-button"
                        onClick={() => loadForecast()}
                        disabled={loading}
                    >
                        <span>{loading ? "⟳" : "⌕"}</span>
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="forecast-error">
                    <span className="forecast-error-icon">⚠️</span>

                    <div>
                        <strong>{error}</strong>

                        <p>
                            Please check the city name and try again.
                        </p>
                    </div>
                </div>
            )}
            {data && daily && (
                <>
                    {/* LOCATION */}

                    <div className="forecast-location-card">
                        <div className="forecast-location-main">
                            <div className="forecast-location-pin">📍</div>
                            <div>
                                <span className="forecast-eyebrow">
                                    FORECAST LOCATION
                                </span>
                                <h2>
                                    {data.location?.name}
                                    {data.location?.country
                                        ? `, ${data.location.country}`
                                        : ""}
                                </h2>
                                <p>
                                    7-day weather forecast and weather trends
                                </p>
                            </div>
                        </div>

                        <div className="forecast-location-badge">
                            <span>7 DAYS</span>
                            <strong>Forecast</strong>
                        </div>
                    </div>

                    {/* 7 DAY CARDS */}

                    <div className="panel forecast-section-panel">
                        <h2>📅 Next 7 Days</h2>

                        <div className="list-grid">
                            {daily.time.map(
                                (date, index) => (
                                    <div
                                        className="list-card"
                                        key={date}
                                    >
                                        <h3>
                                            {index === 0
                                                ? "Today"
                                                : formatDay(date)}
                                        </h3>

                                        <div
                                            style={{
                                                fontSize: "36px",
                                                margin: "12px 0",
                                            }}
                                        >
                                            {getWeatherIcon(
                                                daily.weather_code?.[
                                                index
                                                ]
                                            )}
                                        </div>

                                        <p>
                                            <strong>
                                                {Math.round(
                                                    daily
                                                        .temperature_2m_max?.[
                                                    index
                                                    ]
                                                )}°
                                            </strong>{" "}
                                            /{" "}
                                            {Math.round(
                                                daily
                                                    .temperature_2m_min?.[
                                                index
                                                ]
                                            )}
                                            °C
                                        </p>

                                        <p>
                                            🌧️{" "}
                                            {daily
                                                .precipitation_probability_max?.[
                                                index
                                            ] ?? 0}
                                            % rain
                                        </p>

                                        <p>
                                            ☀️ UV{" "}
                                            {daily.uv_index_max?.[
                                                index
                                            ] ?? "--"}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* WEATHER ANALYTICS */}

                    {analytics && (
                        <div className="panel forecast-section-panel">
                            <h2>📈 Weather Analytics</h2>

                            <div className="list-grid">
                                <div className="list-card">
                                    <div style={{ fontSize: "32px" }}>🌡️</div>
                                    <h3>Average Daily Maximum</h3>
                                    <strong style={{ fontSize: "28px" }}>
                                        {analytics.avgTemp.toFixed(1)}°C
                                    </strong>
                                    <p>7-day average maximum</p>
                                </div>

                                <div className="list-card">
                                    <div style={{ fontSize: "32px" }}>🔥</div>
                                    <h3>Highest Temperature</h3>
                                    <strong style={{ fontSize: "28px" }}>
                                        {Math.round(analytics.highestTemp)}°C
                                    </strong>
                                    <p>Expected maximum</p>
                                </div>

                                <div className="list-card">
                                    <div style={{ fontSize: "32px" }}>❄️</div>
                                    <h3>Lowest Temperature</h3>
                                    <strong style={{ fontSize: "28px" }}>
                                        {Math.round(analytics.lowestTemp)}°C
                                    </strong>
                                    <p>Expected minimum</p>
                                </div>

                                <div className="list-card">
                                    <div style={{ fontSize: "32px" }}>🌧️</div>
                                    <h3>Highest Rain Chance</h3>
                                    <strong style={{ fontSize: "28px" }}>
                                        {analytics.highestRain}%
                                    </strong>
                                    <p>Maximum probability</p>
                                </div>

                                <div className="list-card">
                                    <div style={{ fontSize: "32px" }}>☀️</div>
                                    <h3>Maximum UV Index</h3>
                                    <strong style={{ fontSize: "28px" }}>
                                        {analytics.maxUV}
                                    </strong>
                                    <p>Highest expected UV</p>
                                </div>

                                <div className="list-card">
                                    <div style={{ fontSize: "32px" }}>🏃</div>
                                    <h3>Best Outdoor Day</h3>
                                    <strong style={{ fontSize: "24px" }}>
                                        {analytics.bestDayIndex === 0
                                            ? "Today"
                                            : formatDay(
                                                daily.time[analytics.bestDayIndex]
                                            )}
                                    </strong>
                                    <p>
                                        Lowest rain probability:{" "}
                                        {daily.precipitation_probability_max[
                                            analytics.bestDayIndex
                                        ]}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEMPERATURE CHART */}

                    <div className="panel forecast-chart-panel">
                        <h2>🌡️ Temperature Trend</h2>

                        <div
                            style={{
                                width: "100%",
                                height: "320px",
                            }}
                        >
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="day" />

                                    <YAxis
                                        unit="°C"
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="max"
                                        name="Maximum"
                                        stroke="#ff8a65"
                                        strokeWidth={3}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="min"
                                        name="Minimum"
                                        stroke="#4fc3f7"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RAIN CHART */}

                    <div className="panel forecast-chart-panel">
                        <h2>🌧️ Rain Probability</h2>

                        <div
                            style={{
                                width: "100%",
                                height: "320px",
                            }}
                        >
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="day" />

                                    <YAxis
                                        unit="%"
                                        domain={[0, 100]}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="rain"
                                        name="Rain Probability"
                                        fill="#42a5f5"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}