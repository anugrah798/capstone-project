import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nav = useNavigate();

  async function load() {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/favorites");
      setItems(data.favorites || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load favorite locations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    try {
      await api.delete(`/favorites/${id}`);

      setItems((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to remove favorite."
      );
    }
  }

  function viewCity(city) {
    nav(`/?city=${encodeURIComponent(city)}`);
  }

  return (
    <main className="container">

      <div className="title-row">
        <h1>❤️ Favorite Locations</h1>
      </div>

      {loading && (
        <p>Loading your favorite locations...</p>
      )}

      {error && (
        <p
          style={{
            color: "#ff6b6b",
            marginTop: "15px",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !items.length && !error && (
        <div className="panel">
          <h2>No Favorite Locations Yet ❤️</h2>
          <p>
            Search for a city and add it to your
            favorites to see it here.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="list-grid">

          {items.map((item) => (
            <div
              className="list-card"
              key={item._id}
            >

              <h3>
                📍 {item.city}
              </h3>

              <p>
                {item.country || "Saved location"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >

                <button
                  className="secondary"
                  onClick={() =>
                    viewCity(item.city)
                  }
                >
                  View Weather
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    remove(item._id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}