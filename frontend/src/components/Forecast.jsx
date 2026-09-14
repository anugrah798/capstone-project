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

function getDayName(date, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export default function Forecast({ daily }) {
  if (!daily?.time?.length) {
    return null;
  }

  return (
    <section className="forecast-page-section">

      <div className="forecast-section-heading">
        <div>
          <span className="forecast-small-title">
            WEATHER FORECAST
          </span>

          <h2>Next 7 Days</h2>
        </div>

        <span className="forecast-location">
          7 day forecast
        </span>
      </div>

      <div className="forecast-dashboard-list">

        {daily.time.slice(0, 7).map((date, index) => {

          const maxTemp =
            daily.temperature_2m_max?.[index];

          const minTemp =
            daily.temperature_2m_min?.[index];

          const rain =
            daily.precipitation_probability_max?.[
            index
            ];

          const code =
            daily.weather_code?.[index];

          return (
            <div
              className={
                index === 0
                  ? "forecast-dashboard-row today"
                  : "forecast-dashboard-row"
              }
              key={date}
            >

              {/* DAY */}

              <div className="forecast-day-name">
                <strong>
                  {getDayName(date, index)}
                </strong>

                {index === 0 && (
                  <small>
                    Today
                  </small>
                )}
              </div>


              {/* WEATHER ICON */}

              <div className="forecast-dashboard-icon">
                {getWeatherIcon(code)}
              </div>


              {/* CONDITION */}

              <div className="forecast-condition">
                <span>
                  {code === 800
                    ? "Clear"
                    : code > 800
                      ? "Cloudy"
                      : code >= 500 &&
                        code < 600
                        ? "Rain"
                        : "Weather"}
                </span>
              </div>


              {/* RAIN */}

              <div className="forecast-rain">
                💧 {rain ?? 0}%
              </div>


              {/* TEMPERATURE */}

              <div className="forecast-temperatures">
                <strong>
                  {maxTemp != null
                    ? Math.round(maxTemp)
                    : "--"}
                  °
                </strong>

                <span>
                  {minTemp != null
                    ? Math.round(minTemp)
                    : "--"}
                  °
                </span>
              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}