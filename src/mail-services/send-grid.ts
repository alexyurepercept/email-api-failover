import { send, RequestConfig } from "../request";

export class SendGrid {
  send(
    to: string[],
    subject: string,
    text: string,
    cc?: string[],
    bcc?: string[]
  ) {
    let sendGridBody: any = {
      personalizations: [{}],
      from: { email: process.env.SENDGRID_SENDER },
      subject: subject,
      content: [
        {
          type: "text/plain",
          value: text
        }
      ]
    };

    sendGridBody.personalizations[0].to = to.map(t => {
      return { email: t };
    });

    if (cc) {
      sendGridBody.personalizations[0].cc = cc.map(t => {
        return { email: t };
      });
    }

    if (bcc) {
      sendGridBody.personalizations[0].bcc = bcc.map(t => {
        return { email: t };
      });
    }

    let requestConfig: RequestConfig = {
      host: "api.sendgrid.com",
      port: 443,
      method: "POST",
      path: `/v3/mail/send`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_APIKEY}`
      },
      body: JSON.stringify(sendGridBody)
    };

    return send(requestConfig);
  }
}
