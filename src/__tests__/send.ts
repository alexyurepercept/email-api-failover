import { requestValidate, handler } from "../send";
import * as request from "../request";

jest.mock("../request", () => {
  const mock = {
    send: jest.fn()
  };
  return mock;
});

const mockDependency = request as any;

describe("Send Request Validate ", () => {
  beforeEach(() => {
    mockDependency.send.mockClear();
  });
  test("should throw error if to is empty or invalid", async () => {
    let errs = requestValidate([""], "test", "test");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: '"to" contains empty or undefined entry'
    });

    errs = requestValidate(["test"], "test", "test");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "test is not an email address"
    });
  });

  test("should throw error if subject is empty", async () => {
    let errs = requestValidate(["test@test.com"], "", "test");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "subject is empty"
    });
  });

  test("should throw error if message is empty", async () => {
    let errs = requestValidate(["test@test.com"], "test", "");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "message is empty"
    });
  });

  test("should pass parameters are all valid", async () => {
    let errs = requestValidate(["test@test.com"], "test", "test");
    expect(errs.length).toEqual(0);
  });

  test("should pass correct parameters to mailgun", async () => {
    mockDependency.send.mockResolvedValueOnce({});
    let result = await handler({
      body: JSON.stringify({
        to: ["test1@test.com", "test2@test.com"],
        cc: ["test3@test.com", "test4@test.com"],
        bcc: ["test5@test.com", "test6@test.com"],
        subject: "test",
        message: "test"
      })
    });

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        item: { status: "ok" }
      }),
      headers: {}
    });
    expect(mockDependency.send.mock.calls.length).toEqual(1);
    expect(mockDependency.send.mock.calls[0][0]).toEqual({
      body:
        "from=sender&to=test1%40test.com%2Ctest2%40test.com&subject=test&text=test&cc=test3%40test.com%2Ctest4%40test.com&bcc=test5%40test.com%2Ctest6%40test.com",
      headers: {
        Authorization: "Basic YXBpOmtleQ==",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      host: "api.mailgun.net",
      method: "POST",
      path: "/v3/domain/messages",
      port: 443
    });
  });

  test("should pass correct parameters to mailgun", async () => {
    mockDependency.send.mockRejectedValueOnce({}).mockResolvedValueOnce({});
    let result = await handler({
      body: JSON.stringify({
        to: ["test1@test.com", "test2@test.com"],
        cc: ["test3@test.com", "test4@test.com"],
        bcc: ["test5@test.com", "test6@test.com"],
        subject: "test",
        message: "test"
      })
    });

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        item: { status: "ok" }
      }),
      headers: {}
    });
    expect(mockDependency.send.mock.calls.length).toEqual(2);
    expect(mockDependency.send.mock.calls[0][0]).toEqual({
      body:
        "from=sender&to=test1%40test.com%2Ctest2%40test.com&subject=test&text=test&cc=test3%40test.com%2Ctest4%40test.com&bcc=test5%40test.com%2Ctest6%40test.com",
      headers: {
        Authorization: "Basic YXBpOmtleQ==",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      host: "api.mailgun.net",
      method: "POST",
      path: "/v3/domain/messages",
      port: 443
    });
    expect(mockDependency.send.mock.calls[1][0]).toEqual({
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "test1@test.com" }, { email: "test2@test.com" }],
            cc: [{ email: "test3@test.com" }, { email: "test4@test.com" }],
            bcc: [{ email: "test5@test.com" }, { email: "test6@test.com" }]
          }
        ],
        from: { email: "sender" },
        subject: "test",
        content: [{ type: "text/plain", value: "test" }]
      }),
      headers: {
        Authorization: "Bearer key",
        "Content-Type": "application/json"
      },
      host: "api.sendgrid.com",
      method: "POST",
      path: "/v3/mail/send",
      port: 443
    });
  });

  afterEach(done => {
    done();
  });

  afterAll(done => {
    done();
  });
});
