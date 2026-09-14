import { useEffect, useState } from "react";
import api from "../services/api";

export default function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({
    city: "",
    title: "",
    message: "",
    severity: "warning",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const [a, b, c] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/alerts"),
      ]);

      setStats(a.data.stats || {});
      setUsers(b.data.users || []);
      setAlerts(c.data.alerts || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteUser(id) {
    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete user."
      );
    }
  }

  async function createAlert(e) {
    e.preventDefault();

    try {
      await api.post("/admin/alerts", form);

      setForm({
        city: "",
        title: "",
        message: "",
        severity: "warning",
      });

      load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create alert."
      );
    }
  }

  async function deleteAlert(id) {
    try {
      await api.delete(`/admin/alerts/${id}`);
      load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete alert."
      );
    }
  }

  return (
    <main className="container admin-page">

      {/* HEADER */}

      <div className="admin-header">
        <div className="admin-header-icon">
          🛠️
        </div>

        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage users, monitor the system and
            publish weather alerts.
          </p>
        </div>
      </div>


      {/* ERROR */}

      {error && (
        <div className="panel">
          <p className="error">{error}</p>
        </div>
      )}


      {/* STATISTICS */}

      {!loading && (
        <section className="admin-stats">

          {Object.entries(stats).map(
            ([key, value]) => (
              <div
                className="admin-stat-card"
                key={key}
              >
                <span>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) =>
                      str.toUpperCase()
                    )}
                </span>

                <strong>{value}</strong>
              </div>
            )
          )}

        </section>
      )}


      {/* USERS */}

      <section className="panel admin-section">

        <div className="admin-section-heading">
          <div>
            <h2>👥 Manage Users</h2>
            <p>
              View and manage registered users.
            </p>
          </div>

          <span className="admin-count">
            {users.length} Users
          </span>
        </div>


        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-list">

            {users.map((user) => (
              <div
                className="admin-row"
                key={user._id}
              >

                <div className="admin-user-info">

                  <div className="admin-avatar">
                    {user.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <strong>
                      {user.name}
                    </strong>

                    <small>
                      {user.email}
                    </small>
                  </div>

                </div>

                <div className="admin-user-actions">

                  <span
                    className={
                      user.role === "admin"
                        ? "admin-role admin-role-admin"
                        : "admin-role"
                    }
                  >
                    {user.role}
                  </span>

                  {user.role !== "admin" && (
                    <button
                      className="danger"
                      onClick={() =>
                        deleteUser(user._id)
                      }
                    >
                      Delete
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </section>


      {/* CREATE ALERT */}

      <section className="panel admin-section">

        <div className="admin-section-heading">
          <div>
            <h2>🔔 Create Weather Alert</h2>

            <p>
              Publish an important weather
              notification for users.
            </p>
          </div>
        </div>


        <form
          className="admin-alert-form"
          onSubmit={createAlert}
        >

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Alert title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Alert message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            required
          />

          <select
            value={form.severity}
            onChange={(e) =>
              setForm({
                ...form,
                severity: e.target.value,
              })
            }
          >
            <option value="warning">
              Warning
            </option>

            <option value="danger">
              Danger
            </option>

            <option value="info">
              Information
            </option>
          </select>

          <button
            className="primary"
            type="submit"
          >
            Create Alert
          </button>

        </form>

      </section>


      {/* ALERTS */}

      <section className="panel admin-section">

        <div className="admin-section-heading">

          <div>
            <h2>📢 Published Alerts</h2>

            <p>
              Manage weather alerts created by
              administrators.
            </p>
          </div>

          <span className="admin-count">
            {alerts.length} Alerts
          </span>

        </div>


        {alerts.length === 0 ? (
          <p>No alerts available.</p>
        ) : (
          <div className="admin-list">

            {alerts.map((alert) => (
              <div
                className="admin-row"
                key={alert._id}
              >

                <div>

                  <strong>
                    {alert.city}:{" "}
                    {alert.title}
                  </strong>

                  <small>
                    {alert.message}
                  </small>

                </div>

                <button
                  className="danger"
                  onClick={() =>
                    deleteAlert(alert._id)
                  }
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}