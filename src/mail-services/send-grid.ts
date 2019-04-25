import { send, RequestConfig } from "../request";

export class SendGrid {
  send(to: string, subject: string, text: string) {
    let requestConfig: RequestConfig = {
      host: "api.sendgrid.com",
      port: 443,
      method: "POST",
      path: `/v3/mail/send`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_APIKEY}`
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.SENDGRID_SENDER },
        subject: subject,
        content: [
          {
            type: "text/plain",
            value: text
          }
        ]
      })
    };

    console.log(requestConfig);
    return send(requestConfig);
  }
}
