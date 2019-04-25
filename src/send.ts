import { MailGun } from "./mail-services/mail-gun";
import { APIResponse, APIError } from "./response";
import { SendGrid } from "./mail-services/send-grid";

export function requestValidate(
  to: string[],
  subject: string,
  message: string,
  cc?: string[],
  bcc?: string[]
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

  if (!Array.isArray(to)) {
    errs.push({
      code: "BAD_REQUEST_PARAMETER",
      message: "to is not array"
    });
  } else if (!to.length) {
    errs.push({
      code: "BAD_REQUEST_PARAMETER",
      message: "to needs to contain at least one email address"
    });
  } else {
    for (let i = 0; i < to.length; ++i) {
      if (!to[i]) {
        errs.push({
          code: "BAD_REQUEST_PARAMETER",
          message: `"to" contains empty or undefined entry`
        });
      } else if (!/^[\w|\.]+@[a-zA-Z_\.]+$/.test(to[i])) {
        errs.push({
          code: "BAD_REQUEST_PARAMETER",
          message: `${to[i]} is not an email address`
        });
      }
    }
  }

  if (cc) {
    if (!Array.isArray(cc)) {
      errs.push({
        code: "BAD_REQUEST_PARAMETER",
        message: "cc is not array"
      });
    } else if (!cc.length) {
      errs.push({
        code: "BAD_REQUEST_PARAMETER",
        message: "cc is an empty array"
      });
    }
  }

  if (bcc) {
    if (!Array.isArray(bcc) || !bcc.length) {
      errs.push({
        code: "BAD_REQUEST_PARAMETER",
        message: "bcc is not array"
      });
    } else if (!bcc.length) {
      errs.push({
        code: "BAD_REQUEST_PARAMETER",
        message: "bcc is an empty array"
      });
    }
  }

  return errs;
}

interface SendLaunchBody {
  to: string[];
  subject: string;
  message: string;
  cc: string[] | undefined;
  bcc: string[] | undefined;
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

  let errs = requestValidate(
    body.to,
    body.subject,
    body.message,
    body.cc,
    body.bcc
  );
  if (errs.length) {
    apiResponse.addError(errs);
    return apiResponse.serialize();
  }

  let mailGun = new MailGun();
  let sendGrid = new SendGrid();

  try {
    await mailGun.send(body.to, body.subject, body.message, body.cc, body.bcc);
    apiResponse.data = {
      status: "ok"
    };
    return apiResponse.serialize();
  } catch (err) {
    console.log(err);
  }

  try {
    await sendGrid.send(body.to, body.subject, body.message, body.cc, body.bcc);
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
