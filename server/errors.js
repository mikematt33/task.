class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400;
    }
  }
  
  class ExistingUserError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ExistingUserError';
      this.statusCode = 400;
    }
  }
  
  class EmptyResultError extends Error {
    constructor(message) {
      super(message);
      this.name = 'EmptyResultError';
      this.statusCode = 404;
    }
  }
  
  class MissingParameterError extends Error {
    constructor(message) {
      super(message);
      this.name = 'MissingParameterError';
      this.statusCode = 400;
    }
  }
  
  module.exports = {
    ValidationError,
    ExistingUserError,
    EmptyResultError,
    MissingParameterError
  };
  