const express = require("express");
const cors = require("cors");
const db = require("../db/database");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// retrieve data rows for devices
app.get("/devices", (req, res) => {
  const queryAll = "SELECT * FROM device";
  const queryWithStartAndEnd = `SELECT * FROM device WHERE serial_number BETWEEN \'${req.query.serialStart}\' AND \'${req.query.serialEnd}\'`;

  const queryToUse =
    req.query.serialStart && req.query.serialEnd
      ? queryWithStartAndEnd
      : queryAll;

  db.all(queryToUse, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.json({ data: rows });
  });
});

// retrieve data rows for metrics
app.get("/metrics", (req, res) => {
  const queryAll = "SELECT * FROM metrics";
  const queryWithFilter = `SELECT * FROM metrics WHERE recordings_number > ${req.query.minRecordings}`;

  const queryToUse = req.query.minRecordings > 0 ? queryWithFilter : queryAll;

  db.all(queryToUse, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// retrieve data rows for events
app.get("/events", (req, res) => {
  const queryAll = "SELECT * FROM events";
  const queryWithFilter = `SELECT * FROM events WHERE event_type='${req.query.eventType}'`;

  const queryToUse = req.query.eventType ? queryWithFilter : queryAll;

  db.all(queryToUse, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// replaced the error handling middleware to not require jade/typescript dependencies
app.use(function (err, req, res, next) {
  res.send({ error: "500 - An error occurred" });
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
