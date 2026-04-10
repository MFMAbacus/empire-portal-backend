import nodemailer from "nodemailer";

import { mailHost, mailPassword, mailPort, mailUser } from "@/config/app";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export class Mailer {
  public static async sendMail(options: SendMailOptions): Promise<void> {
    mailTransport.sendMail({
      from: mailUser,
      to: options.to,
      replyTo: mailUser,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transportOptions: any = {
  host: mailHost,
  port: mailPort,
  auth: {
    user: mailUser,
    pass: mailPassword,
  },
  secure: false,
};

const mailTransport = nodemailer.createTransport(transportOptions);
