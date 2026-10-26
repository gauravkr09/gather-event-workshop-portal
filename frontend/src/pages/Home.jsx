import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
const categories = [
  "All Categories",
  "Technology",
  "Business",
  "Design",
  "Workshop",
];
export default function Home() {
  const [events, setEvents] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All Categories"),
    [sort, setSort] = useState("earliest");
  useEffect(() => {
    api
      .get("/events")
      .then((r) => setEvents(r.data.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(
    () =>
      events
        .filter(
          (e) =>
            (!search.trim() ||
              e.title.toLowerCase().includes(search.trim().toLowerCase())) &&
            (category === "All Categories" || e.category === category),
        )
        .sort((a, b) =>
          sort === "latest"
            ? new Date(b.date) - new Date(a.date)
            : new Date(a.date) - new Date(b.date),
        ),
    [events, search, category, sort],
  );
  const clear = () => {
    setSearch("");
    setCategory("All Categories");
    setSort("earliest");
  };
  return (
    <>
      <Navbar />
      <main>
        <section className="hero-section">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="eyebrow-line" /> IDEAS COME ALIVE HERE
              </span>
              <h1>
                Find your next
                <br />
                <em>big moment.</em>
              </h1>
              <p>
                Meet curious minds, learn something new, and discover
                experiences that move you forward.
              </p>
              <div className="hero-actions">
                <a
                  href="#events"
                  className="btn btn-dark rounded-pill px-4 py-3"
                >
                  Explore events <FiArrowRight />
                </a>
                <span className="hero-note">
                  Real people. Fresh ideas. Good energy.
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85"
                  alt="People attending a live event"
                />
                <div className="photo-caption">
                  <span className="caption-dot" />
                  <span>
                    <strong>Ideas in good company</strong>
                    <small>Experiences that bring us together</small>
                  </span>
                </div>
              </div>
              <div className="hero-stamp">
                LEARN
                <br />· MEET ·<br />
                GROW
              </div>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>YOUR PEOPLE ARE OUT THERE</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </section>
        <section id="events" className="events-section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE GOOD STUFF</span>
              <h2>
                What's happening<span className="brand-dot">.</span>
              </h2>
              <p>
                Find a room full of inspiration. Your next favourite experience
                starts here.
              </p>
            </div>
            <div className="event-count">
              <strong>{events.length.toString().padStart(2, "0")}</strong>
              <span>CURATED EVENTS</span>
            </div>
          </div>
          <div className="filters-panel">
            <div className="search-box">
              <FiSearch />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by name…"
                aria-label="Search events"
              />
            </div>
            <div className="filter-controls">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort by date"
              >
                <option value="earliest">Earliest first</option>
                <option value="latest">Latest first</option>
              </select>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="alert alert-warning">
              {error}
              <button
                className="btn btn-sm btn-outline-dark ms-3"
                onClick={() => location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState clear={clear} />
          ) : (
            <div className="row g-4">
              {filtered.map((event) => (
                <div className="col-md-6 col-lg-4" key={event._id}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </section>
        <section id="about" className="about-strip">
          <div className="container about-inner">
            <div>
              <span className="eyebrow">MORE THAN A CALENDAR</span>
              <h2>
                Good things happen
                <br />
                when we <em>show up.</em>
              </h2>
            </div>
            <p>
              From hands-on workshops to conversations that spark new ideas,
              find the right place to learn, connect, and do your next thing.
            </p>
            <Link to="/admin" className="about-link">
              Manage events <FiArrowUpRight />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
