// src/Componantas/QuoteSave.jsx
import React, { useEffect, useState } from "react";
import css from "./QuoteSave.module.css";
import { MdDelete } from "react-icons/md";
import Buttons from "./Buttons";
import { isLoggedIn, authFetch } from "../auth";

const QuoteSave = ({ setRed, requestAuth }) => {
  const [quoteList, setQuoteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showButtonsIndex, setShowButtonsIndex] = useState(null);

  const fetchSaved = async () => {
    if (!isLoggedIn()) {
      if (typeof requestAuth === "function") requestAuth();
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/quotes");
      if (!res.ok) throw new Error("Failed to load saved quotes");
      const data = await res.json();
      setQuoteList(data || []);
    } catch (err) {
      console.error("Fetch saved error:", err);
      setQuoteList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
    const onUpdate = () => fetchSaved();
    window.addEventListener("quotesUpdated", onUpdate);
    return () => window.removeEventListener("quotesUpdated", onUpdate);
  }, []);

  const handleDelete = async (id, quoteText) => {
    if (!window.confirm("Delete this quote?")) return;
    if (!isLoggedIn()) {
      if (typeof requestAuth === "function") requestAuth();
      return;
    }

    try {
      const res = await authFetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setQuoteList((prev) => prev.filter((q) => q._id !== id));
      if (quoteText) {
        window.dispatchEvent(
          new CustomEvent("quoteDeleted", { detail: { qoute: quoteText, id } })
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete quote. Try again.");
    }
  };

  const toggleShare = (index) =>
    setShowButtonsIndex((prev) => (prev === index ? null : index));

  return (
    <div className={`p-3 ${css.savedQuotesContainer}`}>
      <h2 style={{ textAlign: "center" }}>Saved Quotes</h2>

      {loading ? (
        <p>Loading saved quotes...</p>
      ) : quoteList.length === 0 ? (
        <p>No saved quotes yet.</p>
      ) : (
        <ul className={css.quoteGrid}>
          {quoteList.map((item, index) => (
            <li key={item._id} className={css.savedQuote}>
              <div className={css.quoteBody} aria-live="polite">
                <blockquote>
                  <strong>&quot;{item.qoute}&quot;</strong>
                </blockquote>
                <div className={css.meta}>— {item.author}</div>
              </div>

              <div className={css.buttonContainer}>
                <button
                  className={css.deleteButton}
                  title="Delete"
                  aria-label="Delete quote"
                  onClick={() => handleDelete(item._id, item.qoute)}
                >
                  <MdDelete />
                </button>

                {showButtonsIndex === index ? (
                  <Buttons qoute={item.qoute} author={item.author} />
                ) : (
                  <button
                    className={css.shareButton}
                    title="Share"
                    aria-label={`Share quote ${index + 1}`}
                    onClick={() => toggleShare(index)}
                  >
                    Share
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuoteSave;
