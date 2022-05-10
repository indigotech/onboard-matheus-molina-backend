export class CustomError extends Error {
  code: number;
  additionalInfo?: string;
  constructor(code: number, message: string, additionalInfo?: string) {
    super();
    (this.message = message),
      (this.code = code),
      (this.additionalInfo = additionalInfo);
  }
}
