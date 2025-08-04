// const express = require('express');
// const cors = require('cors');   
// require('dotenv').config();

// const app = express(); 
// app.use(cors());            
// app.use(express.json());             

// const eventRoutes = require('./routes/events'); 
// app.use((req, res, next) => {
//   console.log(`➡️  ${req.method} ${req.url}`);
//   next();
// });
// app.use('/', eventRoutes);            

// const PORT = process.env.PORT || 8004;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`analytics Service running on port ${PORT}`);
// }).on('error', (err) => {
//   console.error(' Failed to start server:', err);
// });
// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const eventRoutes = require('./routes/events');

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

app.use('/', eventRoutes);

// Export the app (for testing)
module.exports = app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8004;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`analytics Service running on port ${PORT}`);
  }).on('error', (err) => {
    console.error(' Failed to start server:', err);
  });
}
