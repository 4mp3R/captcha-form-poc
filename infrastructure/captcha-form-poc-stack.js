const cdk = require("@aws-cdk/core");
const apiGateway = require("@aws-cdk/aws-apigatewayv2");
const lambda = require("@aws-cdk/aws-lambda");

class CaptchaFormPocStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = new lambda.Function(this, "ContactRequestHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("src"),
      handler: "formHandler.handler",
    });

    const apiIntegration = new apiGateway.LambdaProxyIntegration({
      handler,
    });

    const httpApi = new apiGateway.HttpApi(this, "Contact API");
    httpApi.addRoutes({
      path: "/",
      methods: [apiGateway.HttpMethod.ANY],
      integration: apiIntegration,
    });
  }
}

module.exports = { CaptchaFormPocStack };
