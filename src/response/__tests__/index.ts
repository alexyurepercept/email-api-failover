import { APIResponse } from "../index";

describe("API Response ", () => {
  test("should serialize to the correct response format", async () => {
    let apiResponse = new APIResponse();
    apiResponse.data = {
      status: "ok"
    };
    let result = apiResponse.serialize();
    expect(result).toEqual({
      statusCode: 200,
      headers: {},
      body: JSON.stringify({
        item: {
          status: "ok"
        }
      })
    });
  });

  afterEach(done => {
    done();
  });

  afterAll(done => {
    done();
  });
});
