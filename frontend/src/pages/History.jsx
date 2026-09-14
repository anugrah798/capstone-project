import { useEffect, useState } from "react";
import api from "../services/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  async function load() {
    try {
      const { data } = await api.get("/history");
      setItems(data.history || []);
    } catch (error) {
      console.error("Failed to load history", error);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function clear() {
    try {
      await api.delete("/history");
      setVisibleCount(5);
      await load();
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  }

  async function deleteOne(id) {
    try {
      await api.delete(`/history/${id}`);

      setItems((prev) =>
        prev.filter((item) => item._id !== id)
      );

      setVisibleCount((prev) =>
        Math.min(prev, Math.max(items.length - 1, 5))
      );
    } catch (error) {
      console.error("Failed to delete history item", error);
    }
  }

  const visibleItems = items.slice(0, visibleCount);

  function handleShowMore() {
    setVisibleCount((prev) => prev + 5);
  }

  function handleShowLess() {
    setVisibleCount(5);
  }

  return (
    <main className="container">

      <div className="title-row">
        <h1>🕐 Search History</h1>

        {items.length > 0 && (
          <button
            className="secondary"
            onClick={clear}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="table-wrap">

        <table>

          <thead>
            <tr>
              <th>City</th>
              <th>Temperature</th>
              <th>Condition</th>
              <th>Humidity</th>
              <th>Wind</th>
              <th>Rain</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {visibleItems.map((item) => (
              <tr key={item._id}>

                <td>
                  {item.city}
                </td>

                <td>
                  {item.temperature}°C
                </td>

                <td>
                  {item.condition}
                </td>

                <td>
                  {item.humidity}%
                </td>

                <td>
                  {item.windSpeed} km/h
                </td>

                <td>
                  {item.rainProbability}%
                </td>

                <td>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </td>

                <td>
                  <button
                    className="danger"
                    onClick={() =>
                      deleteOne(item._id)
                    }
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {items.length > 5 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "22px",
          }}
        >

          {visibleCount < items.length ? (

            <button
              className="secondary"
              onClick={handleShowMore}
            >
              Show More ↓
            </button>

          ) : (

            <button
              className="secondary"
              onClick={handleShowLess}
            >
              Show Less ↑
            </button>

          )}

        </div>
      )}

    </main>
  );
}