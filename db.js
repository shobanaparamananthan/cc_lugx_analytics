const { createClient } = require('@clickhouse/client');
require('dotenv').config();

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD
});

module.exports = clickhouse;