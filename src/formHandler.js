exports.handler = async function (event, context) {
  const { path, method } = event.requestContext.http;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
    },
    body: `${method} ${path}`,
  };
};
