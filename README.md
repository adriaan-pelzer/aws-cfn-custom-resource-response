# aws-cfn-custom-resource-response
## A library that builds & sends the right custom resource response out of the lambda event

### example
```
const sendAWSResponse = require('aws-cfn-custom-resource-response');

module.exports.handler = (event, context, callback) => {
  if (!event) {
    return callback('No event received');
  }

  const { RequestType } = event;
  const sendResponse = sendAWSResponse(event);

  if (RequestType === 'Delete') {
    return sendResponse({
      Status: 'SUCCESS'
    }, callback);
  }

  if (RequestType === 'Create' || RequestType === 'Update') {
    // do something
    const success = true;

    if (success) {
      return sendResponse({
        Status: 'SUCCESS'
      }, callback);
    }

    return sendResponse({
      Status: 'FAILED',
      Reason: 'Reason for failure diplayed in cloudformation console'
    }, callback);
  }

  return sendResponse({
    Status: 'FAILED',
    Reason: `Unsupported request type ${RequestType}`
  }, callback);
};
```
