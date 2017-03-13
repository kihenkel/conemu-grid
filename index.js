'use strict';

const childProcess = require('child_process');
const { Methods, ConEmuPath } = require('./config');
const { validateMethod } = require('./validation');
const SHELLS = require('./shells');

const PARAM_RUNLIST = '-runlist';
const PARAM_CUR_CONSOLE = '-cur_console';
const SWITCH_TAB_NAME = ':t:';
const SWITCH_WORKING_DIR = ':d:';
const SWITCHES_USEFUL = ':fni:';

let amountColumns = 0;
let amountRows = 0;

const method = Methods[process.argv[2]];
console.log('Starting with method', process.argv[2]);

if (!validateMethod(method)) {
  console.error('ERROR: Method is invalid:', method);
  return;
}

const execute = `${ConEmuPath} ${PARAM_RUNLIST} ${getCommandForPaths(method.paths)}`;
setTimeout(() => {process.kill(0);}, method.paths.length * 300);

childProcess.exec(execute, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(stdout);
  console.log(stderr);
});

function getCommandForPaths(paths) {
  amountColumns = Math.ceil(Math.sqrt(paths.length));
  amountRows = Math.ceil(paths.length / amountColumns);

  const commands = paths.map(getCommandForPath);
  return commands.join(' ^|^|^| ');
}

function getCommandForPath(path, index) {
  const methodShell = method.shell ? (typeof method.shell === 'function' ? method.shell(path, index) : method.shell) : SHELLS.default;
  const shell = SHELLS[methodShell];
  const splitCommand = getSplitCommand(index);
  const command = method.command ? (typeof method.command === 'function' ? method.command(path, index) : method.command) : '';
  const consoleName = method.consoleName ? (typeof method.consoleName === 'function' ? method.consoleName(path, index) : method.consoleName) : path;
  const curConsole = `${PARAM_CUR_CONSOLE}${SWITCHES_USEFUL}${SWITCH_TAB_NAME}"${consoleName}"${SWITCH_WORKING_DIR}"${path}"`;
  const shouldExit = typeof method.shouldExit === 'function' ? method.shouldExit(path, index) : method.shouldExit;
  return `${shell.executable} ${shouldExit ? shell.paramExit : shell.paramNoExit} ${shell.paramAdditional} "${command}" ${curConsole} ${splitCommand}`;
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