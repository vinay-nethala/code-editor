const express = require('express');
const path = require('path');
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Code Editor app listening at http://localhost:${port}`);
});