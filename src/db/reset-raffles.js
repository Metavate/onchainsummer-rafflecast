// const sqlite3 = require("sqlite3").verbose();
import sqlite3 from "sqlite3";
// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
  "./collection.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);

// Serialize method ensures that database queries are executed sequentially
db.serialize(async () => {
  db.all(
    "UPDATE raffles SET winnerFid = null",
    (err, rows) => {
      if (err) {
      }
    }
  );
});

