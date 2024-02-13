export interface IEmailService<T, R> {
  sendEmail(mail: T): Promise<R>;
}
