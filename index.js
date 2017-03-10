'use strict';

const childProcess = require('child_process');
const { Methods, ConEmuPath } = require('./config');
const { validateMethod } = require('./validation');
const APPLICATIONS = require('./applications');

const PARAM_RUNLIST = '-runlist';
const PARAM_CUR_CONSOLE = '-cur_console';
const SWITCH_TAB_NAME = ':t:';
const SWITCH_WORKING_DIR = ':d:';
const SWITCHES_USEFUL = ':fni:';

let amountColumns = 0;
let amountRows = 0;

const method = Methods[process.argv[2]];

if (!validateMethod(method)) {
  console.error('ERROR: Method is invalid:', method);
  return;
}
setTimeout(() => {process.kill(0);}, 10001);

const execute = `${ConEmuPath} ${PARAM_RUNLIST} ${getCommandForServices(method.services)}`;
console.log(execute);

childProcess.exec(execute, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(stdout);
  console.log(stderr);
});

function getCommandForServices(services) {
  amountColumns = Math.ceil(Math.sqrt(services.length));
  amountRows = Math.ceil(services.length / amountColumns);

  const commands = services.map(getCommandForService);
  return commands.join(' ^|^|^| ');
}

function getCommandForService(service, index) {
  const app = APPLICATIONS[method.application] || APPLICATIONS[APPLICATIONS.default];
  const splitCommand = getSplitCommand(index);
  const command = method.command ? (typeof method.command === 'function' ? method.command(index) : method.command) : '';
  const displayName = method.getDisplayName ? method.getDisplayName(service) : service;
  const curConsole = `${PARAM_CUR_CONSOLE}${SWITCHES_USEFUL}${SWITCH_TAB_NAME}"${displayName}"${SWITCH_WORKING_DIR}"${service}"`;
  return `${app.executable} ${method.shouldExit ? app.paramExit : app.paramNoExit} ${app.paramAdditional} "${command}" ${curConsole} ${splitCommand}`;
}

function getSplitCommand(index) {
  const coordinates = getCoordinatesForConsole(index);
  const consoleSplit = getConsoleSplitForCoordinates(coordinates, index);

  return consoleSplit ? `${PARAM_CUR_CONSOLE}:${consoleSplit}` : '';
}

function getConsoleSplitForCoordinates(coordinates, index) {
  const isFirstRow = coordinates.y === 0;
  const isVeryFirst = isFirstRow && coordinates.x === 0;

  if (isVeryFirst) {
    return undefined;
  }

  if (isFirstRow) {
    const invertedX = amountColumns - coordinates.x;
    const horizontalPart = Math.floor(100 * (invertedX / (invertedX + 1)));
    return `s${coordinates.x}T${horizontalPart}H`;
  }

  const invertedY = amountRows - coordinates.y;
  const verticalPart = Math.floor(100 * (invertedY / (invertedY + 1)));
  return `s${index - amountColumns + 1}T${verticalPart}V`;
}

function getCoordinatesForConsole(index) {
  return {x: index % amountColumns, y: Math.floor(index / amountColumns)};
}