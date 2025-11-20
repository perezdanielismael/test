const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const TOKEN = process.env.HS_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN) console.warn("HS_TOKEN no seteado");

async function hsFetch(url, opts = {}) {
  const headers = opts.headers || {};
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  try { return JSON.parse(text); } catch(e) { return text; }
}

app.get('/cta', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "CTA ID requerido" });

  const url = `https://api.hubapi.com/cms/v3/marketing/cta/${id}/results`;

  try {
    const data = await hsFetch(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/cta/url', async (req, res) => {
  const { id, url: pageUrl, from, to } = req.query;
  if (!id || !pageUrl) return res.status(400).json({ error: "id y url requeridos" });

  const hsURL = `https://api.hubapi.com/events/v3/event-completions/search`;

  const payload = {
    filterGroups: [{ filters: [] }],
    limit: 5000
  };

  payload.filterGroups[0].filters.push({ propertyName: 'eventId', operator: 'EQ', value: id });
  payload.filterGroups[0].filters.push({ propertyName: 'pageUrl', operator: 'EQ', value: pageUrl });

  if (from) payload.filterGroups[0].filters.push({ propertyName: 'occurredAt', operator: 'GTE', value: new Date(from).toISOString() });
  if (to) payload.filterGroups[0].filters.push({ propertyName: 'occurredAt', operator: 'LTE', value: new Date(to).toISOString() });

  try {
    const data = await hsFetch(hsURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const results = Array.isArray(data.results) ? data.results : [];

    const mobile = results.filter(e => e.properties?.deviceType === "mobile" || e.properties?.device === "mobile").length;
    const desktop = results.filter(e => e.properties?.deviceType === "desktop" || e.properties?.device === "desktop").length;

    res.json({ total: results.length, mobile, desktop, raw: results });

  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get('/event', async (req, res) => {
  const { id, from, to } = req.query;
  if (!id) return res.status(400).json({ error: "Event ID requerido" });

  const url = `https://api.hubapi.com/events/v3/event-completions/search`;

  const payload = { filterGroups: [{ filters: [] }], limit: 5000 };

  payload.filterGroups[0].filters.push({ propertyName: 'eventId', operator: 'EQ', value: id });
  if (from) payload.filterGroups[0].filters.push({ propertyName: 'occurredAt', operator: 'GTE', value: new Date(from).toISOString() });
  if (to) payload.filterGroups[0].filters.push({ propertyName: 'occurredAt', operator: 'LTE', value: new Date(to).toISOString() });

  try {
    const data = await hsFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const results = Array.isArray(data.results) ? data.results : [];

    const mobile = results.filter(e => e.properties?.deviceType === "mobile" || e.properties?.device === "mobile").length;
    const desktop = results.filter(e => e.properties?.deviceType === "desktop" || e.properties?.device === "desktop").length;

    res.json({ total: results.length, mobile, desktop, raw: results });

  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => console.log("Servidor en puerto " + PORT));
