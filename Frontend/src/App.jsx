import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://urlshortner-cl6v.onrender.com";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(
    localStorage.getItem("shortUrl") || ""
  );
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!originalUrl.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/shorten`, { originalUrl });
      setShortUrl(res.data.shortUrl);
      localStorage.setItem("shortUrl", res.data.shortUrl);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!shortUrl) return;
    const code = shortUrl.split("/").pop();
    try {
      const res = await axios.get(`${API}/api/stats/${code}`);
      setStats(res.data);
    } catch {
      setStats(null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [shortUrl]);

  return (
    <div className="container">
      <div className="card">
        <h1>🔗 URL Shortener</h1>

        <input
          type="url"
          placeholder="Enter your long URL..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />

        <button onClick={handleShorten} disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {shortUrl && (
          <div className="short-url">
            <p>Your short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setTimeout(() => {
                  fetchStats();
                }, 1000);
              }}
            >
              {shortUrl}
            </a>
          </div>
        )}

        {stats && (
          <div className="stats">
            <p>
              <strong>Original URL:</strong> {stats.originalUrl}
            </p>
            <p>
              <strong>Clicks:</strong> {stats.clicks}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(stats.createdAt).toLocaleString()}
            </p>
          </div>
        )}
        <button onClick={fetchStats} className="refresh-button">
          🔄 Refresh Stats
        </button>
      </div>
    </div>
  );
}

export default App;
