import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import aws from 'aws-sdk';
import fs from 'fs';
import mailConfig from '@config/mail';

class Mailer {
  client: nodemailer.Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'sa-east-1',
      }),
    });
  }

  async sendMail(template: any, variables: object, to: any, subject: string) {
    const templateFileContent = await fs.promises.readFile(template, {
      encoding: 'utf-8',
    });

    const parsedTemplate = handlebars.compile(templateFileContent);

    await this.client.sendMail({
      from: mailConfig.from,
      to,
      subject,
      html: parsedTemplate(variables),
      
    });
  }
}

export default new Mailer();
