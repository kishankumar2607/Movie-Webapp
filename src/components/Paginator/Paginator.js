import React from "react";
import "./styles.css";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Pagination component
export default function Paginator({ page, totalPages, onChange, disabled }) {
  if (!totalPages || totalPages <= 1) return null;

  const MAX = Math.min(totalPages, 500); // TMDB caps at 500
  const go = (p) => !disabled && onChange(clamp(p, 1, MAX));

  // Calculate a compact window of page numbers
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(MAX, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const nums = [];
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="page-btn"
        onClick={() => go(1)}
        disabled={disabled || page === 1}
        aria-label="First page"
      >
        « First
      </button>
      <button
        className="page-btn"
        onClick={() => go(page - 1)}
        disabled={disabled || page === 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      {start > 1 && (
        <>
          <button
            className="page-btn"
            onClick={() => go(1)}
            disabled={disabled}
          >
            1
          </button>
          {start > 2 && <span className="ellipsis">…</span>}
        </>
      )}

      {nums.map((n) => (
        <button
          key={n}
          className={`page-btn ${n === page ? "active" : ""}`}
          onClick={() => go(n)}
          disabled={disabled || n === page}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </button>
      ))}

      {end < MAX && (
        <>
          {end < MAX - 1 && <span className="ellipsis">…</span>}
          <button
            className="page-btn"
            onClick={() => go(MAX)}
            disabled={disabled}
          >
            {MAX}
          </button>
        </>
      )}

      <button
        className="page-btn"
        onClick={() => go(page + 1)}
        disabled={disabled || page === MAX}
        aria-label="Next page"
      >
        Next ›
      </button>
      <button
        className="page-btn"
        onClick={() => go(MAX)}
        disabled={disabled || page === MAX}
        aria-label="Last page"
      >
        Last »
      </button>
    </nav>
  );
}
