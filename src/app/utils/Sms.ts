import * as zenvia from '@zenvia/sdk';
import axios from 'axios';

class Sms {
  client: zenvia.Client;

  sms: zenvia.IChannel;

  whatsapp: zenvia.IChannel;

  constructor() {
    this.client = new zenvia.Client(process.env.ZENVIA_API_TOKEN);
    this.sms = this.client.getChannel('sms');
    this.whatsapp = this.client.getChannel('whatsapp');
  }

  async sendTokenSms(number: string, code: number) {
    const content = new zenvia.TextContent(`Código Mami: ${code}`);

    // this.sms
    //   .sendMessage(
    //     'ciborama.smscpaas',
    //     `55${number.replace(/ |-|\(|\)/g, '')}`,
    //     content
    //   )
    //   .catch((error) => console.error(error));

    await this.whatsapp
      .sendMessage(
        'proximal-longan',
        `55${number.replace(/ |-|\(|\)/g, '')}`,
        content
      )
      .catch((error) => {
        console.log(error.message)
        console.error(error)
      });
  }
}

export default new Sms();
