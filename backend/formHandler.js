const AWS = require("aws-sdk");

exports.handler = async function (event, context) {
  const { body, requestContext } = event;
  const { path, method } = requestContext.http;

  if (!["OPTIONS", "POST"].includes(method)) {
    return {
      statusCode: 400,
    };
  }

  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
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

  const dbClient = new AWS.DynamoDB.DocumentClient();
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
      "Access-Control-Allow-Origin": "*",
    },
    body: `${method} ${path}`,
  };
};
