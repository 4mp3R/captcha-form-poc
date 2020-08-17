const AWS = require("aws-sdk");

exports.handler = async function (event, context) {
  const { body, requestContext } = event;
  const { path, method } = requestContext.http;

  if (path != "/" && method != "POST") {
    return {
      statusCode: 400,
    };
  }

  let message;
  try {
    message = JSON.parse(body).message;
  } catch (_) {}

  if (!message) {
    return {
      statusCode: 400,
    };
  }

  var dbClient = new AWS.DynamoDB.DocumentClient();
  await dbClient
    .put({
      TableName: process.env.contactRequestTableName,
      Item: {
        id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        message,
      },
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
    },
    body: `${method} ${path}`,
  };
};
