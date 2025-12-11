import React, { useEffect, useState } from 'react';
import { shorten, listUrls } from './api';

export default function App() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchList() {
    const data = await listUrls();
    setList(data.reverse()); // latest first
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleShorten(e) {
    e.preventDefault();
    setError('');
    if (!url) { setError('Please enter a URL'); return; }
    setLoading(true);
    try {
      const res = await shorten(url);
      if (res.error) setError(res.error);
      else {
        setUrl('');
        await fetchList();
      }
    } catch (err) {
      setError('Failed to reach backend');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Simple URL Shortener</h1>

      <form onSubmit={handleShorten} className="form">
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter a long URL (include http:// or https://)"
        />
        <button type="submit" disabled={loading}>{loading ? 'Working...' : 'Shorten'}</button>
      </form>

      {error && <div className="error">{error}</div>}

      <h2>Created URLs</h2>
      <table>
        <thead>
          <tr>
            <th>Short</th>
            <th>Original</th>
            <th>Clicks</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && <tr><td colSpan="4">No URLs created yet.</td></tr>}
          {list.map(item => (
            <tr key={item.code}>
              <td><a href={item.shortUrl} target="_blank" rel="noreferrer">{item.shortUrl}</a></td>
              <td style={{maxWidth: 400, wordBreak: 'break-word'}}><a href={item.original} target="_blank" rel="noreferrer">{item.original}</a></td>
              <td>{item.clicks}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
