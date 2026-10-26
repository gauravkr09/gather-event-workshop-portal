import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((r) => setEvent(r.data.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  return (
    <>
      <Navbar />
      <main className="container detail-page">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="empty-state">
            <h2>Event unavailable</h2>
            <p>{error}</p>
            <Link className="btn btn-dark rounded-pill" to="/">
              Back to events
            </Link>
          </div>
        ) : (
          <>
            <Link to="/" className="back-link">
              <FiArrowLeft /> All events
            </Link>
            <div className="detail-hero">
              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                }
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80")
                }
                alt={event.title}
              />
            </div>
            <div className="row g-5 mt-1">
              <div className="col-lg-8">
                <span className="category-pill static-pill">
                  {event.category}
                </span>
                <h1 className="detail-title">{event.title}</h1>
                <p className="detail-description">{event.description}</p>
                <div className="detail-info-grid">
                  <div>
                    <FiCalendar />
                    <span>
                      <small>DATE</small>
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <FiClock />
                    <span>
                      <small>TIME</small>
                      {event.time}
                    </span>
                  </div>
                  <div>
                    <FiMapPin />
                    <span>
                      <small>LOCATION</small>
                      {event.venue}
                    </span>
                  </div>
                  <div>
                    <FiUsers />
                    <span>
                      <small>AVAILABILITY</small>
                      {Math.max(
                        0,
                        event.totalSeats - event.registrationsCount,
                      )}{" "}
                      of {event.totalSeats} seats
                    </span>
                  </div>
                </div>
              </div>
              <aside className="col-lg-4">
                <div className="register-panel">
                  <span className="eyebrow">SAVE YOUR SPOT</span>
                  <h3>Be part of it.</h3>
                  <p>Come curious. Leave inspired.</p>
                  {event.status === "Completed" ||
                  new Date(event.date) < new Date() ? (
                    <div className="alert alert-secondary">
                      Registration is closed for this event.
                    </div>
                  ) : event.totalSeats <= event.registrationsCount ? (
                    <div className="alert alert-warning">
                      This event is fully booked.
                    </div>
                  ) : (
                    <Link
                      to={`/register?eventId=${event._id}`}
                      className="btn btn-dark rounded-pill w-100 py-3"
                    >
                      Register for event <span>→</span>
                    </Link>
                  )}
                  <small className="d-block text-secondary mt-3">
                    No payment required to register.
                  </small>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
