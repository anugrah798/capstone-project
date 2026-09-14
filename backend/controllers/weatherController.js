import {
  geocode,
  weatherByCoordinates,
  generateWeatherAlerts,
  nearbyCities
} from "../services/weatherService.js";

import SearchHistory from "../models/SearchHistory.js";


// =====================================================
// ADD CURRENT VISIBILITY FROM HOURLY WEATHER DATA
// =====================================================

function addCurrentVisibility(weather) {
  if (
    !weather?.current ||
    !weather?.hourly?.time ||
    !weather?.hourly?.visibility
  ) {
    return weather;
  }

  const currentTime = weather.current.time;

  if (!currentTime) {
    return weather;
  }

  const currentHour = String(currentTime).slice(0, 13);

  // Find the hourly value matching the current hour
  let index = weather.hourly.time.findIndex(
    (time) =>
      String(time).slice(0, 13) === currentHour
  );

  // Fallback: find the closest hourly time
  if (index === -1) {
    const currentMs = new Date(currentTime).getTime();

    let closestDifference = Infinity;
    let closestIndex = -1;

    weather.hourly.time.forEach(
      (time, i) => {
        const timeMs = new Date(time).getTime();

        const difference = Math.abs(
          timeMs - currentMs
        );

        if (difference < closestDifference) {
          closestDifference = difference;
          closestIndex = i;
        }
      }
    );

    index = closestIndex;
  }

  if (
    index >= 0 &&
    weather.hourly.visibility?.[index] != null
  ) {
    weather.current.visibility =
      weather.hourly.visibility[index];
  }

  return weather;
}


// =====================================================
// GET WEATHER BY CITY
// =====================================================

export async function getWeather(req, res) {
  try {
    const place = await geocode(req.params.city);

    let weather = await weatherByCoordinates(
      place.lat,
      place.lon
    );

    // Add current visibility
    weather = addCurrentVisibility(weather);


    // ================================
    // AUTOMATIC WEATHER ALERTS
    // ================================

    if (req.user) {
      await generateWeatherAlerts(
        req.user._id,
        place.name,
        weather
      );
    }


    // ================================
    // SEARCH HISTORY
    // ================================

    if (req.user) {
      await SearchHistory.create({
        userId: req.user._id,

        city: place.name,

        temperature:
          weather.current.temperature_2m,

        condition:
          weather.current.condition,

        humidity:
          weather.current.relative_humidity_2m,

        windSpeed:
          Math.round(
            (weather.current.wind_speed_10m || 0) * 3.6
          ),

        rainProbability:
          weather.daily
            ?.precipitation_probability_max?.[0] || 0,
      });
    }


    // ================================
    // RESPONSE
    // ================================

    res.json({
      location: {
        name: place.name,
        country: place.country,
        latitude: place.lat,
        longitude: place.lon,
      },

      weather,
    });

  } catch (e) {
    console.error(
      "Weather error:",
      e
    );

    res.status(400).json({
      message: e.message,
    });
  }
}


// =====================================================
// GET WEATHER BY COORDINATES
// =====================================================

export async function getWeatherByCoordinates(
  req,
  res
) {
  try {
    const {
      latitude,
      longitude
    } = req.query;


    if (!latitude || !longitude) {
      return res.status(400).json({
        message:
          "Latitude and longitude are required"
      });
    }


    let weather =
      await weatherByCoordinates(
        latitude,
        longitude
      );


    // Add current visibility
    weather = addCurrentVisibility(weather);


    res.json({
      weather
    });

  } catch (e) {
    console.error(
      "Coordinate weather error:",
      e
    );

    res.status(400).json({
      message: e.message
    });
  }
}


// =====================================================
// GET NEARBY CITIES
// =====================================================

export async function getNearbyCities(
  req,
  res
) {
  try {
    const {
      latitude,
      longitude
    } = req.query;


    if (!latitude || !longitude) {
      return res.status(400).json({
        message:
          "Latitude and longitude are required"
      });
    }


    const cities =
      await nearbyCities(
        latitude,
        longitude
      );


    res.json({
      cities
    });

  } catch (e) {
    console.error(
      "Nearby cities error:",
      e
    );

    res.status(400).json({
      message: e.message
    });
  }
}