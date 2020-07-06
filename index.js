const https = require('https');
const url = require('url');

const { DEBUG } = process.env;

const log = DEBUG ? console.log : () => {};

const buildResponse = ({
  ResponseURL,
  StackId,
  RequestId,
  PhysicalResourceId,
  LogicalResourceId,
  Status,
  Reason
}) => {
  const responseBody = JSON.stringify({
    Status,
    Reason,
    PhysicalResourceId: PhysicalResourceId || LogicalResourceId,
    StackId,
    RequestId,
    LogicalResourceId
  });

  log('Sending response body:');
  log(responseBody);

  const fullResponse = {
    ...url.parse(ResponseURL),
    port: 443,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length
    },
    body: responseBody
  };

  log('Sending full response:');
  log(JSON.stringify(fullResponse));

  return fullResponse;
};

const sendResponse = event => ({ Status, Reason }, callback) => {
  if (!event.ResponseURL) {
    return callback(null, { Status, Reason });
  }

  const { body, ...options } = buildResponse({ ...event, Status, Reason });
  const ctx = {
    data: []
  };

  const request =  https.request(options);

  request.on('response', ({ statusCode, headers }) => {
    log('statusCode', statusCode);
    log('Data:');
    log(ctx.data.join(''));
    return callback(null, {
      statusCode,
      headers
    });
  });
  request.on('error', error => callback(error));
  request.on('data', d => ctx.data.push(d.toString()));
  request.write(body);
};

module.exports = sendResponse;
