import { MailGun } from "./mail-services/mail-gun";
import { APIResponse, APIError } from "./response";
import { SendGrid } from "./mail-services/send-grid";

export function requestValidate(
  to: string,
  subject: string,
  message: string
): (Error | APIError)[] {
  let errs = [];
  if (!subject) {
    errs.push({
      code: "BAD_REQUEST_PARAMETER",
      message: "subject is empty"
    });
  }

  if (!message) {
    errs.push({
      code: "BAD_REQUEST_PARAMETER",
      message: "message is empty"
    });
  }

  if (!to) {
    errs.push({
      code: "BAD_REQUEST_PARAMETER",
      message: "to is empty"
    });
  } else if (!/^[\w|\.]+@[a-zA-Z_\.]+$/.test(to)) {
    errs.push({
      code: "BAD_REQUEST_PARAMETER",
      message: "to is not an email address"
    });
  }
  return errs;
}

interface SendLaunchBody {
  to: string;
  subject: string;
  message: string;
}

export async function handler(event: any) {
  let apiResponse = new APIResponse();
  let body: SendLaunchBody;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    apiResponse.addError(err);
    return apiResponse.serialize();
  }

  let errs = requestValidate(body.to, body.subject, body.message);
  if (errs.length) {
    apiResponse.addError(errs);
    return apiResponse.serialize();
  }

  let mailGun = new MailGun();
  let sendGrid = new SendGrid();

  try {
    await mailGun.send(body.to, body.subject, body.message);
    apiResponse.data = {
      status: "ok"
    };
    return apiResponse.serialize();
  } catch (err) {
    console.log(err);
  }

  try {
    await sendGrid.send(body.to, body.subject, body.message);
    apiResponse.data = {
      status: "ok"
    };
    return apiResponse.serialize();
  } catch (err) {
    console.log(err);
  }

  apiResponse.addError({
    code: "ERROR",
    message: "failed to send email"
  });
  return apiResponse.serialize();
}
