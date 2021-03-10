import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import path = require('path');
import * as fs from 'fs';
import * as ejs from 'ejs';
import { IEmailOptions } from '../interfaces/email.options.interface';

const nodemailer = require("nodemailer");

@Injectable()
export class EmailService {
  async sendEmail (options: IEmailOptions): Promise<{success: boolean}> {
    const fromEmail = '';

    const mailOptions = {
      from: `${fromEmail}`,
      to: options.to,
      subject: options.subject,
      html: await this.ejsToHtml(options.template, options.context)
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: fromEmail,
        pass: ''
      }
    });

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err: Error | null, info: SentMessageInfo) => {
        if (err) {
          return reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  private async ejsToHtml (template: string, data: {[key: string]: any}): Promise<string> {
    const templatePath = path.resolve(__dirname, '..', '..', 'templates', 'email', `${template}.ejs`);

    const isTemplateExists = await new Promise<boolean>(resolve => {
      fs.access(templatePath, error => {
        if (error) { return resolve(false); }
        return resolve(true);
      });
    });

    if (!isTemplateExists) { throw new Error('Template not exists.'); }

    return ejs.renderFile(templatePath, data);
  }
}
