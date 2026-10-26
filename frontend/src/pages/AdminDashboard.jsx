import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const blank = {
  title: "",
  category: "Technology",
  description: "",
  date: "",
  time: "10:00",
  venue: "",
  image: "",
  totalSeats: 50,
  status: "Upcoming",
};
export default function AdminDashboard() {
  const [admin, setAdmin] = useState(false),
    [login, setLogin] = useState({ email: "", password: "" }),
    [events, setEvents] = useState([]),
    [stats, setStats] = useState({}),
    [form, setForm] = useState(blank),
    [editing, setEditing] = useState(null),
    [showForm, setShowForm] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const load = async () => {
    try {
      const [s, e] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/events"),
      ]);
      setStats(s.data.data);
      setEvents(e.data.data);
      setAdmin(true);
      setError("");
    } catch (err) {
      if (
        err.message.toLowerCase().includes("log in") ||
        err.message.toLowerCase().includes("session")
      )
        setAdmin(false);
      else setError(err.message);
    }
  };
  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => load())
      .catch(() => setAdmin(false));
  }, []);
  const signIn = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/auth/login", login);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const signOut = async () => {
    await api.post("/auth/logout").catch(() => {});
    setAdmin(false);
    setLogin({ email: "", password: "" });
    setNotice("");
  };
  const startEdit = (e) => {
    setEditing(e._id);
    setForm({ ...e, date: new Date(e.date).toISOString().slice(0, 10) });
    setShowForm(true);
    setError("");
    setNotice("");
  };
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (editing) await api.put(`/events/${editing}`, form);
      else await api.post("/events", form);
      setNotice(
        editing ? "Event updated successfully" : "Event created successfully",
      );
      setShowForm(false);
      setEditing(null);
      setForm(blank);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this event and all its registrations? This cannot be undone.",
      )
    )
      return;
    setError("");
    try {
      await api.delete(`/events/${id}`);
      setNotice("Event deleted successfully");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };
  if (!admin)
    return (
      <>
        <Navbar />
        <main className="admin-login-wrap container">
          <Link to="/" className="back-link">
            <FiArrowLeft /> Public website
          </Link>
          <div className="admin-login-card">
            <span className="eyebrow">GATHER · ADMIN</span>
            <h1>
              Welcome <em>back.</em>
            </h1>
            <p>Sign in to manage events and registrations.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={signIn}>
              <label className="form-label">Admin email</label>
              <input
                type="email"
                className="form-control mb-3"
                value={login.email}
                onChange={(e) => setLogin({ ...login, email: e.target.value })}
                required
              />
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control mb-4"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                required
              />
              <button
                className="btn btn-dark rounded-pill w-100 py-3"
                disabled={busy}
              >
                {busy ? "Signing in…" : "Sign in →"}
              </button>
            </form>
            <small className="d-block text-secondary mt-3">
              Credentials are configured in backend/.env.
            </small>
          </div>
        </main>
        <Footer />
      </>
    );
  const shown = events.filter((e) =>
    e.title.toLowerCase().includes(filter.toLowerCase()),
  );
  return (
    <>
      <Navbar />
      <main className="container admin-page">
        <div className="admin-top">
          <div>
            <span className="eyebrow">YOUR CONTROL ROOM</span>
            <h1>
              Event <em>overview.</em>
            </h1>
            <p>Keep the good stuff happening.</p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark rounded-pill"
              onClick={signOut}
            >
              <FiLogOut /> Log out
            </button>
            <button
              className="btn btn-dark rounded-pill px-4"
              onClick={() => {
                setEditing(null);
                setForm(blank);
                setShowForm(true);
                setError("");
                setNotice("");
              }}
            >
              <FiPlus /> Add event
            </button>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {notice && (
          <div className="alert alert-success">
            {notice}
            <button
              className="btn-close float-end"
              onClick={() => setNotice("")}
            />
          </div>
        )}
        <div className="row g-3 stats-grid">
          {[
            {
              label: "Total events",
              value: stats.totalEvents,
              icon: <FiCalendar />,
            },
            {
              label: "Upcoming events",
              value: stats.upcomingEvents,
              icon: <FiClock />,
            },
            {
              label: "Registrations",
              value: stats.totalRegistrations,
              icon: <FiUsers />,
            },
            {
              label: "Completed",
              value: stats.completedEvents,
              icon: <FiCheckCircle />,
            },
          ].map((s) => (
            <div className="col-6 col-xl-3" key={s.label}>
              <div className="stat-card">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-label">{s.label}</span>
                <strong>{s.value ?? "—"}</strong>
              </div>
            </div>
          ))}
        </div>
        {showForm && (
          <form className="admin-form-card" onSubmit={save}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{editing ? "Edit event" : "Create event"}</h2>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowForm(false)}
              />
            </div>
            <div className="row g-3">
              {[
                ["title", "Event title"],
                ["venue", "Venue"],
                ["date", "Date"],
                ["time", "Time"],
                ["image", "Image URL"],
                ["totalSeats", "Total seats"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    className="form-control"
                    required
                    type={
                      key === "date"
                        ? "date"
                        : key === "time"
                          ? "time"
                          : key === "totalSeats"
                            ? "number"
                            : "text"
                    }
                    min={key === "totalSeats" ? 1 : undefined}
                    value={form[key] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {["Technology", "Business", "Design", "Workshop"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {["Upcoming", "Ongoing", "Completed"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-dark rounded-pill px-4"
                disabled={busy}
              >
                {busy ? "Saving…" : "Save event"}
              </button>
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="management-card">
          <div className="management-heading">
            <div>
              <h2>Manage events</h2>
              <p>Review, update, and keep everything on track.</p>
            </div>
            <input
              className="form-control"
              placeholder="Search events…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Registrations</th>
                  <th>Seats left</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <strong>{e.title}</strong>
                      <small className="d-block text-secondary">
                        {e.venue}
                      </small>
                    </td>
                    <td>{e.category}</td>
                    <td>
                      {new Date(e.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span
                        className={`badge ${e.status === "Completed" ? "text-bg-secondary" : e.status === "Ongoing" ? "text-bg-warning" : "text-bg-success"}`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td>{e.registrationsCount || 0}</td>
                    <td>
                      {Math.max(0, e.totalSeats - (e.registrationsCount || 0))}{" "}
                      / {e.totalSeats}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="icon-btn"
                          title="Edit event"
                          onClick={() => startEdit(e)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="icon-btn danger"
                          title="Delete event"
                          onClick={() => remove(e._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && (
              <p className="text-secondary text-center py-4">
                No events match your search.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
