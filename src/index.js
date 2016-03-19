/** == Imports == */
var AWS = require('aws-sdk'),
  _ = require('lodash');

/*
 * The AWS credentials are picked up from the environment.
 * They belong to the IAM role assigned to the Lambda function.
 * Since the ES requests are signed using these credentials,
 * make sure to apply a policy that allows ES domain operations
 * to the role.
 */
var creds = new AWS.EnvironmentCredentials('AWS');
var outputString = process.env.SAMPLE_ENV_VAR1
var querystring = require('querystring')

  /**
   * Entry point for lambda function handler
   * http://docs.aws.amazon.com/lambda/latest/dg/programming-model-v2.html
   */
exports.handler = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  var filter = _.get(event, 'queryParams.filter', '')
  filter = querystring.parse(decodeURIComponent(filter))
  var name = _.get(filter, 'name', '')
  var content = {
    name: name,
    msg: outputString
  }
  context.succeed(wrapResponse(context, 200, content, 1));
}


/**
 * @brief Wraps response according to our v3 spec
 * Should be moved to a common util
 */
function wrapResponse(context, status, body, count) {
  return {
    id: context.awsRequestId,
    result: {
      success: status === 200,
      status: status,
      metadata: {
        totalCount: count
      },
      content: body
    }
  }
}