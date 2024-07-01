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
  // get raffleId of raffle with contract 0xB0bAeFbA1bBf4AEbD3FdCe5eCbBc4Bf3aBaBabaB and return results in varriable
  const raffleId = (await new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM raffles WHERE contract = '0xB0bAeFbA1bBf4AEbD3FdCe5eCbBc4Bf3aBaBabaB'",
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  }))[0].id;
  console.log("raffleId: ", raffleId);


//   shaya: 8637
//   Noah: 299149 
//   free: 337057
  const values1 = [
    raffleId + " - " + 1,
    "337057",
    raffleId,
    1,
    new Date().getTime(),  
    "Free"  
  ];
  
  const values2 = [
    raffleId + " - " + 2,
    "337057",
    raffleId,
    2,
    new Date().getTime(),    
    "Free"  
  ];
  const values3 = [
    raffleId + " - " + 3,
    "337057",
    raffleId,
    3,
    new Date().getTime(),    
    "Free"  
  ];
  const values4 = [
    raffleId + " - " + 4,
    "337057",
    raffleId,
    4,
    new Date().getTime(),    
    "Free"   
  ];

  const insertSql = `INSERT INTO raffle_entries(entryKey, fid, raffleId, nftId, submitTime, username) VALUES(?, ?, ?, ?, ?, ?)`;
  db.run(insertSql, values1, function (err) {
    if (err) {
      return console.error(err.message);
    }
    const id = this.lastID; // get the id of the last inserted row
    console.log(`Rows inserted, ID ${id}`);
  });
  db.run(insertSql, values2, function (err) {
    if (err) {
      return console.error(err.message);
    }
    const id = this.lastID; // get the id of the last inserted row
    console.log(`Rows inserted, ID ${id}`);
  });
  db.run(insertSql, values3, function (err) {
    if (err) {
      return console.error(err.message);
    }
    const id = this.lastID; // get the id of the last inserted row
    console.log(`Rows inserted, ID ${id}`);
  });
  db.run(insertSql, values4, function (err) {
    if (err) {
      return console.error(err.message);
    }
    const id = this.lastID; // get the id of the last inserted row
    console.log(`Rows inserted, ID ${id}`);
  });



  
});