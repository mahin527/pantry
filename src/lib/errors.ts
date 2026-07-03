import { HTTP } from "./http-status";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code ?? "INTERNAL_ERROR";
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTP.NOT_FOUND, "NOT_FOUND");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HTTP.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, HTTP.BAD_REQUEST, "VALIDATION_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, HTTP.CONFLICT, "CONFLICT");
  }
}
