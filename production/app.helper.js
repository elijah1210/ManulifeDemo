const assert = require('assert');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

/**
 * Client error handler.
 * @param {*} err Error object.
 * @param {*} req Request object.
 * @param {*} res Response object.
 * @param {*} next Function to continue execution.
 */
const clientErrorHandler = (err, req, res, next) => {
  if (err instanceof assert.AssertionError) {
    res.status(412).json({
      type: 'AssertionError',
      message: err.message,
    });
  } else if (req.xhr) {
    res.status(500).send({ error: err });
  } else {
    next(err);
  }
};

/**
 * Initialize the db connection.
 * @param {*} db Database object.
 */
const initializeDb = (db) => {
  db.run(`CREATE TABLE IF NOT EXISTS exchangeRatesUSD (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      AUD NUMERIC,
      CAD NUMERIC,
      EUR NUMERIC,
      GBP NUMERIC)`);
};

/**
 * Inserts new record into the database.
 * @param {*} db Database object.
 * @param {*} row Request body for insertion.
 */
const insertOrIgnoreNewRow = async (db, row) => db.run(`
  INSERT OR IGNORE INTO exchangeRatesUSD (
            date, 
            AUD, 
            CAD, 
            EUR, 
            GBP) 
          VALUES (
            ?, 
            ?, 
            ?, 
            ?, 
            ?)`, [row.date, row.rates.AUD, row.rates.CAD, row.rates.EUR, row.rates.GBP],
(err) => {
  if (err) {
    return false;
  }
  return true;
});

/**
 * Handles updating the database.
 * @param {*} req Request object.
 * @param {*} res Response object.
 */
const updateDBHandler = (req, res) => {
  assert(req.body, 'Body of the post must be provided.');
  assert(req.body.date, 'Date rates were retrieved for must be provided.');
  assert(req.body.rates, 'Object containing rates must be provided.');
  assert(req.body.rates.hasOwnProperty('AUD')
         && req.body.rates.hasOwnProperty('CAD')
         && req.body.rates.hasOwnProperty('EUR')
         && req.body.rates.hasOwnProperty('GBP'), 'Rates object was not properly formed.');
  const dbExists = fs.existsSync('./server.db');
  const db = new sqlite3.Database('./server.db');
  // Don't bother creating the table if it already exists as it would have been created before.
  if (!dbExists) {
    initializeDb(db);
  }

  // Check if the data already exists in the database and insert if it doesn't.
  const success = insertOrIgnoreNewRow(db, req.body);
  if (!success) {
    db.close();
    res.sendStatus(500);
  }

  // Close the db connection and return HTTP 200.
  db.close();
  res.sendStatus(200);
};

/**
 * Handles bulk updating the database.
 * @param {*} req Request object.
 * @param {*} res Response object.
 */
const updateDBBulkHandler = (req, res) => {
  assert(req.body, 'Body of the post must be provided.');
  assert(req.body.length > 0, 'Body must have a length greater than 0.');

  const resultArray = [];
  const dbExists = fs.existsSync('./server.db');
  const db = new sqlite3.Database('./server.db');
  // Don't bother creating the table if it already exists as it would have been created before.
  if (!dbExists) {
    initializeDb(db);
  }
  // Run commands in series and not parallel in case of locks and multiple writes.
  db.serialize(() => {
    req.body.forEach((row) => {
      resultArray.push(insertOrIgnoreNewRow(db, row));
    });
  });

  if (!resultArray.every(val => val)) {
    db.close();
    res.sendStatus(500);
  }

  // Close the db connection and return HTTP 200.
  db.close();
  res.sendStatus(200);
};

const defaultRouteHandler = (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
};

module.exports = {
  clientErrorHandler,
  updateDBHandler,
  updateDBBulkHandler,
  defaultRouteHandler,
};
