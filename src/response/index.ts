export interface APIError {
  code: string;
  message: string;
}

export class APIResponse {
  errs: APIError[];
  data: any;
  statusCode: number;
  constructor() {
    this.errs = [];
    this.statusCode = 200;
  }

  addError(err: Error | APIError | (Error | APIError)[]) {
    if (err instanceof Error) {
      if (err.stack === undefined || null) {
        this.errs.push({
          code: "SERVER_ERROR",
          message: "unknown"
        });
      } else {
        this.errs.push({
          code: "SERVER_ERROR",
          message: err.stack
        });
      }
    } else if (Array.isArray(err)) {
      for (let i = 0; i < err.length; ++i) {
        this.addError(err[i]);
      }
    } else {
      this.errs.push(err);
    }
  }

  serialize() {
    let payload: any = {};
    if (this.errs.length > 0) {
      payload.errs = this.errs;
      if (this.statusCode < 400) {
        this.statusCode = 400;
      }
      this.statusCode = this.statusCode < 400 ? 400 : this.statusCode;
    } else {
      if (Array.isArray(this.data)) {
        payload.items = this.data;
      } else {
        payload.item = this.data;
      }
    }

    let body = JSON.stringify(payload);
    return {
      statusCode: this.statusCode || 200,
      headers: {},
      body
    };
  }
}
