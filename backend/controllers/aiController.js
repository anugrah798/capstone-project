import { InferenceClient } from "@huggingface/inference";
const hf = new InferenceClient(process.env.HF_TOKEN);


// --------------------------------------------------
// RULE-BASED AI SUGGESTION
// --------------------------------------------------

function makeSuggestion(w) {
  const temp =
    w?.current?.temperature_2m ?? 25;

  const humidity =
    w?.current?.relative_humidity_2m ?? 50;

  const rain =
    w?.daily?.precipitation_probability_max?.[0] ?? 0;

  const condition =
    w?.current?.condition ?? "current weather";

  const tips = [];

  if (rain >= 60) {
    tips.push(
      "Carry an umbrella because rain is likely."
    );
  }

  if (temp >= 32) {
    tips.push(
      "Wear light clothing, drink enough water and avoid prolonged afternoon heat."
    );
  } else if (temp <= 18) {
    tips.push(
      "Consider wearing warm clothing."
    );
  } else {
    tips.push(
      "Light, comfortable clothing should be suitable."
    );
  }

  if (humidity >= 80) {
    tips.push(
      "Humidity is high, so outdoor exercise may feel uncomfortable."
    );
  }

  if (
    condition
      .toLowerCase()
      .includes("thunder")
  ) {
    tips.push(
      "Avoid exposed outdoor areas during thunderstorms."
    );
  }

  return {
    summary:
      `Today's weather is ${condition.toLowerCase()} ` +
      `with a temperature of ${temp}°C.`,

    advice: tips.join(" "),
  };
}


// --------------------------------------------------
// WEATHER SUGGESTION
// --------------------------------------------------

export async function suggestion(req, res) {
  try {
    const result = makeSuggestion(
      req.body.weather
    );

    res.json({
      suggestion: result,
    });
  } catch (error) {
    console.error(
      "AI suggestion error:",
      error
    );

    res.status(500).json({
      message: "Unable to generate suggestion",
    });
  }
}


// --------------------------------------------------
// HUGGING FACE AI CHAT
// --------------------------------------------------

export async function chat(req, res) {
  try {
    const question =
      String(req.body.question || "").trim();

    const w = req.body.weather;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

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
      w?.daily
        ?.precipitation_probability_max?.[0] ??
      "unavailable";


    const prompt = `
You are SkySense AI, an intelligent weather assistant.

Answer the user's question using the current weather information below.

Current weather:
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Wind speed: ${wind} km/h
- Condition: ${condition}
- Rain probability: ${rain}%

User question:
${question}

Rules:
- Give a clear and useful answer.
- Keep the answer concise.
- Use the weather information when relevant.
- Do not invent weather values.
- If the question is unrelated to weather, politely say that you mainly help with weather-related questions.
`;


    const result =
      await hf.chatCompletion({
        model:
          "openai/gpt-oss-120b:fastest",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        max_tokens: 300,
        temperature: 0.5,
      });


    const answer =
      result?.choices?.[0]?.message?.content?.trim();


    if (!answer) {
      return res.status(500).json({
        message:
          "AI did not return a response",
      });
    }


    res.json({
      answer,
    });

  } catch (error) {

    console.error(
      "Hugging Face AI error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to get AI response",
    });
  }
}

