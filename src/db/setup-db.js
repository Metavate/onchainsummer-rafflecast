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
db.serialize(() => {
  // Create the items table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS raffles (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        creator TEXT NOT NULL,
        contract TEXT NOT NULL,
        blockchain TEXT NOT NULL,
        startTime INTEGER,
        endTime INTEGER NOT NULL,
        imageUrl TEXT,
        website TEXT,
        winnerFid INTEGER,
        winnerUsername TEXT,
        reward TEXT NOT NULL
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created raffles table.");

      // Clear the existing data in the products table
      db.run(`DELETE FROM raffles`, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("All rows deleted from raffles");

        // Insert new data into the products table
        const values1 = [
          "FINE ART MFER",
          "This is a raffle for the fine art mfer",
          "n2",
          "0xf0031782d37819f8e209c4421c774ed1f6163052",
          "ethereum",
          "1719036163521",
          parseInt(new Date().getTime() + (2 * 3600 * 1000)),
          "https://i.postimg.cc/x1PDWtVK/Untitled-3.png",
          "https://fineartmfers.io",
          "Hand Painted Artwork"
        ];

        
        const values2 = [
          "FINE ART MFER",
          "This is a raffle for the fine art mfer",
          "n2",
          "0xf0031782d37819f8e209c4421c774ed1f6163052",
          "ethereum",
          "1719036163521",
          parseInt(new Date().getTime() + (3600 * 1000)),
          "https://i.postimg.cc/x1PDWtVK/Untitled-3.png",
          "https://fineartmfers.io",
          "Hand Painted Artwork"
        ];

        const values3 = [
          "FINE ART MFER",
          "This is a raffle for the fine art mfer",
          "n2",
          "0xf0031782d37819f8e209c4421c774ed1f6163052",
          "ethereum",
          "1719036163521",
          parseInt(new Date().getTime() + (3600 * 1000)),
          "https://i.postimg.cc/x1PDWtVK/Untitled-3.png",
          "https://fineartmfers.io",
          "Hand Painted Artwork"
        ];
        

        const values4 = [
          "FINE ART MFER",
          "This is a raffle for the fine art mfer",
          "metavate",
          "0xf0031782d37819f8e209c4421c774ed1f6163052",
          "ethereum",
          "1719036163521",
          parseInt(new Date().getTime() + (90 * 1000)),
          "https://i.postimg.cc/x1PDWtVK/Untitled-3.png",
          "https://fineartmfers.io",
          "Hand Painted Artwork"
        ];

        const values5 = [
          "FINE ART MFER",
          "This is a raffle for the fine art mfer",
          "metavate",
          "0xB0bAeFbA1bBf4AEbD3FdCe5eCbBc4Bf3aBaBabaB",
          "ethereum",
          "1719389575396",
          parseInt(new Date().getTime()),
          "https://i.postimg.cc/x1PDWtVK/Untitled-3.png",
          "https://fineartmfers.io",
          "Hand Painted Artwork" 
        ];

      

        const insertSql = `INSERT INTO raffles(title, description, creator, contract, blockchain, startTime, endTime, imageUrl, website, reward) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

        db.run(insertSql, values5, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

      
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

        db.run(insertSql, values5, function (err) {
          if (err) {
            return console.error(err.message);
          }
          const id = this.lastID; // get the id of the last inserted row
          console.log(`Rows inserted, ID ${id}`);
        });

      

        //   Close the database connection after all insertions are done
        // db.close((err) => {
        //   if (err) {
        //     return console.error(err.message);
        //   }
        //   console.log("Closed the database connection.");
        // });
      });
    }
  );
});




db.serialize(() => {
  // Create the items table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS raffle_entries (
        entryKey TEXT PRIMARY KEY,
        fid TEXT NOT NULL,
        raffleId INTEGER NOT NULL,
        nftId INTEGER NOT NULL,
        submitTime INTEGER NOT NULL,
        username TEXT NOT NULL
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created raffle_entries table.");

      // Clear the existing data in the products table
      db.run(`DELETE FROM raffle_entries`, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("All rows deleted from raffle_entries");

        
        //   Close the database connection after all insertions are done
        db.close((err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Closed the database connection.");
        });
      });
    }
  );
});