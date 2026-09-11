class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError"
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, AppError);
  }
}

export default AppError;
