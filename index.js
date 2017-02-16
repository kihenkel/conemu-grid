'use strict';

const childProcess = require('child_process');
const { Methods, ConEmuPath, ServicesPath } = require('./config');

let amountColumns = 0;
let amountRows = 0;

const APPLICATION = '*powershell.exe';
const PARAM_RUNLIST = '-runlist';
const PARAM_CONSOLE = '-cur_console';
const PARAM_CONSOLE_PATH = `${PARAM_CONSOLE}:d:`;
const PARAM_CONSOLE_NAME = `${PARAM_CONSOLE}:t:`;
const PARAM_COMMAND = `-Command`;
const PARAM_NO_LOGO = '-NoLogo';
const PARAM_NO_EXIT = '-NoExit';

const method = Methods[process.argv[2]];

if (!method) {
  console.error('Unknown method param provided:', process.argv[2]);
  return;
}

const execute = `${ConEmuPath} ${PARAM_RUNLIST} ${getCommandForServices(method.services)}`;
console.log('EXECUTE:', execute);

childProcess.exec(execute, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
setTimeout(() => {process.kill(0);}, 10001);

function getCommandForServices(services) {
  amountColumns = Math.ceil(Math.sqrt(services.length));
  amountRows = amountColumns;
  console.log('Amount Services:', services.length);
  console.log('Amount Columns:', amountColumns);
  console.log('Amount Rows:', amountRows);

  const commands = services.map(getCommandForService);
  return commands.join(' ^|^|^| ');
}

function getCommandForService(service, index) {
  const splitCommand = getSplitCommand(index);
  const command = method.prepareCommand(method.runCommand, index);
  return `${APPLICATION} ${PARAM_CONSOLE_PATH}${ServicesPath}/${service} ${PARAM_CONSOLE_NAME}"${method.getDisplayName(service)}" ${splitCommand} ${PARAM_NO_LOGO} ${method.noExit ? PARAM_NO_EXIT : ''} ${PARAM_COMMAND} "${command}"`;
}

function getSplitCommand(index) {
  const coordinates = getCoordinatesForConsole(index);
  const consoleSplit = getConsoleSplitForCoordinates(coordinates, index);

  return consoleSplit ? `${PARAM_CONSOLE}:${consoleSplit}` : '';
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