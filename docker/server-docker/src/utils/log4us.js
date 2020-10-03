/**
 * Ingenieria en Computadores
 * Proyecto 1
 * v1.0 -- 2019
 * 
 * Developed by: Pablo Garcia
 * File: log4us.js
 * Description: This module handles the logic for handle the log records of the application
 */

'use strict';

let chalk = require('chalk');
/**
 * Module Interface
 * @type {Object}
 */
let expose = {
  log : null,
  print : null,
  error : null
};

let onLoad = () => {
  expose.print(`log4us started, time set up: ${new Date()}`);
  expose.print(`Time set up: ${new Date()}`);
  return expose;
}

/**
 * @param  {Puts io in the standard I/O}
 * @return {buffer}
 */
expose.print = (io) => {
  console.log(chalk.green(`[ INFO @ ${new Date().toLocaleString()}] ${io}`));
}

/**
 * @param  {Puts io in the standard I/O if env is dev or log file if is production}
 * @return {buffer}
 */
expose.log = (io) => {
  // Finish this!
  console.log(chalk.yellow(`[ LOG @ ${new Date().toLocaleString()}] ${io}`));
}

/**
 * @param  {Puts io in the standard I/O}
 * @return {buffer}
 */
expose.error = (io) => {
  console.log(chalk.red(`[ ERROR @ ${new Date().toLocaleString()}] ${io}`));
}




// expose this file as a module based on the expose object
module.exports = onLoad;