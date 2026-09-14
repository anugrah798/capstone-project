export default function About() {
  const features = [
    "Authentication & Authorization",
    "Current + GPS Weather",
    "Hourly & 7-Day Forecast",
    "Favorites & Search History",
    "AI Recommendations",
    "AI Weather Assistant",
    "Weather Alerts",
    "Admin Dashboard",
    "Responsive Design",
  ];

  return (
    <main className="container">
      <section className="hero">
        <p className="badge">MAIN PROJECT</p>

        <h1>About SkySense AI</h1>

        <p>
          SkySense AI is a full-stack intelligent weather monitoring platform
          that provides real-time weather information, forecasts, personalized
          recommendations, alerts, and AI-powered weather assistance.
        </p>
      </section>

      <div className="feature-grid">
        {features.map((feature) => (
          <div className="feature" key={feature}>
            <h3>{feature}</h3>
            <p>
              A dedicated module of the SkySense AI weather monitoring system.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}