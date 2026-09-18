import api from "../services/api";
import TodayHourly from "../components/TodayHourly";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";

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

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDayName(date, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    function updateUnits() {
      setTemperatureUnit(
        localStorage.getItem("temperatureUnit") || "C"
      );

      setWindUnit(
        localStorage.getItem("windUnit") || "kmh"
      );

      setRainUnit(
        localStorage.getItem("rainUnit") || "mm"
      );

      setPressureUnit(
        localStorage.getItem("pressureUnit") || "hpa"
      );
    }

    window.addEventListener(
      "weatherUnitsChanged",
      updateUnits
    );

    return () => {
      window.removeEventListener(
        "weatherUnitsChanged",
        updateUnits
      );
    };
  }, []);

  function convertTemperature(value) {
    if (value == null) return "--";

    if (temperatureUnit === "F") {
      return Math.round((value * 9) / 5 + 32);
    }

    return Math.round(value);
  }

  function getTemperatureSymbol() {
    return temperatureUnit === "F" ? "°F" : "°C";
  }

  function convertWind(value) {
    if (value == null) return "--";

    if (windUnit === "ms") {
      return (value / 3.6).toFixed(1);
    }

    if (windUnit === "mph") {
      return (value / 1.60934).toFixed(1);
    }

    return Math.round(value);
  }

  function getWindSymbol() {
    if (windUnit === "ms") return "m/s";
    if (windUnit === "mph") return "mph";

    return "km/h";
  }

  function convertRain(value) {
    if (value == null) return "--";

    if (rainUnit === "in") {
      return (value / 25.4).toFixed(2);
    }

    return value;
  }

  function getRainSymbol() {
    return rainUnit === "in" ? "in" : "mm";
  }

  function convertPressure(value) {
    if (value == null) return "--";

    if (pressureUnit === "inhg") {
      return (value / 33.8639).toFixed(2);
    }

    return Math.round(value);
  }

  function getPressureSymbol() {
    return pressureUnit === "inhg"
      ? "inHg"
      : "hPa";
  }

  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const shareCardRef = useRef(null);
  const initialWeatherLoadedRef = useRef(false);
  const nearbyLoadingRef = useRef(false);
  const [suggestion, setSuggestion] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("today");

  const [nearbyCities, setNearbyCities] = useState([
    {
      city: "Kochi",
      country: "India",
      condition: "Loading",
      temperature: "--",
      icon: "☁️",
    },
    {
      city: "Ernakulam",
      country: "India",
      condition: "Loading",
      temperature: "--",
      icon: "☁️",
    },
    {
      city: "Thrissur",
      country: "India",
      condition: "Loading",
      temperature: "--",
      icon: "☁️",
    },
    {
      city: "Kottayam",
      country: "India",
      condition: "Loading",
      temperature: "--",
      icon: "☁️",
    },
  ]);

  // -----------------------------
  // SEARCH WEATHER
  // -----------------------------

  async function search(place = city) {
    if (!place.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setFavorite(false);

    try {
      const response = await api.get(
        `/weather/city/${encodeURIComponent(place)}`
      );

      const weatherData = response.data;

      const searchedCity =
        weatherData.location?.name || place.trim();

      localStorage.setItem(
        "skySenseLastSearchedCity",
        searchedCity
      );

      const oldCities = JSON.parse(
        localStorage.getItem("skySenseRecentCities") || "[]"
      );

      const updatedCities = [
        searchedCity,
        ...oldCities.filter(
          (item) =>
            item.toLowerCase() !== searchedCity.toLowerCase()
        ),
      ].slice(0, 5);

      localStorage.setItem(
        "skySenseRecentCities",
        JSON.stringify(updatedCities)
      );

      setData(weatherData);

      // Check favorite
      try {
        const favoritesResponse =
          await api.get("/favorites");

        const exists =
          favoritesResponse.data.favorites?.some(
            (item) =>
              item.city?.toLowerCase() ===
              weatherData.location?.name?.toLowerCase()
          );

        setFavorite(exists);
      } catch {
        console.log("Favorite check unavailable");
      }

      // AI suggestion
      try {
        const aiResponse =
          await api.post("/ai/suggestion", {
            weather: weatherData.weather,
          });

        setSuggestion(
          aiResponse.data.suggestion
        );
      } catch {
        console.log("AI suggestion unavailable");
        setSuggestion(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load weather information"
      );

      setData(null);
      setSuggestion(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialWeatherLoadedRef.current) return;

    initialWeatherLoadedRef.current = true;

    const cityFromUrl =
      searchParams.get("city");

    if (cityFromUrl) {
      setCity(cityFromUrl);
      search(cityFromUrl);
    } else {
      locate();
    }
  }, [searchParams]);

  // -----------------------------
  // ADD FAVORITE
  // -----------------------------

  async function addFavorite() {
    if (!data) return;

    setFavoriteLoading(true);
    setError("");

    try {
      const { data: favoritesData } =
        await api.get("/favorites");

      const existingFavorite =
        favoritesData.favorites?.find(
          (item) =>
            item.city?.toLowerCase() ===
            data.location?.name?.toLowerCase()
        );

      if (existingFavorite) {
        await api.delete(
          `/favorites/${existingFavorite._id}`
        );

        setFavorite(false);
      } else {
        await api.post("/favorites", {
          city: data.location.name,
          country: data.location.country,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        });

        setFavorite(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update favorite"
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  // -----------------------------
  // MY LOCATION
  // -----------------------------

  async function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await api.get(
            `/weather/coordinates?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );

          const locationData = response.data;

          setData({
            location: {
              name: "Your Location",
              country: "",
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            weather: locationData.weather,
          });

          setFavorite(false);

          try {
            const aiResponse =
              await api.post(
                "/ai/suggestion",
                {
                  weather: locationData.weather,
                }
              );

            setSuggestion(
              aiResponse.data.suggestion
            );
          } catch {
            setSuggestion(null);
          }
        } catch (err) {
          setError(
            err.response?.data?.message ||
            "Unable to load your location weather"
          );

          setData(null);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission was denied");
        setLoading(false);
      }
    );
  }

  // -----------------------------
  // WEATHER DATA
  // -----------------------------

  const current =
    data?.weather?.current;

  const daily =
    data?.weather?.daily;

  const hourly =
    data?.weather?.hourly;

  // -----------------------------
  // CURRENT VISIBILITY
  // -----------------------------
  // Backend now provides current.visibility
  // in meters.
  //
  // Example:
  // 10000 meters = 10 km
  //
  // The hourly fallback is kept only as
  // an additional safety check.

  const currentVisibility =
    current?.visibility != null
      ? current.visibility
      : hourly?.visibility?.[0] ?? null;

  // -----------------------------
  // RAIN CHART
  // -----------------------------

  const chartData = useMemo(() => {
    if (!hourly?.time?.length) return [];

    return hourly.time
      .slice(0, 8)
      .map((time, index) => ({
        time: new Date(
          time
        ).toLocaleTimeString([], {
          hour: "numeric",
        }),

        rain:
          hourly
            .precipitation_probability?.[
          index
          ] ?? 0,
      }));
  }, [hourly]);

  // -----------------------------
  // NEARBY CITIES
  // -----------------------------

  async function loadNearbyCities() {
    if (nearbyLoadingRef.current) return;

    if (!navigator.geolocation) {
      setNearbyCities([]);
      return;
    }

    const cachedNearby = sessionStorage.getItem(
      "skySenseNearbyCities"
    );

    if (cachedNearby) {
      try {
        const parsed = JSON.parse(cachedNearby);
        const cacheAge = Date.now() - parsed.timestamp;

        if (
          cacheAge < 30 * 60 * 1000 &&
          Array.isArray(parsed.data)
        ) {
          setNearbyCities(parsed.data);
          return;
        }
      } catch {
        sessionStorage.removeItem(
          "skySenseNearbyCities"
        );
      }
    }

    nearbyLoadingRef.current = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const nearbyResponse =
            await api.get(
              `/weather/nearby?latitude=${latitude}&longitude=${longitude}`
            );

          const cities =
            nearbyResponse.data?.cities || [];

          const results = [];
          const limitedCities = cities.slice(0, 4);

          for (const city of limitedCities) {
            try {
              const response =
                await api.get(
                  `/weather/coordinates?latitude=${city.lat}&longitude=${city.lon}`
                );

              const weather =
                response.data?.weather?.current;

              results.push({
                city: city.name,
                country:
                  city.country || "India",
                condition:
                  getCondition(
                    weather?.weather_code
                  ),
                temperature:
                  weather?.temperature_2m != null
                    ? convertTemperature(
                      weather.temperature_2m
                    )
                    : "--",
                icon:
                  getWeatherIcon(
                    weather?.weather_code
                  ),
              });
            } catch {
              // Skip city if weather is unavailable
            }
          }

          setNearbyCities(results);

          sessionStorage.setItem(
            "skySenseNearbyCities",
            JSON.stringify({
              timestamp: Date.now(),
              data: results,
            })
          );
        } catch (error) {
          console.error(
            "Nearby cities error:",
            error
          );
          setNearbyCities([]);
        } finally {
          nearbyLoadingRef.current = false;
        }
      },
      (error) => {
        console.error(
          "Location permission error:",
          error
        );
        setNearbyCities([]);
        nearbyLoadingRef.current = false;
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30 * 60 * 1000,
      }
    );
  }
  useEffect(() => {
    loadNearbyCities();
  }, []);

  // -----------------------------
  // SELECTED DAY
  // -----------------------------

  const selectedDay =
    activeTab === "tomorrow" ? 1 : 0;

  const selectedDate =
    daily?.time?.[selectedDay];

  const selectedMaxTemp =
    daily?.temperature_2m_max?.[
    selectedDay
    ];

  const selectedMinTemp =
    daily?.temperature_2m_min?.[
    selectedDay
    ];

  const selectedRain =
    daily
      ?.precipitation_probability_max?.[
    selectedDay
    ];

  const selectedWeatherCode =
    daily?.weather_code?.[
    selectedDay
    ];

  // -----------------------------
  // SHARE WEATHER AS IMAGE
  // -----------------------------

  async function shareWeatherAsImage() {
    if (
      !shareCardRef.current ||
      !data?.weather?.current
    ) {
      return;
    }

    try {
      const canvas =
        await html2canvas(
          shareCardRef.current,
          {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
          }
        );

      const blob =
        await new Promise((resolve) => {
          canvas.toBlob(
            resolve,
            "image/png"
          );
        });

      if (!blob) {
        throw new Error(
          "Unable to create weather image"
        );
      }

      const locationName =
        data.location?.name ||
        "Your Location";

      const file = new File(
        [blob],
        `SkySense-${locationName}.png`,
        {
          type: "image/png",
        }
      );

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          title:
            `Weather in ${locationName}`,

          text:
            "🌤️ Weather from SkySense AI",

          files: [file],
        });

        return;
      }

      const imageUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = imageUrl;

      link.download =
        `SkySense-${locationName}.png`;

      link.click();

      URL.revokeObjectURL(imageUrl);

      alert(
        "Weather image created! The picture has been downloaded."
      );
    } catch (error) {
      if (
        error.name !== "AbortError"
      ) {
        console.error(
          "Weather image sharing failed:",
          error
        );

        alert(
          "Unable to create weather image."
        );
      }
    }
  }

  // -----------------------------
  // OPEN FULL FORECAST
  // -----------------------------

  function openForecast() {
    const params =
      new URLSearchParams();

    if (
      data?.location?.latitude != null &&
      data?.location?.longitude != null
    ) {
      params.set(
        "latitude",
        data.location.latitude
      );

      params.set(
        "longitude",
        data.location.longitude
      );
    }

    if (
      data?.location?.name &&
      data.location.name !==
      "Your Location"
    ) {
      params.set(
        "city",
        data.location.name
      );

      params.set(
        "mode",
        "city"
      );
    } else {
      params.set(
        "mode",
        "location"
      );
    }

    const query =
      params.toString();

    navigate(
      query
        ? `/forecast?${query}`
        : "/forecast"
    );
  }

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <main className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="dashboard-search">

          <span>⌕</span>

          <input
            type="text"
            value={city}
            placeholder="Search for a city..."
            spellCheck="false"
            onChange={(e) =>
              setCity(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
              }
            }}
          />

        </div>

        <div className="dashboard-header-right">

          <button
            type="button"
            className="location-display"
            onClick={locate}
          >
            <span>⌖</span>

            <span>
              {data?.location?.name ||
                "Your Location"}

              {data?.location?.country
                ? `, ${data.location.country}`
                : ""}
            </span>

          </button>

          <button
            type="button"
            className="header-icon-button"
            title="Weather Alerts"
            onClick={() =>
              navigate("/alerts")
            }
          >
            ♧
          </button>

          <button
            type="button"
            className="header-profile"
            onClick={() => navigate("/profile")}
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
              />
            ) : (
              "👤"
            )}
          </button>

        </div>

      </header>

      {/* STATUS */}

      {loading && (
        <div className="dashboard-message">
          Loading weather...
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* TABS */}

      <div className="weather-tabs">

        <button
          type="button"
          className={
            activeTab === "today"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("today")
          }
        >
          Today
        </button>

        <button
          type="button"
          className={
            activeTab === "tomorrow"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("tomorrow")
          }
        >
          Tomorrow
        </button>

        <button
          type="button"
          className={
            activeTab === "next7"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("next7")
          }
        >
          Next 7 days
        </button>

      </div>

      {/* TODAY / TOMORROW BANNER */}

      {data &&
        activeTab !== "next7" && (
          <section className="selected-day-panel">

            <div className="selected-day-info">

              <span className="selected-day-label">
                {activeTab === "today"
                  ? "TODAY"
                  : "TOMORROW"}
              </span>

              <h2>
                {activeTab === "today"
                  ? "Today's Weather"
                  : "Tomorrow's Weather"}
              </h2>

              {selectedDate && (
                <p>
                  {new Date(
                    selectedDate
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              )}

            </div>

            <div className="selected-day-weather">

              <span className="selected-day-icon">
                {getWeatherIcon(
                  selectedWeatherCode
                )}
              </span>

              <div>

                <strong>
                  {convertTemperature(
                    selectedMaxTemp
                  )}
                  °
                </strong>

                <span>
                  /
                  {convertTemperature(
                    selectedMinTemp
                  )}
                  °
                </span>

              </div>

            </div>

            <div className="selected-day-rain">

              <span>💧</span>

              <strong>
                {selectedRain ?? 0}%
              </strong>

              <small>
                Chance of rain
              </small>

            </div>

          </section>
        )}

      {/* NEXT 7 DAYS HEADER */}

      {data &&
        activeTab === "next7" && (
          <section className="next7-banner next7-banner-modern">

            <div>

              <span>
                WEATHER FORECAST
              </span>

              <h2>
                Next 7 Days
              </h2>

              <p>
                View the upcoming weather
                forecast for{" "}
                {data.location?.name}.
              </p>

            </div>

            <div className="next7-banner-action">

              <button
                type="button"
                className="full-forecast-button"
                onClick={openForecast}
              >
                <span className="full-forecast-icon">
                  ▣
                </span>

                <span>
                  Full Forecast
                </span>

                <span className="full-forecast-arrow">
                  →
                </span>
              </button>

              <small>
                Detailed forecast, hourly data and more
              </small>

            </div>

          </section>
        )}

      {/* MAIN CARDS */}

      {data && (
        <section className="dashboard-grid">

          {/* CURRENT WEATHER */}

          <article className="dashboard-card current-weather-card">

            <div className="card-heading">

              <div>

                <span className="card-label">
                  Current Weather
                </span>

                <small>
                  {formatTime()}
                </small>

              </div>

              <button
                type="button"
                className={
                  favorite
                    ? "mini-favorite saved"
                    : "mini-favorite"
                }
                onClick={addFavorite}
                disabled={favoriteLoading}
              >
                {favorite
                  ? "♥"
                  : "♡"}
              </button>

            </div>

            <div className="current-weather-main">

              <div className="large-weather-icon">
                {getWeatherIcon(
                  current?.weather_code
                )}
              </div>

              <div>

                <div className="large-temperature">

                  {convertTemperature(
                    current?.temperature_2m
                  )}

                  <sup>
                    {getTemperatureSymbol()}
                  </sup>

                </div>

                <div className="weather-condition">

                  {current?.condition ||
                    getCondition(
                      current?.weather_code
                    )}

                </div>

                <div className="weather-location">

                  {data.location?.name ||
                    "Your Location"}

                  {data.location?.country
                    ? `, ${data.location.country}`
                    : ""}

                </div>

              </div>

            </div>

            {/* WEATHER DETAILS */}

            <div className="current-weather-details">

              <div>

                <span className="detail-icon">
                  💧
                </span>

                <strong>
                  {current?.relative_humidity_2m ??
                    "--"}
                  %
                </strong>

                <small>
                  Humidity
                </small>

              </div>

              <div>

                <span className="detail-icon">
                  ≋
                </span>

                <strong>

                  {current?.wind_speed_10m != null
                    ? convertWind(
                      current.wind_speed_10m *
                      3.6
                    )
                    : "--"}{" "}

                  {getWindSymbol()}

                </strong>

                <small>
                  Wind
                </small>

              </div>

              <div>

                <span className="detail-icon">
                  ◴
                </span>

                <strong>

                  {convertPressure(
                    current?.surface_pressure
                  )}{" "}

                  {getPressureSymbol()}

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

                  {currentVisibility != null
                    ? Math.round(
                      currentVisibility / 1000
                    )
                    : "--"}{" "}

                  km

                </strong>

                <small>
                  Visibility
                </small>

              </div>

            </div>

            {/* SHARE WEATHER */}

            <button
              type="button"
              className="share-weather-button"
              onClick={
                shareWeatherAsImage
              }
            >
              🔗 Share Weather
            </button>

          </article>

          {/* 7 DAY CARD */}

          <article className="dashboard-card seven-day-card">

            <div className="card-heading">

              <span className="card-title">
                Next 7 Days
              </span>

              <button
                type="button"
                className="view-more-button"
                onClick={openForecast}
              >
                View more →
              </button>

            </div>

            <div className="seven-day-list">

              {daily?.time
                ?.slice(0, 7)
                .map(
                  (date, index) => (

                    <div
                      className={
                        index === 0
                          ? "day-card today"
                          : "day-card"
                      }
                      key={date}
                    >

                      <span className="day-name">
                        {getDayName(
                          date,
                          index
                        )}
                      </span>

                      <span className="day-icon">

                        {getWeatherIcon(
                          daily
                            .weather_code?.[
                          index
                          ]
                        )}

                      </span>

                      <strong>

                        {convertTemperature(
                          daily
                            .temperature_2m_max?.[
                          index
                          ]
                        )}
                        °

                      </strong>

                      <small>

                        {convertTemperature(
                          daily
                            .temperature_2m_min?.[
                          index
                          ]
                        )}
                        °

                      </small>

                    </div>

                  )
                )}

            </div>

          </article>

          {/* RAIN CARD */}

          <article className="dashboard-card rain-card">

            <div className="card-heading">

              <span className="card-title">
                Chance of rain
              </span>

              <span className="rain-percentage">

                {chartData.length
                  ? Math.max(
                    ...chartData.map(
                      (item) =>
                        item.rain
                    )
                  )
                  : 0}

                %

              </span>

            </div>

            <div className="rain-amount-label">

              Rainfall:{" "}
              {convertRain(
                daily
                  ?.precipitation_sum?.[
                0
                ]
              )}{" "}

              {getRainSymbol()}

            </div>

            <div className="rain-chart">

              <div className="rain-y-axis">

                <span>
                  Heavy
                </span>

                <span>
                  Rainy
                </span>

                <span>
                  Humid
                </span>

                <span>
                  Sunny
                </span>

              </div>

              <div className="rain-chart-area">

                <div className="chart-lines">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>

                <div className="rain-bars">

                  {chartData.map(
                    (item, index) => (

                      <div
                        className="rain-bar-column"
                        key={index}
                      >

                        <div className="rain-point">

                          <span
                            style={{
                              height: `${Math.max(
                                8,
                                item.rain
                              )}%`,
                            }}
                          ></span>

                        </div>

                        <small>
                          {item.time}
                        </small>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </article>

        </section>
      )}

      {/* =====================================================
          HOURLY WEATHER
      ===================================================== */}

      {data?.weather?.hourly && (
        <section className="hourly-dashboard-wrapper">

          <TodayHourly
            hourly={
              data.weather.hourly
            }
            current={
              data.weather.current
            }
          />

        </section>
      )}

      {/* =====================================================
          LOWER CARDS
      ===================================================== */}

      {data && (
        <section className="lower-dashboard-grid">

          {/* GLOBAL MAP */}

          <article className="dashboard-card map-card">

            <div className="card-heading">

              <span className="card-title">
                Global Map
              </span>

              <button
                type="button"
                className="map-button"
                onClick={() =>
                  navigate(
                    "/weather-map"
                  )
                }
              >
                View Map →
              </button>

            </div>

            <div className="global-map">

              <div className="map-grid"></div>

              <div className="map-world">
                🌎
              </div>

              <div className="map-marker marker-one">
                ☀️
              </div>

              <div className="map-marker marker-two">
                🌧️
              </div>

              <div className="map-marker marker-three">
                ☁️
              </div>

              <div className="map-marker marker-four">
                🌧️
              </div>

              <div className="map-marker marker-five">
                ☀️
              </div>

            </div>

          </article>

          {/* NEARBY CITIES */}

          <article className="dashboard-card nearby-card">

            <div className="card-heading">

              <span className="card-title">
                Cities close to you
              </span>

              <button
                type="button"
                className="view-more-button"
                onClick={() =>
                  navigate(
                    "/weather-map"
                  )
                }
              >
                See more →
              </button>

            </div>

            <div className="nearby-grid">

              {nearbyCities.map(
                (item) => (

                  <button
                    type="button"
                    className="nearby-city"
                    key={item.city}
                    onClick={() =>
                      search(
                        item.city
                      )
                    }
                  >

                    <div>

                      <small>
                        {item.country}
                      </small>

                      <strong>
                        {item.city}
                      </strong>

                      <span>
                        {item.condition}
                      </span>

                    </div>

                    <div className="nearby-weather">

                      <span>
                        {item.icon}
                      </span>

                      <strong>
                        {item.temperature}°
                      </strong>

                    </div>

                  </button>

                )
              )}

            </div>

          </article>

        </section>
      )}

      {/* SHARE IMAGE CARD */}

      {data && (
        <div
          ref={shareCardRef}
          className="weather-share-card"
        >

          <style>{`
            .weather-share-card{
              position:fixed;
              left:-10000px;
              top:0;
              width:900px;
              height:1200px;
              overflow:hidden;
              border-radius:42px;
              color:#fff;
              font-family:Arial,sans-serif;
              background:linear-gradient(
                180deg,
                #0874c9 0%,
                #35a8df 34%,
                #ffb34d 62%,
                #ef7040 76%,
                #174b70 100%
              );
              box-sizing:border-box;
            }

            .weather-share-card:after{
              content:"";
              position:absolute;
              inset:0;
              background:linear-gradient(
                180deg,
                rgba(0,60,130,.12),
                rgba(255,175,70,.08) 48%,
                rgba(0,30,60,.52)
              );
              pointer-events:none;
            }

            .share-sky-glow{
              position:absolute;
              width:520px;
              height:520px;
              left:190px;
              top:390px;
              border-radius:50%;
              background:radial-gradient(
                circle,
                rgba(255,245,170,.95) 0,
                rgba(255,196,65,.55) 24%,
                rgba(255,130,50,.12) 60%,
                transparent 72%
              );
            }

            .share-sun{
              position:absolute;
              left:125px;
              top:455px;
              font-size:145px;
              filter:drop-shadow(
                0 8px 12px rgba(255,170,0,.35)
              );
              z-index:1;
            }

            .share-cloud{
              position:absolute;
              font-size:135px;
              filter:drop-shadow(
                0 12px 10px rgba(0,50,100,.22)
              );
              z-index:2;
              opacity:.96;
            }

            .share-cloud-one{
              left:490px;
              top:90px;
              font-size:150px;
            }

            .share-cloud-two{
              right:35px;
              top:350px;
              font-size:120px;
              opacity:.8;
            }

            .share-birds{
              position:absolute;
              right:70px;
              top:270px;
              font-size:34px;
              letter-spacing:10px;
              z-index:2;
              opacity:.85;
            }

            .share-horizon{
              position:absolute;
              left:-5%;
              right:-5%;
              bottom:0;
              height:350px;
              background:linear-gradient(
                180deg,
                transparent 0%,
                rgba(7,56,85,.25) 12%,
                rgba(7,43,67,.78) 34%,
                #123c58 100%
              );
              clip-path:polygon(
                0 35%,
                8% 28%,
                16% 33%,
                25% 22%,
                35% 31%,
                44% 18%,
                55% 28%,
                66% 17%,
                75% 29%,
                86% 21%,
                100% 30%,
                100% 100%,
                0 100%
              );
              z-index:0;
            }

            .share-content{
              position:relative;
              z-index:4;
              padding:58px 62px;
              box-sizing:border-box;
              height:100%;
            }

            .share-brand{
              display:flex;
              align-items:center;
              gap:18px;
            }

            .share-logo{
              font-size:58px;
            }

            .share-brand h1{
              margin:0;
              font-size:43px;
              line-height:1;
              font-weight:800;
            }

            .share-brand h1 span{
              color:#55d8ff;
            }

            .share-brand p{
              margin:8px 0 0;
              font-size:18px;
              opacity:.9;
            }

            .share-tagline{
              margin-left:auto;
              text-align:right;
              font-size:18px;
              font-style:italic;
              line-height:1.35;
              opacity:.9;
            }

            .share-location{
              margin-top:58px;
              font-size:36px;
              font-weight:800;
              text-shadow:
                0 3px 8px rgba(0,0,0,.2);
            }

            .share-time{
              font-size:19px;
              margin-top:8px;
              opacity:.9;
            }

            .share-main-weather{
              display:flex;
              align-items:center;
              gap:28px;
              margin-top:38px;
            }

            .share-weather-icon{
              font-size:145px;
              filter:drop-shadow(
                0 10px 10px rgba(0,0,0,.2)
              );
            }

            .share-temperature{
              font-size:94px;
              font-weight:900;
              line-height:.95;
              text-shadow:
                0 4px 10px rgba(0,0,0,.2);
            }

            .share-temperature sup{
              font-size:42px;
              vertical-align:top;
              margin-left:5px;
            }

            .share-condition{
              font-size:31px;
              font-weight:700;
              margin-top:8px;
            }

            .share-feels{
              font-size:20px;
              margin-top:5px;
              opacity:.9;
            }

            .share-details{
              margin-top:35px;
              display:grid;
              grid-template-columns:
                repeat(3,1fr);
              gap:2px;
              padding:18px;
              border-radius:28px;
              background:
                rgba(12,48,78,.63);
              border:
                1px solid
                rgba(255,255,255,.28);
              box-shadow:
                0 12px 30px
                rgba(0,0,0,.18);
              backdrop-filter:blur(8px);
            }

            .share-details>div{
              text-align:center;
              padding:17px 8px;
              border-right:
                1px solid
                rgba(255,255,255,.16);
            }

            .share-details>div:nth-child(3n){
              border-right:0;
            }

            .share-details strong{
              display:block;
              font-size:22px;
            }

            .share-details span{
              display:block;
              font-size:15px;
              margin-top:6px;
              opacity:.78;
            }

            .share-message-box{
              margin-top:26px;
              padding:20px 25px;
              border-radius:22px;
              background:
                rgba(8,42,69,.68);
              border:
                1px solid
                rgba(255,255,255,.25);
              text-align:center;
            }

            .share-message-box strong{
              display:block;
              font-size:22px;
            }

            .share-message-box span{
              display:block;
              margin-top:7px;
              font-size:16px;
              opacity:.85;
            }

            .share-message-box b{
              color:#48d6ff;
            }

            .share-footer{
              position:absolute;
              left:62px;
              right:62px;
              bottom:35px;
              display:flex;
              justify-content:space-between;
              align-items:end;
              font-size:16px;
              opacity:.9;
            }

            .share-footer span:last-child{
              text-align:right;
              font-style:italic;
              line-height:1.35;
            }
          `}</style>

          <div className="share-sky-glow"></div>

          <div className="share-cloud share-cloud-one">
            ☁️
          </div>

          <div className="share-cloud share-cloud-two">
            ☁️
          </div>

          <div className="share-birds">
            ⌁ ︵ ︵
          </div>

          <div className="share-sun">
            ☀️
          </div>

          <div className="share-horizon"></div>

          <div className="share-content">

            <div className="share-brand">

              <div className="share-logo">
                🌤️
              </div>

              <div>

                <h1>
                  SkySense{" "}
                  <span>
                    AI
                  </span>
                </h1>

                <p>
                  Your Personal Weather Assistant
                </p>

              </div>

              <div className="share-tagline">
                Smarter Weather
                <br />
                Brighter Days
              </div>

            </div>

            <div className="share-location">

              📍{" "}
              {data.location?.name ||
                "Your Location"}

              {data.location?.country
                ? `, ${data.location.country}`
                : ""}

            </div>

            <div className="share-time">

              {new Date()
                .toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}

              &nbsp; • &nbsp;

              {new Date()
                .toLocaleTimeString(
                  [],
                  {
                    hour: "numeric",
                    minute: "2-digit",
                  }
                )}

            </div>

            <div className="share-main-weather">

              <div className="share-weather-icon">

                {getWeatherIcon(
                  current?.weather_code
                )}

              </div>

              <div>

                <div className="share-temperature">

                  {convertTemperature(
                    current?.temperature_2m
                  )}

                  <sup>
                    {getTemperatureSymbol()}
                  </sup>

                </div>

                <div className="share-condition">

                  {current?.condition ||
                    getCondition(
                      current?.weather_code
                    )}

                </div>

                <div className="share-feels">

                  Feels like{" "}

                  {convertTemperature(
                    current?.apparent_temperature ??
                    current?.temperature_2m
                  )}

                  {getTemperatureSymbol()}

                </div>

              </div>

            </div>

            <div className="share-details">

              <div>

                <strong>
                  💧{" "}
                  {current?.relative_humidity_2m ??
                    "--"}
                  %
                </strong>

                <span>
                  Humidity
                </span>

              </div>

              <div>

                <strong>

                  💨{" "}

                  {current?.wind_speed_10m != null
                    ? convertWind(
                      current.wind_speed_10m *
                      3.6
                    )
                    : "--"}{" "}

                  {getWindSymbol()}

                </strong>

                <span>
                  Wind Speed
                </span>

              </div>

              <div>

                <strong>

                  ◴{" "}

                  {convertPressure(
                    current?.surface_pressure
                  )}{" "}

                  {getPressureSymbol()}

                </strong>

                <span>
                  Pressure
                </span>

              </div>

              {/* VISIBILITY IN SHARE IMAGE */}

              <div>

                <strong>

                  👁️{" "}

                  {currentVisibility != null
                    ? Math.round(
                      currentVisibility /
                      1000
                    )
                    : "--"}{" "}

                  km

                </strong>

                <span>
                  Visibility
                </span>

              </div>

              <div>

                <strong>

                  🌡️{" "}

                  {convertTemperature(
                    current?.temperature_2m
                  )}

                  {getTemperatureSymbol()}

                </strong>

                <span>
                  Temperature
                </span>

              </div>

              <div>

                <strong>

                  ☀️{" "}

                  {daily?.uv_index_max?.[
                    0
                  ] ?? "--"}

                </strong>

                <span>
                  UV Index
                </span>

              </div>

            </div>

            <div className="share-message-box">

              <strong>
                🌿 Clear skies, brighter days!
              </strong>

              <span>
                Check the weather using{" "}
                <b>
                  SkySense AI
                </b>
              </span>

            </div>

            <div className="share-footer">

              <span>
                ☁️ SkySense AI
              </span>

              <span>
                Weather Brings
                <br />
                People Closer ♡
              </span>

            </div>

          </div>

        </div>
      )}

      {/* AI */}

      {suggestion && (
        <section className="dashboard-card ai-dashboard-card">

          <div className="ai-heading">

            <span>
              🤖
            </span>

            <div>

              <h2>
                SkySense AI
              </h2>

              <p>
                Personalized weather recommendation
              </p>

            </div>

          </div>

          <h3>
            {suggestion.summary}
          </h3>

          <p>
            {suggestion.advice}
          </p>

        </section>
      )}

    </main>
  );
}