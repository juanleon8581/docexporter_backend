import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message);
  }

  getStatusCode(): number {
    return 400;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
