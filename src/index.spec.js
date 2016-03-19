require('es6-promise').polyfill();

var chai = require("chai");
var expect = require("chai").expect,
  lambdaToTest = require('./index.js');

sinon = require("sinon");
chai.use(require('sinon-chai'));
const context = require('aws-lambda-mock-context');

var testLambda = function(event, ctx, resp) {
  // Fires once for the group of tests, done is mocha's callback to 
  // let it know that an   async operation has completed before running the rest 
  // of the tests, 2000ms is the default timeout though
  before(function(done) {
    //This fires the event as if a Lambda call was being sent in
    lambdaToTest.handler(event, ctx)
      //Captures the response and/or errors
    ctx.Promise
      .then(function(response) {
        resp.success = response;
        done();
      })
      .catch(function(err) {
        resp.error = err;
        done();
      })
  })
}

describe('When receiving a request', function() {
  var resp = { success: null, error: null };
  const ctx = context()
  testLambda({
    "stage": "test-invoke-stage",
    "requestId": "test-invoke-request",
    "resourcePath": "/v3/tags1",
    "resourceId": "dxtdde",
    "httpMethod": "GET",
    "sourceIp": "test-invoke-source-ip",
    "userAgent": "Apache-HttpClient/4.3.4 (java 1.5)",
    "caller": "AIDAJJMZ5ZCBYPW45NZRC",
    "body": "{}",
    "queryParams": {
      "filter": "name%3DaliG",
    }
  }, ctx, resp)

  describe('then response ', function() {
    it('should be a valid response', function() {
      console.log(result)
      expect(resp.success.result).to.not.be.null
      var result = resp.success.result
      expect(result.success).to.be.true
      expect(result.status).to.equal(200)
    })
  })
})