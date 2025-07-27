const express = require('express');
const router = express.Router();
const clickhouse = require('../db');

// Helper: Format timestamp to 'YYYY-MM-DD HH:MM:SS'
function formatTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// POST /events → insert new analytics event
router.post('/events', async (req, res) => {
  const { event_type, page_url, session_id } = req.body;

  if (!event_type || !page_url || !session_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
//console.log("sss",process.env.CLICKHOUSE_D)
  try {
    await clickhouse.insert({
      table: `web_analytics`,
      values: [
        {
          event_type,
          page_url,
          session_id,
          timestamp: formatTimestamp()
        }
      ],
      format: 'JSONEachRow'
    });

    res.status(201).json({ message: 'Event recorded successfully' });
  } catch (err) {
    console.error('ClickHouse insert error:', err);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

// GET /events → return last 100 events
router.get('/events', async (req, res) => {
  try {
    const resultSet = await clickhouse.query({
      query: `SELECT * FROM web_analytics ORDER BY timestamp DESC LIMIT 100`,
      format: 'JSON'
    });

    const data = await resultSet.json();
    res.status(200).json(data.data);
  } catch (err) {
    console.error('ClickHouse query error:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
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

