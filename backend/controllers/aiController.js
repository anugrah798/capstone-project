function makeSuggestion(w) {
  const temp = w?.current?.temperature_2m ?? 25;
  const humidity = w?.current?.relative_humidity_2m ?? 50;
  const rain = w?.daily?.precipitation_probability_max?.[0] ?? 0;
  const condition = w?.current?.condition ?? "current weather";

  const tips = [];
  if (rain >= 60) tips.push("Carry an umbrella because rain is likely.");
  if (temp >= 32) tips.push("Wear light clothing, drink enough water and avoid prolonged afternoon heat.");
  else if (temp <= 18) tips.push("Consider wearing warm clothing.");
  else tips.push("Light, comfortable clothing should be suitable.");

  if (humidity >= 80) tips.push("Humidity is high, so outdoor exercise may feel uncomfortable.");
  if (condition.toLowerCase().includes("thunder")) tips.push("Avoid exposed outdoor areas during thunderstorms.");

  return {
    summary: `Today's weather is ${condition.toLowerCase()} with a temperature of ${temp}°C.`,
    advice: tips.join(" ")
  };
}

export async function suggestion(req, res) {
  res.json({ suggestion: makeSuggestion(req.body.weather) });
}

export async function chat(req, res) {
  const question = String(
    req.body.question || ""
  )
    .trim()
    .toLowerCase();

  const w = req.body.weather;

  const temp =
    w?.current?.temperature_2m ??
    "unavailable";

  const humidity =
    w?.current?.relative_humidity_2m ??
    "unavailable";

  const wind =
    w?.current?.wind_speed_10m ??
    "unavailable";

  const condition =
    w?.current?.condition ??
    "unavailable";

  const rain =
    w?.daily?.precipitation_probability_max?.[0] ??
    "unavailable";


  let answer;


  // ---------------------------------------------
  // GREETING
  // ---------------------------------------------

  if (
    question.includes("hello") ||
    question === "hi" ||
    question === "hey" ||
    question.includes("good morning") ||
    question.includes("good afternoon") ||
    question.includes("good evening")
  ) {
    answer =
      "Hello! 👋 I'm SkySense AI. I can help you understand the current weather and plan your day.";
  }


  // ---------------------------------------------
  // HOW ARE YOU
  // ---------------------------------------------

  else if (
    question.includes("how are you") ||
    question.includes("how r u")
  ) {
    answer =
      "I'm doing great! 🤖 I'm ready to help you with the weather.";
  }


  // ---------------------------------------------
  // TEMPERATURE
  // ---------------------------------------------

  else if (
    question.includes("temperature") ||
    question.includes("temp") ||
    question.includes("hot") ||
    question.includes("cold")
  ) {
    answer =
      `The current temperature is ${temp}°C and the weather is ${condition.toLowerCase()}.`;
  }


  // ---------------------------------------------
  // HUMIDITY
  // ---------------------------------------------

  else if (
    question.includes("humidity") ||
    question.includes("humid")
  ) {
    answer =
      `The current humidity is ${humidity}%.`;
  }


  // ---------------------------------------------
  // WIND
  // ---------------------------------------------

  else if (
    question.includes("wind") ||
    question.includes("windy")
  ) {
    answer =
      `The current wind speed is ${wind} km/h.`;
  }


  // ---------------------------------------------
  // RAIN
  // ---------------------------------------------

  else if (
    question.includes("rain") ||
    question.includes("umbrella")
  ) {
    if (rain >= 60) {
      answer =
        `Rain is quite likely today, with a ${rain}% maximum probability. ☔ Carrying an umbrella would be a good idea.`;
    } else if (rain >= 30) {
      answer =
        `There is a moderate chance of rain today, around ${rain}%. Carrying an umbrella would be a good precaution.`;
    } else {
      answer =
        `The chance of rain is relatively low today, around ${rain}%. An umbrella may not be necessary.`;
    }
  }


  // ---------------------------------------------
  // CLOTHING
  // ---------------------------------------------

  else if (
    question.includes("wear") ||
    question.includes("clothes") ||
    question.includes("dress")
  ) {
    if (temp >= 32) {
      answer =
        "Light, breathable cotton clothing would be comfortable. Stay hydrated and avoid prolonged exposure to the afternoon heat.";
    } else if (temp <= 18) {
      answer =
        "Warm clothing would be suitable because the temperature is relatively low.";
    } else {
      answer =
        "Light, comfortable clothing should be suitable for the current weather.";
    }
  }


  // ---------------------------------------------
  // OUTDOOR / TRAVEL
  // ---------------------------------------------

  else if (
    question.includes("outside") ||
    question.includes("outdoor") ||
    question.includes("travel") ||
    question.includes("go out")
  ) {
    if (rain >= 60) {
      answer =
        `Outdoor activities are possible, but rain has a ${rain}% probability. Carry an umbrella and keep your plans flexible.`;
    } else {
      answer =
        "The weather looks reasonably suitable for outdoor activities. You can plan your activities, but keep an eye on the forecast.";
    }
  }


  // ---------------------------------------------
  // WEATHER / CONDITION
  // ---------------------------------------------

  else if (
    question.includes("weather") ||
    question.includes("condition")
  ) {
    answer =
      `The current weather is ${condition.toLowerCase()} with a temperature of ${temp}°C, humidity of ${humidity}%, and wind speed of ${wind} km/h.`;
  }


  // ---------------------------------------------
  // DEFAULT
  // ---------------------------------------------

  else {
    answer =
      `The current weather is ${condition.toLowerCase()} at ${temp}°C. You can ask me about temperature, rain, humidity, wind, clothing, travel, or outdoor activities.`;
  }


  res.json({
    answer,
  });
}