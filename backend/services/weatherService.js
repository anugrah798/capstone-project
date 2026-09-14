function codeToCondition(weather) {
  if (!weather) return "Unknown";

  const main = weather.main?.toLowerCase();

  if (main === "clear") return "Clear Sky";
  if (main === "clouds") return "Cloudy";
  if (main === "rain") return "Rain";
  if (main === "drizzle") return "Drizzle";
  if (main === "thunderstorm") return "Thunderstorm";
  if (main === "snow") return "Snow";

  if (
    main === "mist" ||
    main === "fog" ||
    main === "haze"
  ) {
    return "Fog";
  }

  return weather.description || "Unknown";
}


// --------------------------------------------------
// CITY SEARCH
// --------------------------------------------------

export async function geocode(city) {
  const url =
    `https://api.openweathermap.org/geo/1.0/direct` +
    `?q=${encodeURIComponent(city)}` +
    `&limit=5` +
    `&appid=${process.env.OPENWEATHER_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("OpenWeather geocoding failed");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("Location not found");
  }

  const searchText = city.trim().toLowerCase();

  const exactIndiaResult = data.find(
    (place) =>
      place.name?.toLowerCase() === searchText &&
      place.country === "IN"
  );

  const indiaResult = data.find(
    (place) => place.country === "IN"
  );

  if (exactIndiaResult) return exactIndiaResult;

  if (indiaResult) return indiaResult;

  const exactResult = data.find(
    (place) =>
      place.name?.toLowerCase() === searchText
  );

  return exactResult || data[0];
}


// --------------------------------------------------
// WEATHER BY COORDINATES
// --------------------------------------------------

export async function weatherByCoordinates(
  latitude,
  longitude
) {

  // -----------------------------------------------
  // OPENWEATHER - CURRENT WEATHER
  // -----------------------------------------------

  const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&appid=${process.env.OPENWEATHER_API_KEY}` +
    `&units=metric`;


  // -----------------------------------------------
  // OPENWEATHER - 3 HOUR FORECAST
  // -----------------------------------------------

  const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&appid=${process.env.OPENWEATHER_API_KEY}` +
    `&units=metric`;


  // -----------------------------------------------
  // OPEN-METEO - 7 DAY FORECAST
  // -----------------------------------------------

  const dailyUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max` +
    `&forecast_days=7` +
    `&timezone=auto`;


  // -----------------------------------------------
  // OPEN-METEO - TODAY HOURLY WEATHER
  // -----------------------------------------------

  const hourlyUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,visibility` +
    `&forecast_days=1` +
    `&timezone=auto`;


  // -----------------------------------------------
  // CALL ALL APIs
  // -----------------------------------------------

  const [
    currentResponse,
    forecastResponse,
    dailyResponse,
    hourlyResponse
  ] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl),
    fetch(dailyUrl),
    fetch(hourlyUrl)
  ]);


  // -----------------------------------------------
  // ERROR HANDLING
  // -----------------------------------------------

  if (!currentResponse.ok) {
    const errorText =
      await currentResponse.text();

    throw new Error(
      `OpenWeather error: ${errorText}`
    );
  }


  if (!forecastResponse.ok) {
    const errorText =
      await forecastResponse.text();

    throw new Error(
      `OpenWeather forecast error: ${errorText}`
    );
  }


  if (!dailyResponse.ok) {
    const errorText =
      await dailyResponse.text();

    throw new Error(
      `Daily forecast error: ${errorText}`
    );
  }


  if (!hourlyResponse.ok) {
    const errorText =
      await hourlyResponse.text();

    throw new Error(
      `Hourly forecast error: ${errorText}`
    );
  }


  // -----------------------------------------------
  // CONVERT RESPONSES TO JSON
  // -----------------------------------------------

  const currentData =
    await currentResponse.json();

  const forecastData =
    await forecastResponse.json();

  const dailyData =
    await dailyResponse.json();

  const hourlyData =
    await hourlyResponse.json();


  // -----------------------------------------------
  // CURRENT WEATHER
  // -----------------------------------------------

  const current = {
    temperature_2m:
      currentData.main.temp,

    relative_humidity_2m:
      currentData.main.humidity,

    apparent_temperature:
      currentData.main.feels_like,

    visibility:
      currentData.visibility || 0,

    precipitation:
      currentData.rain?.["1h"] ||
      currentData.snow?.["1h"] ||
      0,

    weather_code:
      currentData.weather?.[0]?.id,

    condition:
      codeToCondition(
        currentData.weather?.[0]
      ),

    cloud_cover:
      currentData.clouds?.all || 0,

    surface_pressure:
      currentData.main.pressure,

    wind_speed_10m:
      currentData.wind.speed,

    wind_direction_10m:
      currentData.wind.deg,

    is_day:
      currentData.sys?.sunrise &&
        currentData.sys?.sunset
        ? Math.floor(Date.now() / 1000) >=
        currentData.sys.sunrise &&
        Math.floor(Date.now() / 1000) <
        currentData.sys.sunset
        : true
  };


  // -----------------------------------------------
  // OPEN-METEO HOURLY DATA
  // -----------------------------------------------

  const hourly = {
    time:
      hourlyData.hourly?.time || [],

    temperature_2m:
      hourlyData.hourly?.temperature_2m || [],

    precipitation_probability:
      hourlyData.hourly
        ?.precipitation_probability || [],

    weather_code:
      hourlyData.hourly?.weather_code || [],

    wind_speed_10m:
      hourlyData.hourly?.wind_speed_10m || [],

    relative_humidity_2m:
      hourlyData.hourly
        ?.relative_humidity_2m || [],

    // ---------------------------------------------
    // VISIBILITY
    // ---------------------------------------------
    visibility:
      hourlyData.hourly?.visibility || []
  };


  // -----------------------------------------------
  // 7 DAY DATA
  // -----------------------------------------------

  const daily = {
    time:
      dailyData.daily?.time || [],

    temperature_2m_max:
      dailyData.daily
        ?.temperature_2m_max || [],

    temperature_2m_min:
      dailyData.daily
        ?.temperature_2m_min || [],

    precipitation_probability_max:
      dailyData.daily
        ?.precipitation_probability_max || [],

    weather_code:
      dailyData.daily
        ?.weather_code || [],

    sunrise:
      dailyData.daily?.sunrise || [],

    sunset:
      dailyData.daily?.sunset || [],

    uv_index_max:
      dailyData.daily?.uv_index_max || []
  };


  // -----------------------------------------------
  // FINAL RESPONSE
  // -----------------------------------------------

  return {
    current,

    hourly,

    daily,

    timezone:
      dailyData.timezone ||
      hourlyData.timezone ||
      forecastData.city?.timezone ||
      0
  };
}


// --------------------------------------------------
// NEARBY CITIES
// --------------------------------------------------

export async function nearbyCities(
  latitude,
  longitude
) {

  const url =
    `https://api.openweathermap.org/geo/1.0/reverse` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&limit=5` +
    `&appid=${process.env.OPENWEATHER_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Nearby cities lookup failed");
  }

  return await response.json();
}


// --------------------------------------------------
// WEATHER ALERTS
// --------------------------------------------------

import WeatherAlert from "../models/WeatherAlert.js";
import User from "../models/User.js";


export async function generateWeatherAlerts(
  userId,
  city,
  weather
) {

  const alerts = [];


  // =========================================
  // GET USER ALERT PREFERENCES
  // =========================================

  const user = await User.findById(userId)
    .select("alertPreferences");

  const preferences =
    user?.alertPreferences || {
      rain: true,
      temperature: true,
      uv: true,
      wind: true,
      thunderstorm: true,
    };


  const current = weather.current || {};
  const daily = weather.daily || {};


  const temperature = Number(
    current.temperature_2m || 0
  );


  /*
   * OpenWeather current wind speed is m/s.
   * Convert it to km/h.
   */

  const windSpeedKmh =
    Number(current.wind_speed_10m || 0) * 3.6;


  const rainProbability = Number(
    daily.precipitation_probability_max?.[0] || 0
  );


  const uvIndex = Number(
    daily.uv_index_max?.[0] || 0
  );


  const condition =
    current.condition?.toLowerCase() || "";


  // =========================================
  // THUNDERSTORM
  // =========================================

  if (
    preferences.thunderstorm &&
    condition.includes("thunder")
  ) {

    alerts.push({

      type: "Thunderstorm Alert",

      message:
        `Thunderstorm conditions are expected in ${city}. ` +
        `Consider staying indoors and avoid unnecessary travel.`,

      severity: "high",

    });
  }


  // =========================================
  // RAIN
  // =========================================

  if (
    preferences.rain &&
    rainProbability >= 60
  ) {

    alerts.push({

      type: "Rain Alert",

      message:
        `There is a ${rainProbability}% chance of rain in ${city}. ` +
        `Carry an umbrella and plan outdoor activities carefully.`,

      severity:
        rainProbability >= 80
          ? "high"
          : "medium",

    });
  }


  // =========================================
  // HIGH TEMPERATURE
  // =========================================

  if (
    preferences.temperature &&
    temperature >= 35
  ) {

    alerts.push({

      type: "High Temperature Alert",

      message:
        `The temperature in ${city} is ${Math.round(
          temperature
        )}°C. Stay hydrated and avoid prolonged exposure to heat.`,

      severity:
        temperature >= 40
          ? "high"
          : "medium",

    });
  }


  // =========================================
  // HIGH UV
  // =========================================

  if (
    preferences.uv &&
    uvIndex >= 8
  ) {

    alerts.push({

      type: "High UV Alert",

      message:
        `The UV index in ${city} is ${Math.round(
          uvIndex
        )}. Use sun protection and avoid prolonged direct sunlight.`,

      severity:
        uvIndex >= 11
          ? "high"
          : "medium",

    });
  }


  // =========================================
  // STRONG WIND
  // =========================================

  if (
    preferences.wind &&
    windSpeedKmh >= 40
  ) {

    alerts.push({

      type: "Strong Wind Alert",

      message:
        `Strong winds of around ${Math.round(
          windSpeedKmh
        )} km/h are expected in ${city}. Take care while travelling outdoors.`,

      severity:
        windSpeedKmh >= 60
          ? "high"
          : "medium",

    });
  }


  // =========================================
  // SAVE ALERTS
  // =========================================

  for (const alertData of alerts) {

    const existingAlert =
      await WeatherAlert.findOne({
        userId,
        city,
        type: alertData.type,
        isRead: false,
      });


    // Prevent duplicate unread alerts

    if (!existingAlert) {

      await WeatherAlert.create({

        userId,

        city,

        type: alertData.type,

        message: alertData.message,

        severity: alertData.severity,

      });

    }
  }


  return alerts;
}