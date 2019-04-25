import { requestValidate } from "../send";

describe("Send Request Validate ", () => {
  test("should throw error if to is empty or invalid", async () => {
    let errs = requestValidate("", "test", "test");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "to is empty"
    });

    errs = requestValidate("test", "test", "test");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "to is not an email address"
    });
  });

  test("should throw error if subject is empty", async () => {
    let errs = requestValidate("test@test.com", "", "test");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "subject is empty"
    });
  });

  test("should throw error if message is empty", async () => {
    let errs = requestValidate("test@test.com", "test", "");
    expect(errs.length).toEqual(1);
    expect(errs).toContainEqual({
      code: "BAD_REQUEST_PARAMETER",
      message: "message is empty"
    });
  });

  test("should pass parameters are all valid", async () => {
    let errs = requestValidate("test@test.com", "test", "test");
    expect(errs.length).toEqual(0);
  });

  afterEach(done => {
    done();
  });

  afterAll(done => {
    done();
  });
});
