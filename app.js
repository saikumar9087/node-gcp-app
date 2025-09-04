const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;  // Use Cloud Run's provided port

app.get('/', (req, res) => {
  res.send('Hello World from Node.js on GCP! v2.0');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});