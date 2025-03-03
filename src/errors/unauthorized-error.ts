import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
  }

  getStatusCode(): number {
    return 401;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
