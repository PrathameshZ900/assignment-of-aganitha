"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [useCustomTtl, setUseCustomTtl] = useState(false);
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Calculate TTL
      let ttlSeconds = null;
      if (useCustomTtl) {
        ttlSeconds = parseInt(ttl, 10);
      } else if (ttl) {
        ttlSeconds = parseInt(ttl, 10);
      }

      const payload = {
        content,
        ttl_seconds: ttlSeconds || undefined,
        max_views: maxViews ? parseInt(maxViews, 10) : undefined,
      };

      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="title">Pastebin Lite</h1>

      {!result ? (
        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label className="label" htmlFor="content">New Paste</label>
            <textarea
              id="content"
              className="textarea"
              placeholder="Paste your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Expiration (TTL)</label>
            <select
              className="select"
              value={useCustomTtl ? "custom" : ttl}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setUseCustomTtl(true);
                  setTtl("");
                } else {
                  setUseCustomTtl(false);
                  setTtl(e.target.value);
                }
              }}
            >
              <option value="">Never</option>
              <option value="60">1 Minute</option>
              <option value="300">5 Minutes</option>
              <option value="3600">1 Hour</option>
              <option value="86400">1 Day</option>
              <option value="604800">1 Week</option>
              <option value="custom">Custom (Seconds)</option>
            </select>
          </div>

          {useCustomTtl && (
            <div className="form-group">
              <label className="label">Seconds</label>
              <input
                type="number"
                className="input"
                min="1"
                placeholder="e.g. 120"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                required={useCustomTtl}
              />
            </div>
          )}

          <div className="form-group">
            <label className="label">Max Views (Optional)</label>
            <input
              type="number"
              className="input"
              min="1"
              placeholder="e.g. 5 (Leave empty for unlimited)"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
            />
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              Paste becomes unavailable after this many views.
            </small>
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Creating..." : "Create Paste"}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ marginTop: 0 }}>Paste Created!</h2>
          <p>Your paste is ready at:</p>
          <div className="form-group">
            <input
              className="input"
              readOnly
              value={result.url}
              onClick={(e) => e.target.select()}
            />
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href={result.url} className="button">
              View Paste
            </a>
            <button
              type="button"
              className="button"
              style={{ background: "#444" }}
              onClick={() => {
                setResult(null);
                setContent("");
                setTtl("");
                setMaxViews("");
              }}
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
