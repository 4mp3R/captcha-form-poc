const cdk = require("@aws-cdk/core");
const apiGateway = require("@aws-cdk/aws-apigatewayv2");
const lambda = require("@aws-cdk/aws-lambda");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const ssm = require("@aws-cdk/aws-ssm");

class BackendStack extends cdk.Stack {
  httpApiEndpoint;

  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = new lambda.Function(this, "ContactRequestHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("backend"),
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

    const contactRequestsTable = new dynamodb.Table(this, "ContactRequestsDB", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });
    contactRequestsTable.grantReadWriteData(handler);
    handler.addEnvironment(
      "contactRequestTableName",
      contactRequestsTable.tableName
    );

    new ssm.StringParameter(this, "CaptchaFormPocHttpApiEndpoint", {
      type: ssm.ParameterType.STRING,
      stringValue: httpApi.url,
      parameterName: "CaptchaFormPocHttpApiEndpoint",
    });

    new cdk.CfnOutput(this, "httpApiEndpoint", {
      value: httpApi.url,
    });
  }
}

module.exports = { BackendStack };
