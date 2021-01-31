import { SendMailOptions } from 'nodemailer';

export interface IEmailOptions extends Pick<SendMailOptions, 'to' | 'subject'> {
  context?: { [key: string]: any };
  template: string;
}