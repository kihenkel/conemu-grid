const validateMethod = (method) => {
  if (!method) {
    logError('Unknown method param provided');
    return false;
  }

  if (!method.services) {
    logError('No services provided');
    return false;
  }

  if (!Array.isArray(method.services)) {
    logError('Services must be provided as an array');
    return false;
  }

  if (method.services.some(service => typeof service !== 'string')) {
    logError('All services must be provided as a string');
    return false;
  }

  return true;
};

const logError = (errorMessage) => {
  console.error(`ERROR: ${errorMessage}`);
};



module.exports = { validateMethod };