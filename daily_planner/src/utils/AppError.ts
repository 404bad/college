export class AppError extends Error {
  public status: string;
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);

    this.status = `${statusCode}`.startsWith("4")
      ? "Client Error"
      : "Server Error";

    this.name = this.constructor.name;

    // Fix prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace (optional but recommended)
    Error.captureStackTrace(this);
  }
}
