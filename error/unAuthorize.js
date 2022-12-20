const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class UnuathorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnuathorizedError;
