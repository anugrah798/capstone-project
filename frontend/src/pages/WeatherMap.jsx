import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import api from "../services/api";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// --------------------------------
// MAP CENTER
// --------------------------------

function MapCenter({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 10);
        }
    }, [position, map]);

    return null;
}


// --------------------------------
// WEATHER MAP
// --------------------------------

export default function WeatherMap() {

    const [position, setPosition] = useState(null);

    const [weather, setWeather] = useState(null);

    const [locationName, setLocationName] =
        useState("Your Location");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchCity, setSearchCity] =
        useState("");

    const [nearbyCities, setNearbyCities] =
        useState([]);


    // --------------------------------
    // LOAD NEARBY CITIES
    // --------------------------------

    async function loadNearbyCities(
        latitude,
        longitude
    ) {
        try {

            const response = await api.get(
                `/weather/nearby?latitude=${latitude}&longitude=${longitude}`
            );

            const cities =
                response.data?.cities || [];

            const results = [];


            // Get weather for each nearby city
            for (const city of cities) {

                try {

                    const weatherResponse =
                        await api.get(
                            `/weather/coordinates?latitude=${city.lat}&longitude=${city.lon}`
                        );

                    const cityWeather =
                        weatherResponse.data
                            ?.weather
                            ?.current;


                    results.push({

                        name: city.name,

                        lat: city.lat,

                        lon: city.lon,

                        temperature:
                            cityWeather?.temperature_2m != null
                                ? Math.round(
                                    cityWeather.temperature_2m
                                )
                                : "--",

                        condition:
                            cityWeather?.condition ||
                            "Unknown",

                        humidity:
                            cityWeather
                                ?.relative_humidity_2m != null
                                ? cityWeather
                                    .relative_humidity_2m
                                : "--",

                        wind:
                            cityWeather
                                ?.wind_speed_10m != null
                                ? Math.round(
                                    cityWeather
                                        .wind_speed_10m * 3.6
                                )
                                : "--",
                    });

                } catch (err) {

                    console.error(
                        `Weather unavailable for ${city.name}`,
                        err
                    );
                }
            }


            setNearbyCities(results);

        } catch (err) {

            console.error(
                "Nearby cities error:",
                err
            );

            setNearbyCities([]);
        }
    }


    // --------------------------------
    // LOAD WEATHER BY COORDINATES
    // --------------------------------

    async function loadWeather(
        latitude,
        longitude
    ) {

        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                `/weather/coordinates?latitude=${latitude}&longitude=${longitude}`
            );


            setWeather(
                response.data.weather
            );


            setPosition([
                latitude,
                longitude,
            ]);


            // Load nearby cities
            await loadNearbyCities(
                latitude,
                longitude
            );


        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to load weather data"
            );

        } finally {

            setLoading(false);
        }
    }


    // --------------------------------
    // SEARCH CITY
    // --------------------------------

    async function searchLocation(e) {

        e.preventDefault();


        if (!searchCity.trim()) {
            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await api.get(
                `/weather/city/${encodeURIComponent(
                    searchCity.trim()
                )}`
            );


            const data = response.data;


            // Update weather
            setWeather(
                data.weather
            );


            // Update map position
            setPosition([
                data.location.latitude,
                data.location.longitude,
            ]);


            // Update city name
            setLocationName(
                data.location.name
            );

            // Load nearby cities around
            // the searched city
            await loadNearbyCities(
                data.location.latitude,
                data.location.longitude
            );


            // Clear search box
            setSearchCity("");


        } catch (err) {

            setError(
                err.response?.data?.message ||
                "City not found"
            );

        } finally {

            setLoading(false);
        }
    }


    // --------------------------------
    // GET CURRENT LOCATION
    // --------------------------------

    useEffect(() => {

        if (!navigator.geolocation) {

            setError(
                "Location access is not supported by your browser."
            );

            setLoading(false);

            return;
        }


        navigator.geolocation.getCurrentPosition(

            async ({ coords }) => {

                await loadWeather(
                    coords.latitude,
                    coords.longitude
                );
            },


            () => {

                setError(
                    "Please allow location access to view the weather map."
                );

                setLoading(false);
            }
        );

    }, []);


    const current =
        weather?.current;


    // --------------------------------
    // UI
    // --------------------------------

    return (

        <main className="container weather-map-page">


            {/* PAGE HEADER */}

            <div className="forecast-page-title">

                <div className="forecast-title-icon">
                    🗺️
                </div>


                <div>

                    <h1>
                        Weather Map
                    </h1>


                    <p>
                        Explore your current location with
                        real-time weather information.
                    </p>

                </div>

            </div>



            {/* CITY SEARCH */}

            <form
                className="weather-map-search"
                onSubmit={searchLocation}
            >

                <input
                    type="text"
                    placeholder="Search for a city..."
                    value={searchCity}
                    onChange={(e) =>
                        setSearchCity(
                            e.target.value
                        )
                    }
                    spellCheck="false"
                />


                <button type="submit">
                    🔍 Search
                </button>

            </form>



            {/* WEATHER SUMMARY */}

            {current && (

                <div className="weather-map-summary">


                    {/* LOCATION */}

                    <div className="weather-map-location">

                        <span>
                            📍
                        </span>


                        <div>

                            <small>
                                YOUR LOCATION
                            </small>


                            <h2>
                                {locationName}
                            </h2>

                        </div>

                    </div>



                    {/* TEMPERATURE */}

                    <div className="weather-map-current">

                        <div className="map-weather-icon">
                            🌤️
                        </div>


                        <div>

                            <strong>

                                {Math.round(
                                    current.temperature_2m
                                )}

                                °C

                            </strong>


                            <span>
                                {current.condition}
                            </span>

                        </div>

                    </div>



                    {/* HUMIDITY */}

                    <div className="map-weather-stat">

                        <span>
                            💧
                        </span>


                        <div>

                            <small>
                                Humidity
                            </small>


                            <strong>

                                {
                                    current.relative_humidity_2m
                                }%

                            </strong>

                        </div>

                    </div>



                    {/* WIND */}

                    <div className="map-weather-stat">

                        <span>
                            💨
                        </span>


                        <div>

                            <small>
                                Wind
                            </small>


                            <strong>

                                {Math.round(
                                    (
                                        current.wind_speed_10m ||
                                        0
                                    ) * 3.6
                                )}

                                {" "}km/h

                            </strong>

                        </div>

                    </div>


                </div>

            )}



            {/* ERROR */}

            {error && (

                <div className="panel">

                    <p className="error">
                        {error}
                    </p>

                </div>

            )}



            {/* MAP */}

            <div className="weather-map-card">


                {loading && (

                    <div className="map-loading">

                        <div className="map-loading-icon">
                            🗺️
                        </div>


                        <h3>
                            Loading Weather Map...
                        </h3>


                        <p>
                            Getting your current location and
                            weather information.
                        </p>

                    </div>

                )}



                {!loading && position && (

                    <MapContainer
                        center={position}
                        zoom={10}
                        scrollWheelZoom={true}
                        className="weather-map"
                    >


                        <MapCenter
                            position={position}
                        />



                        {/* MAP TILES */}

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />



                        {/* MAIN LOCATION */}

                        <Marker
                            position={position}
                        >

                            <Popup>

                                <strong>
                                    📍 {locationName}
                                </strong>


                                {current && (

                                    <>

                                        <br />

                                        🌡️{" "}
                                        {Math.round(
                                            current.temperature_2m
                                        )}
                                        °C


                                        <br />

                                        🌤️{" "}
                                        {current.condition}


                                        <br />

                                        💧{" "}
                                        {
                                            current.relative_humidity_2m
                                        }%
                                        humidity


                                        <br />

                                        💨{" "}
                                        {Math.round(
                                            (
                                                current.wind_speed_10m ||
                                                0
                                            ) * 3.6
                                        )}
                                        km/h

                                    </>

                                )}

                            </Popup>

                        </Marker>



                        {/* NEARBY CITY MARKERS */}

                        {nearbyCities.map(
                            (city) => (

                                <Marker
                                    key={`${city.name}-${city.lat}-${city.lon}`}
                                    position={[
                                        city.lat,
                                        city.lon,
                                    ]}
                                >

                                    <Popup>

                                        <strong>
                                            📍 {city.name}
                                        </strong>


                                        <br />

                                        🌡️{" "}
                                        {city.temperature}°C


                                        <br />

                                        🌤️{" "}
                                        {city.condition}


                                        <br />

                                        💧{" "}
                                        {city.humidity}%
                                        humidity


                                        <br />

                                        💨{" "}
                                        {city.wind}
                                        km/h

                                    </Popup>

                                </Marker>

                            )
                        )}


                    </MapContainer>

                )}

            </div>



            {/* MAP INFO */}

            {position && (

                <div className="map-info-panel">


                    <div>

                        <span>
                            📍
                        </span>


                        <div>

                            <strong>
                                Interactive Weather Map
                            </strong>


                            <p>
                                Drag the map to explore different
                                areas. Use the mouse wheel or map
                                controls to zoom.
                            </p>

                        </div>

                    </div>



                    <div className="map-coordinates">

                        <small>
                            Coordinates
                        </small>


                        <strong>

                            {position[0].toFixed(4)}

                            {", "}

                            {position[1].toFixed(4)}

                        </strong>

                    </div>


                </div>

            )}

        </main>
    );
}