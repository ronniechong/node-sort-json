'use strict'

/**
 * Sorts JSON keys alphabetically
 *
 * Params:
 * -f absolute path to JSON file. E.g. -f path/to/file.json
 * -i ignored keys so they are not sorted. Use commas as delimiter E.g -i smartling,apply.filter
 */
const sortJson = require('sort-json');
const argv = require('minimist')(process.argv.slice(2));
const jsonFile = require('jsonfile');
const chalk = require('chalk');
const os = require('os');
const _ = require('lodash');

// Settings
const delimiter = ',';
const sortJsonOptions = {
  ignoreCase: true,
  reverse: false,
};
const jsonFileOptions = {
  spaces: 2,
  EOL: os.EOL,
};

// Filename
const file = argv.f;

// Reads Json file
function readJsonFile() {
  console.log(chalk.blue('Sorting translation...'));
  return new Promise((resolve, reject) => {
    try {
      jsonFile.readFile(file, (err, obj) => {
       
        if (err) {
          reject(err);
        }
        resolve(obj);
      });
    } catch (e) {
      reject(e);
    }
  });
}

// Sort json except excluded keys
function sortTranslations(obj) {
  if (argv.i) {
    const arrKeys = argv.i.split(delimiter);
    const objExcluded = _.pick(obj, arrKeys);
    const objFiltered = _.omit(obj, arrKeys);
    return Object.assign(objExcluded, sortJson(objFiltered, sortJsonOptions));
  }
  // Just sort all if nothing is passed in -i
  return sortJson(obj, sortJsonOptions);
}

// Overwrite Json file
function saveJsonFile(obj) {
  return new Promise((resolve, reject) => {
    try {
      jsonFile.writeFile(file, obj, jsonFileOptions, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

function finishedTask() {
   console.log(chalk.green('Sorting translation done'));
   process.exit(0);
}

function catchError(e) {
  console.log(chalk.red(`Error: ${e}`));
  process.exit(1);
}

readJsonFile()
  .then(sortTranslations)
  .then(saveJsonFile)
  .then(finishedTask)
  .catch(catchError); 
