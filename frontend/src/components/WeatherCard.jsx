function getWeatherIcon(code) {
  if (!code) return "☁️";

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

function getCondition(code) {
  if (!code) return "Weather";

  const id = Number(code);

  if (id >= 200 && id < 300) return "Thunderstorm";
  if (id >= 300 && id < 400) return "Drizzle";
  if (id >= 500 && id < 600) return "Rain";
  if (id >= 600 && id < 700) return "Snow";
  if (id >= 700 && id < 800) return "Foggy";
  if (id === 800) return "Clear Sky";
  if (id > 800) return "Cloudy";

  return "Weather";
}

export default function WeatherCard({ data }) {
  if (!data?.weather?.current) {
    return null;
  }

  const current = data.weather.current;

  const locationName =
    data.location?.name || "Kochi";

  const country =
    data.location?.country || "IN";

  const temperature =
    current.temperature_2m != null
      ? Math.round(current.temperature_2m)
      : "--";

  const humidity =
    current.relative_humidity_2m ?? "--";

  const wind =
    current.wind_speed_10m != null
      ? Math.round(current.wind_speed_10m * 3.6)
      : "--";

  const pressure =
    current.surface_pressure ?? "--";

  const visibility =
    current.visibility != null
      ? Math.round(current.visibility / 1000)
      : "--";

  const icon = getWeatherIcon(
    current.weather_code
  );

  const condition =
    current.condition ||
    getCondition(current.weather_code);

  // ================================
  // SHARE WEATHER
  // ================================

  async function shareWeather() {
    const shareText = `🌤️ SkySense AI Weather

📍 ${locationName}${country ? `, ${country}` : ""}
🌡️ Temperature: ${temperature}°C
☁️ Condition: ${condition}
💧 Humidity: ${humidity}%
💨 Wind: ${wind} km/h
◴ Pressure: ${pressure} hPa
👁️ Visibility: ${visibility} km

Check the weather using SkySense AI.`;

    try {
      // Native sharing on mobile/compatible browsers
      if (navigator.share) {
        await navigator.share({
          title: `Weather in ${locationName}`,
          text: shareText,
        });
      } else {
        // Copy fallback
        await navigator.clipboard.writeText(shareText);
        alert("Weather report copied! You can now share it with your friends.");
      }
    } catch (error) {
      // User cancelled sharing — do nothing
      if (error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareText);
          alert("Weather report copied! You can now share it.");
        } catch {
          alert("Unable to share weather information.");
        }
      }
    }
  }

  return (
    <article className="dashboard-card current-weather-card">

      {/* HEADER */}

      <div className="card-heading">

        <div>
          <span className="card-label">
            Current Weather
          </span>

          <small>
            {new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </small>
        </div>

      </div>


      {/* MAIN WEATHER */}

      <div className="current-weather-main">

        <div className="large-weather-icon">
          {icon}
        </div>

        <div className="current-weather-text">

          <div className="large-temperature">
            {temperature}
            <sup>°C</sup>
          </div>

          <div className="weather-condition">
            {condition}
          </div>

          <div className="weather-location">
            {locationName}
            {country ? `, ${country}` : ""}
          </div>

        </div>

      </div>


      {/* WEATHER DETAILS */}

      <div className="current-weather-details">

        {/* HUMIDITY */}

        <div>
          <span className="detail-icon">
            💧
          </span>

          <strong>
            {humidity}%
          </strong>

          <small>
            Humidity
          </small>
        </div>


        {/* WIND */}

        <div>
          <span className="detail-icon">
            ≋
          </span>

          <strong>
            {wind} km/h
          </strong>

          <small>
            Wind
          </small>
        </div>


        {/* PRESSURE */}

        <div>
          <span className="detail-icon">
            ◴
          </span>

          <strong>
            {pressure} hPa
          </strong>

          <small>
            Pressure
          </small>
        </div>


        {/* VISIBILITY */}

        <div>
          <span className="detail-icon">
            ◉
          </span>

          <strong>
            {visibility} km
          </strong>

          <small>
            Visibility
          </small>
        </div>

      </div>


      {/* SHARE BUTTON */}

      <button
        type="button"
        className="share-weather-button"
        onClick={shareWeather}
      >
        🔗 Share Weather
      </button>

    </article>
  );
}