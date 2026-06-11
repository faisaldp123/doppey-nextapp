"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import styles from "../../styles/Searchbar.module.css";

const TRENDING = [
  "Oversized T-Shirts",
  "Co-Ord Sets",
  "Cargo Pants",
  "Denim Jackets",
  "Mini Skirts",
];

const RECENT_KEY = "doppey_recent_searches";

function getRecent() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecent(query) {
  const prev = getRecent().filter((q) => q !== query);
  const next = [query, ...prev].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

export default function SearchBar({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);

  // Refresh recent on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSearch = (term) => {
    const q = (term || query).trim();
    if (!q) return;
    saveRecent(q);
    setRecent(getRecent());
    // TODO: route to /search?q=encodeURIComponent(q)
    onClose();
  };

  const handleClearAll = () => {
    clearRecent();
    setRecent([]);
  };

  const handleRemoveRecent = (e, term) => {
    e.stopPropagation();
    const next = recent.filter((r) => r !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecent(next);
  };

  if (!open) return null;

  const suggestions = query.trim()
    ? [...TRENDING, ...recent].filter((t) =>
        t.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search">
      {/* Backdrop – click closes */}
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.panel}>
        {/* ── Search Input Row ── */}
        <div className={styles.inputRow}>
          <Search size={18} className={styles.inputIcon} />

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for products, brands & more"
            className={styles.input}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => setQuery("")}
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}

          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Live suggestions while typing */}
          {suggestions && (
            <ul className={styles.suggestionList}>
              {suggestions.length === 0 ? (
                <li className={styles.noResult}>No results for "{query}"</li>
              ) : (
                suggestions.map((term) => (
                  <li
                    key={term}
                    className={styles.suggestionItem}
                    onClick={() => handleSearch(term)}
                  >
                    <Search size={14} className={styles.suggIcon} />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: term.replace(
                          new RegExp(`(${query})`, "gi"),
                          "<mark>$1</mark>"
                        ),
                      }}
                    />
                    <ArrowUpRight size={14} className={styles.arrowIcon} />
                  </li>
                ))
              )}
            </ul>
          )}

          {/* Idle state: Recent + Trending */}
          {!suggestions && (
            <>
              {recent.length > 0 && (
                <section className={styles.section}>
                  <div className={styles.sectionHead}>
                    <span>Recent Searches</span>
                    <button className={styles.clearAllBtn} onClick={handleClearAll}>
                      Clear all
                    </button>
                  </div>
                  <ul className={styles.pillList}>
                    {recent.map((term) => (
                      <li key={term} className={styles.pill} onClick={() => handleSearch(term)}>
                        <Clock size={12} />
                        <span>{term}</span>
                        <button
                          className={styles.pillRemove}
                          onClick={(e) => handleRemoveRecent(e, term)}
                          aria-label={`Remove ${term}`}
                        >
                          <X size={11} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <span>Trending Now</span>
                </div>
                <ul className={styles.pillList}>
                  {TRENDING.map((term) => (
                    <li key={term} className={`${styles.pill} ${styles.pillTrending}`} onClick={() => handleSearch(term)}>
                      <TrendingUp size={12} />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
