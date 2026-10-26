import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="empty-state container">
        <div className="empty-icon">404</div>
        <h1>Looks like this page wandered off.</h1>
        <p className="text-secondary">
          The page you're looking for doesn't exist.
        </p>
        <Link className="btn btn-dark rounded-pill px-4" to="/">
          Back to events
        </Link>
      </main>
      <Footer />
    </>
  );
}
