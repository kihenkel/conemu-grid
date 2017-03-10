const validateMethod = (method) => {
  if (!method) {
    logError('Unknown method param provided');
    return false;
  }

  if (!method.paths) {
    logError('No paths provided');
    return false;
  }

  if (!Array.isArray(method.paths)) {
    logError('paths must be provided as an array');
    return false;
  }

  if (method.paths.some(path => typeof path !== 'string')) {
    logError('All paths must be provided as a string');
    return false;
  }

  return true;
};

const logError = (errorMessage) => {
  console.error(`ERROR: ${errorMessage}`);
};



module.exports = { validateMethod };