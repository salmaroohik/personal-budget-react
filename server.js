const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(cors());

var budget;
fs.readFile("budget.json", "utf8", function (err, data) {
  if (err) throw err;
  budget = JSON.parse(data);
});

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});