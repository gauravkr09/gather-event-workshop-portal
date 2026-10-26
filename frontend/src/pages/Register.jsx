import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { validateRegistration } from "../utils/validation";
export default function Register() {
  const [params] = useSearchParams(),
    navigate = useNavigate();
  const [events, setEvents] = useState([]),
    [form, setForm] = useState({
      fullName: "",
      email: "",
      contactNumber: "",
      eventId: params.get("eventId") || "",
    }),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [success, setSuccess] = useState(null);
  useEffect(() => {
    api
      .get("/events")
      .then((r) =>
        setEvents(
          r.data.data.filter(
            (e) =>
              e.status !== "Completed" &&
              new Date(e.date) >= new Date() &&
              e.registrationsCount < e.totalSeats,
          ),
        ),
      )
      .catch((e) => setMessage(e.message));
  }, []);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const validation = validateRegistration(form);
    setErrors(validation);
    setMessage("");
    if (Object.keys(validation).length) return;
    setBusy(true);
    try {
      const r = await api.post("/registrations", form);
      setSuccess(r.data.data);
      setMessage(r.data.message);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Navbar />
      <main className="container register-page">
        <Link to="/" className="back-link">
          <FiArrowLeft /> Back to events
        </Link>
        {success ? (
          <div className="success-card">
            <FiCheckCircle className="success-icon" />
            <span className="eyebrow">YOU'RE ON THE LIST</span>
            <h1>You're registered!</h1>
            <p>{message}</p>
            <div className="confirmation-details">
              <strong>{success.event.title}</strong>
              <span>
                {new Date(success.event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {success.event.time}
              </span>
              <span>{success.event.venue}</span>
            </div>
            <button
              className="btn btn-dark rounded-pill px-4 mt-3"
              onClick={() => navigate("/")}
            >
              Explore more events
            </button>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="form-heading">
                <span className="eyebrow">MAKE IT OFFICIAL</span>
                <h1>
                  Save your <em>spot.</em>
                </h1>
                <p>
                  Fill in your details below and get ready for something good.
                </p>
              </div>
              <form className="form-card" onSubmit={submit} noValidate>
                {message && <div className="alert alert-danger">{message}</div>}
                <div className="mb-4">
                  <label className="form-label" htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    name="fullName"
                    value={form.fullName}
                    onChange={change}
                    placeholder="Your full name"
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    value={form.email}
                    onChange={change}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="contactNumber">
                    Contact number
                  </label>
                  <input
                    id="contactNumber"
                    className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={change}
                    placeholder="+91 98765 43210"
                  />
                  {errors.contactNumber && (
                    <div className="invalid-feedback">
                      {errors.contactNumber}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="eventId">
                    Choose an event
                  </label>
                  <select
                    id="eventId"
                    className={`form-select ${errors.eventId ? "is-invalid" : ""}`}
                    name="eventId"
                    value={form.eventId}
                    onChange={change}
                  >
                    <option value="">Select an event</option>
                    {events.map((e) => (
                      <option value={e._id} key={e._id}>
                        {e.title} —{" "}
                        {new Date(e.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </option>
                    ))}
                  </select>
                  {errors.eventId && (
                    <div className="invalid-feedback">{errors.eventId}</div>
                  )}
                </div>
                <button
                  className="btn btn-dark rounded-pill w-100 py-3"
                  disabled={busy}
                >
                  {busy ? "Submitting…" : "Confirm registration →"}
                </button>
                <p className="privacy-note">
                  Your details are used only to manage this event registration.
                </p>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
