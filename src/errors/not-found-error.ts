import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message);
  }

  getStatusCode(): number {
    return 404;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
