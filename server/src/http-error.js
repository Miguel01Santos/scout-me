export class HttpError extends Error {
  constructor(statusCode, message, issues = []) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.issues = issues;
  }
}
