const https = require('https');
const url = require('url');

const buildResponse = ({
  ResponseURL,
  StackId,
  RequestId,
  LogicalResourceId,
  Status,
  Reason
}) => {
  const responseBody = JSON.stringify({
    Status,
    Reason,
    PhysicalResourceId: LogicalResourceId,
    StackId,
    RequestId,
    LogicalResourceId
  });

  return {
    ...url.parse(ResponseURL),
    port: 443,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length
    },
    body: responseBody
  };
};

const sendResponse = event => ({ Status, Reason }, callback) => {
  if (!event.ResponseURL) {
    return callback(null, { Status, Reason });
  }

  const { body, ...options } = buildResponse({ ...event, Status, Reason });
  const request = https.request(options, ({ statusCode, headers }) => (statusCode < 200 || statusCode > 299)
    ? callback({ statusCode, headers })
    : callback(null, { statusCode, headers })
  );

  request.on('error', error => callback(error));
  request.write(body);
  request.end();
};

module.exports = sendResponse;
