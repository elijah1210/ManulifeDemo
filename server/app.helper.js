const assert = require('assert');
const _ = require('lodash');
const path = require('path');


const MAX_SIEVE = 10000000;
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
 * Given a number, returns the array of prime numbers smaller than it.
 * @param {number} n Number that must be greater than 0.
 */
const eratosCalc = (n) => {
  const array = [];
  const limit = Math.sqrt(n);
  const output = [];

  for (let i = 0; i < n; i += 1) {
    array.push(true);
  }

  for (let i = 2; i <= limit; i += 1) {
    if (array[i]) {
      for (let j = i * i; j < n; j += i) {
        array[j] = false;
      }
    }
  }

  for (let i = 2; i < n; i += 1) {
    if (array[i]) {
      output.push(i);
    }
  }
  return output;
};

/**
 * Given a sorted array of numbers, returns the median of the array.
 * @param {[number]} array Sorted array from smallest to largest.
 */
const medianCalc = (array) => {
  const output = [];
  const half = Math.floor(array.length / 2);

  if (array.length % 2) {
    output.push(array[half]);
  } else {
    output.push(array[half - 1]);
    output.push(array[half]);
  }

  return _.filter(output, element => !_.isNil(element)) || [];
};

const sieveNumberHandler = (req, res) => {
  assert(!_.isEmpty(req.params), 'Parameters must be provided.');
  assert(!_.isNil(req.params.sieveNumber), 'Number to call the sieve algorithm must be provided.');
  // Convert the passed value to a number.
  const sieveNumber = _.toNumber(req.params.sieveNumber);
  assert(_.isFinite(sieveNumber), 'Number to call the sieve algorithm must be finite.');
  assert(sieveNumber > 0, 'Number to call the sieve algorithm must be greater than 0.');
  assert(sieveNumber <= MAX_SIEVE, `Number for sieve algorithm must be less than ${MAX_SIEVE}.`);

  const output = medianCalc(eratosCalc(sieveNumber));

  res.json(output);
};

const defaultRouteHandler = (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
};

module.exports = {
  clientErrorHandler,
  medianCalc,
  eratosCalc,
  sieveNumberHandler,
  defaultRouteHandler,
  MAX_SIEVE,
};
