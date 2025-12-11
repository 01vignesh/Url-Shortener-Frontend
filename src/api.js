const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function shorten(url) {
  const res = await fetch(`${BACKEND}/api/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

export async function listUrls() {
  const res = await fetch(`${BACKEND}/api/urls`);
  return res.json();
}
