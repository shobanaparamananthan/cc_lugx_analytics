const express = require('express');
require('dotenv').config();

const app = express();                 
app.use(express.json());             

const eventRoutes = require('./routes/events'); 
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});
app.use('/', eventRoutes);            

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`🎮 Game Service running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err);
});