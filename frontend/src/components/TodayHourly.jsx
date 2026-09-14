import { useEffect, useRef } from "react";

function formatTime(time) {
    const hour = Number(time.substring(11, 13));

    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";

    if (hour < 12) {
        return `${hour} AM`;
    }

    return `${hour - 12} PM`;
}

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

export default function TodayHourly({ hourly, current }) {
    const scrollRef = useRef(null);

    if (!hourly?.time?.length) {
        return null;
    }

    // Current local hour
    const currentHour = new Date().getHours();

    // Create all 24 cards
    const cards = hourly.time.map((time, index) => {
        const hour = Number(time.substring(11, 13));

        return {
            time,
            hour,

            temperature:
                hourly.temperature_2m?.[index] ?? 0,

            rain:
                hourly.precipitation_probability?.[index] ?? 0,

            weatherCode:
                hourly.weather_code?.[index],

            wind:
                hourly.wind_speed_10m?.[index] ?? 0,

            humidity:
                hourly.relative_humidity_2m?.[index] ?? 0,

            isNow: hour === currentHour,
        };
    });

    // Find current card
    const nowIndex = cards.findIndex(
        (item) => item.isNow
    );

    // ------------------------------------------------
    // IMPORTANT:
    // Put the scroll exactly on NOW when opening
    // ------------------------------------------------

    useEffect(() => {
        if (!scrollRef.current) return;

        if (nowIndex === -1) return;

        const container = scrollRef.current;

        const nowCard = container.querySelector(
            ".hourly-card.now"
        );

        if (!nowCard) return;

        // Wait until cards are completely rendered
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                nowCard.scrollIntoView({
                    behavior: "auto",
                    block: "nearest",
                    inline: "start",
                });
            });
        });
    }, [hourly, nowIndex]);

    // Left arrow
    function scrollLeft() {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: -500,
            behavior: "smooth",
        });
    }

    // Right arrow
    function scrollRight() {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: 500,
            behavior: "smooth",
        });
    }

    return (
        <section className="hourly-dashboard-wrapper">

            <div className="hourly-section">

                <h2>Hourly Weather</h2>

                <p>TODAY</p>

                {/* ARROWS */}

                <div className="hourly-controls">

                    <button
                        type="button"
                        onClick={scrollLeft}
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        onClick={scrollRight}
                    >
                        →
                    </button>

                </div>

                {/* HOURLY CARDS */}

                <div
                    className="hourly-scroll"
                    ref={scrollRef}
                >

                    {cards.map((item) => (

                        <div
                            key={item.time}
                            className={
                                item.isNow
                                    ? "hourly-card now"
                                    : "hourly-card"
                            }
                        >

                            {/* TIME */}

                            <span className="hour-time">

                                {item.isNow
                                    ? "Now"
                                    : formatTime(item.time)}

                            </span>

                            {/* ICON */}

                            <div className="hour-icon">

                                {getWeatherIcon(
                                    item.weatherCode
                                )}

                            </div>

                            {/* TEMPERATURE */}

                            <div className="hour-temperature">

                                {item.isNow && current
                                    ? `${Math.round(
                                        current.temperature_2m
                                    )}°C`
                                    : `${Math.round(
                                        item.temperature
                                    )}°C`}

                            </div>

                            {/* RAIN */}

                            <div className="hour-rain">

                                Rain {item.rain}%

                            </div>

                            {/* DETAILS */}

                            <div className="hour-details">

                                <span>
                                    💧{" "}
                                    {item.isNow && current
                                        ? `${current.relative_humidity_2m}%`
                                        : `${item.humidity}%`}
                                </span>

                                <span>
                                    💨{" "}
                                    {item.isNow && current
                                        ? `${Math.round(
                                            current.wind_speed_10m * 3.6
                                        )} km/h`
                                        : `${Math.round(
                                            item.wind
                                        )} km/h`}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}