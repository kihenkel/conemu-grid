'use strict';

const childProcess = require('child_process');
const { Methods, ConEmuPath } = require('./config');

let amountColumns = 0;
let amountRows = 0;

const APPLICATION = 'cmd.exe';
const PARAM_EXIT = '/c';
const PARAM_NO_EXIT = '/k';
const PARAM_RUNLIST = '-runlist';
const PARAM_CUR_CONSOLE = '-cur_console';
const SWITCH_TAB_NAME = ':t:';
const SWITCH_WORKING_DIR = ':d:';
const SWITCHES_USEFUL = ':fni:'

const method = Methods[process.argv[2]];

if (!method) {
  console.error('Unknown method param provided:', process.argv[2]);
  return;
}

const execute = `${ConEmuPath} ${PARAM_RUNLIST} ${getCommandForServices(method.services)}`;

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
  amountRows = Math.ceil(services.length / amountColumns);

  const commands = services.map(getCommandForService);
  return commands.join(' ^|^|^| ');
}

function getCommandForService(service, index) {
  const splitCommand = getSplitCommand(index);
  const command = method.prepareCommand(method.runCommand, index);
  const curConsole = `${PARAM_CUR_CONSOLE}${SWITCHES_USEFUL}${SWITCH_TAB_NAME}"${method.getDisplayName(service)}"${SWITCH_WORKING_DIR}"${service}"`;
  return `${APPLICATION} ${method.noExit ? PARAM_NO_EXIT : PARAM_EXIT} "${command}" ${curConsole} ${splitCommand}`;
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