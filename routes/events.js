const express = require('express');
const router = express.Router();
const clickhouse = require('../db');

// Helper: Format timestamp to 'YYYY-MM-DD HH:MM:SS'
function formatTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

router.post('/events', async (req, res) => {
  const { event_type, page_url, session_id, depth = 0 } = req.body;

  if (!event_type || !page_url || !session_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await clickhouse.insert({
      table: 'web_analytics',
      values: [{
        event_type,
        page_url,
        session_id,
        timestamp: new Date().toISOString(),
        depth: depth || 0
      }],
      format: 'JSONEachRow'
    });

    console.log(`✔️ Stored ${event_type} on ${page_url} with depth: ${depth}%`);
    res.status(201).json({ message: 'Event stored successfully' });

  } catch (error) {
    console.error("❌ Insert error:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const resultSet = await clickhouse.query({
      query: 'SELECT * FROM web_analytics ORDER BY timestamp DESC',
      format: 'JSON'
    });

    const data = await resultSet.json();  //  This gives full result: meta + data + stats
    res.status(200).json(data.data);      //  Only return the clean event records
  } catch (error) {
    console.error(" Failed to fetch analytics data:", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/health', async (req, res) => {
  try {
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('ClickHouse query error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;

