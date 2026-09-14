import "./Assistant.css";
import { useEffect, useState } from "react";
import api from "../services/api";

function getWeatherIcon(code) {
  const id = Number(code);

  if (id >= 200 && id < 300) return "⛈️";
  if (id >= 300 && id < 400) return "🌦️";
  if (id >= 500 && id < 600) return "🌧️";
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800) return "☀️";
  if (id > 800) return "☁️";

  return "🌤️";
}

export default function Assistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [recentCities, setRecentCities] = useState([]);
  const [recentWeather, setRecentWeather] = useState({});

  const [selectedLocation, setSelectedLocation] = useState("current");
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  async function loadCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await api.get(
            `/weather/coordinates?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );

          setCurrentWeather(response.data.weather);
          setCurrentLocation({
            name: "Your Location",
            country: "",
          });
          setError("");
        } catch (err) {
          setError(
            err.response?.data?.message ||
            "Unable to load your current location weather."
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          "Location permission was denied. Please allow location access."
        );
        setLoading(false);
      }
    );
  }

  async function loadRecentCities() {
    const cities = JSON.parse(
      localStorage.getItem("skySenseRecentCities") || "[]"
    );

    if (!cities.length) return;

    setRecentCities(cities);

    const weatherMap = {};

    for (const city of cities) {
      try {
        const response = await api.get(
          `/weather/city/${encodeURIComponent(city)}`
        );

        weatherMap[city] = {
          weather: response.data.weather,
          location: response.data.location,
        };
      } catch {
        // Ignore a city if its weather cannot be loaded.
      }
    }

    setRecentWeather(weatherMap);
  }

  useEffect(() => {
    loadCurrentLocation();
    loadRecentCities();
  }, []);

  const selectedRecent =
    selectedLocation !== "current"
      ? recentWeather[selectedLocation]
      : null;

  const selectedWeather =
    selectedLocation === "current"
      ? currentWeather
      : selectedRecent?.weather || null;

  const selectedPlace =
    selectedLocation === "current"
      ? currentLocation
      : selectedRecent?.location || { name: selectedLocation, country: "" };

  async function ask(e) {
    e.preventDefault();

    if (!question.trim() || !selectedWeather) return;

    const userQuestion = question.trim();
    setAsking(true);

    try {
      const response = await api.post("/ai/chat", {
        question: userQuestion,
        weather: selectedWeather,
      });

      setMessages((prev) => [
        ...prev,
        {
          q: userQuestion,
          a:
            response.data?.answer ||
            "Sorry, I could not answer that.",
        },
      ]);

      setQuestion("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          q: userQuestion,
          a: "Sorry, I could not answer that.",
        },
      ]);
    } finally {
      setAsking(false);
    }
  }

  const temperature =
    selectedWeather?.current?.temperature_2m;

  const humidity =
    selectedWeather?.current?.relative_humidity_2m;

  const wind =
    selectedWeather?.current?.wind_speed_10m != null
      ? Math.round(
        selectedWeather.current.wind_speed_10m * 3.6
      )
      : null;

  const condition =
    selectedWeather?.current?.condition || "Weather";

  return (
    <main className="assistant-page">
      <div className="assistant-header">
        <span>AI WEATHER ASSISTANT</span>
        <h1>SkySense AI</h1>
        <p>
          Ask questions about the weather and get personalized
          recommendations.
        </p>
      </div>

      {error && (
        <div className="assistant-error">
          {error}
        </div>
      )}

      {/* LOCATION PREFERENCE */}
      <section className="assistant-location-switcher">
        <div>
          <strong>Weather location</strong>
          <small>
            Choose which location the AI should use.
          </small>
        </div>

        <div className="assistant-location-options">
          <button
            type="button"
            className={
              selectedLocation === "current"
                ? "assistant-location-option active"
                : "assistant-location-option"
            }
            onClick={() => setSelectedLocation("current")}
            disabled={!currentWeather}
          >
            <span>📍</span>
            <div>
              <strong>Your Location</strong>
              <small>Default</small>
            </div>
          </button>

          {recentCities.map((city) => (
            <button
              key={city}
              type="button"
              className={
                selectedLocation === city
                  ? "assistant-location-option active"
                  : "assistant-location-option"
              }
              onClick={() => setSelectedLocation(city)}
              disabled={!recentWeather[city]}
            >
              <span>🔎</span>
              <div>
                <strong>{city}</strong>
                <small>Recent searched city</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CURRENT WEATHER */}
      <section className="assistant-weather-card">
        <div className="assistant-weather-heading">
          <div>
            <span>🌤️</span>
            <div>
              <h2>Current Weather</h2>
              <p>
                {selectedPlace?.name ||
                  "Your Location"}
                {selectedPlace?.country
                  ? `, ${selectedPlace.country}`
                  : ""}
              </p>
            </div>
          </div>

          <span className="assistant-selected-badge">
            {selectedLocation === "current"
              ? "DEFAULT"
              : "SEARCHED"}
          </span>
        </div>

        {loading ? (
          <div className="assistant-loading">
            Loading current weather...
          </div>
        ) : (
          <div className="assistant-weather-grid">
            <div className="assistant-weather-item">
              <span>🌡️</span>
              <small>Temperature</small>
              <strong>
                {temperature != null
                  ? `${Math.round(temperature)}°C`
                  : "--"}
              </strong>
            </div>

            <div className="assistant-weather-item">
              <span>💧</span>
              <small>Humidity</small>
              <strong>
                {humidity != null
                  ? `${humidity}%`
                  : "--"}
              </strong>
            </div>

            <div className="assistant-weather-item">
              <span>💨</span>
              <small>Wind</small>
              <strong>
                {wind != null
                  ? `${wind} km/h`
                  : "--"}
              </strong>
            </div>

            <div className="assistant-weather-item">
              <span>
                {getWeatherIcon(
                  selectedWeather?.current?.weather_code
                )}
              </span>
              <small>Condition</small>
              <strong>{condition}</strong>
            </div>
          </div>
        )}
      </section>

      {/* CHAT */}
      <section className="assistant-chat-card">
        <div className="assistant-chat-heading">
          <span>🤖</span>
          <div>
            <h2>Ask SkySense AI</h2>
            <p>
              Ask anything about the selected location's
              current weather.
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div
                className="assistant-message"
                key={index}
              >
                <div>
                  <strong>You</strong>
                  <p>{message.q}</p>
                </div>

                <div>
                  <strong>SkySense AI</strong>
                  <p>{message.a}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="assistant-quick-questions">
          <button
            type="button"
            onClick={() =>
              setQuestion("Will it rain today?")
            }
          >
            🌧️ Will it rain today?
          </button>

          <button
            type="button"
            onClick={() =>
              setQuestion("What should I wear today?")
            }
          >
            👕 What should I wear?
          </button>

          <button
            type="button"
            onClick={() =>
              setQuestion("Is it good weather for travelling?")
            }
          >
            🚗 Good for travelling?
          </button>

          <button
            type="button"
            onClick={() =>
              setQuestion("Is it safe to go outside today?")
            }
          >
            ☀️ Can I go outside?
          </button>
        </div>

        <form
          className="assistant-input-row"
          onSubmit={ask}
        >
          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Will it rain today? What should I wear?"
            disabled={loading || asking || !selectedWeather}
          />

          <button
            type="submit"
            disabled={
              loading ||
              asking ||
              !question.trim() ||
              !selectedWeather
            }
          >
            {asking ? "Thinking..." : "Ask AI →"}
          </button>
        </form>
      </section>
    </main>
  );
}
