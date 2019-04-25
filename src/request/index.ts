import https from "https";

export interface RequestConfig {
  host: string;
  port: number;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  headers: any;
  body: string | undefined | null;
}

export const send = (requestConfig: RequestConfig) => {
  return new Promise((resolve, reject) => {
    let httpsConfig = {
      host: requestConfig.host,
      port: requestConfig.port,
      method: requestConfig.method,
      path: requestConfig.path,
      headers: requestConfig.headers
    };
    if (requestConfig.body) {
      httpsConfig.headers["Content-Length"] = requestConfig.body.length;
    }

    const req = https.request(httpsConfig, res => {
      let result = "";
      res.on("data", chunk => {
        result += chunk;
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode < 400) {
          resolve(result);
        } else {
          reject(result);
        }
      });
      res.on("error", err => {
        reject(err);
      });
    });

    req.on("error", err => {
      reject(err);
    });
    if (requestConfig.body) {
      req.write(requestConfig.body);
    }
    req.end();
  });
};
