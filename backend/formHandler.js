const https = require("https");
const querystring = require("querystring");
const AWS = require("aws-sdk");
const env = require("./env.json");

function isReCaptchaSuccessful(reCaptchaResponse) {
  const postData = querystring.stringify({
    secret: env.reCaptchaSecretKey,
    response: reCaptchaResponse,
  });
  const options = {
    hostname: "www.google.com",
    port: 443,
    path: "/recaptcha/api/siteverify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      response.on("data", (chunk) => {
        const { success } = JSON.parse(chunk.toString());
        resolve(success === true);
      });
      response.on("error", reject);
    });
    request.write(postData);
    request.end();
  });
}

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

  let message, reCaptchaResponse;
  try {
    const payload = JSON.parse(body);
    message = payload.message;
    reCaptchaResponse = payload.reCaptchaResponse;
  } catch (_) {}

  if (!message || !reCaptchaResponse) {
    return {
      statusCode: 400,
    };
  }

  const reCaptchaSuccess = await isReCaptchaSuccessful(reCaptchaResponse);

  if (!reCaptchaSuccess) {
    return {
      statusCode: 401,
    };
  }

  const dbClient = new AWS.DynamoDB.DocumentClient();
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  await dbClient
    .put({
      TableName: process.env.contactRequestTableName,
      Item: {
        id,
        message,
        createdAt: new Date().toISOString(),
      },
    })
    .promise();

  const responseBody = JSON.stringify({ id });
  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": responseBody.length,
      "Access-Control-Allow-Origin": "*",
    },
    body: responseBody,
  };
};
