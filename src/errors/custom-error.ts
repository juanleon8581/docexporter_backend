export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract getStatusCode(): number;

  abstract serializeErrors(): { message: string; field?: string }[];
}
