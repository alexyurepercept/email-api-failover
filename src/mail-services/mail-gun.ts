import { send, RequestConfig } from "../request";
const toQueryString = (data: Object): string => {
  let keys = Object.keys(data);
  let stringPairs = [];
  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i];
    stringPairs.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    );
  }
  return stringPairs.join("&");
};

export class MailGun {
  send(to: string, subject: string, text: string) {
    let mailGunForm = {
      from: process.env.MAILGUN_SENDER,
      to,
      subject,
      text
    };
    let requestConfig: RequestConfig = {
      host: "api.mailgun.net",
      port: 443,
      method: "POST",
      path: `/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `api:${process.env.MAILGUN_APIKEY}`
        ).toString("base64")}`
      },
      body: toQueryString(mailGunForm)
    };
    console.log(requestConfig);

    return send(requestConfig);
  }
}
