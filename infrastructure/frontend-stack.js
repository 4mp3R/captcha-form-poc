const fs = require("fs");

const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3Deployment = require("@aws-cdk/aws-s3-deployment");
const ssm = require("@aws-cdk/aws-ssm");

class FrontendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const httpApiEndpoint = ssm.StringParameter.valueFromLookup(
      this,
      "CaptchaFormPocHttpApiEndpoint"
    );
    const websiteTemplate = fs
      .readFileSync("./frontend/index.html.template")
      .toString();
    const compiledWebsiteTemplate = websiteTemplate.replace(
      "{{ CONTACT_REQUEST_ENDPOINT }}",
      httpApiEndpoint
    );
    fs.writeFileSync("./frontend/index.html", compiledWebsiteTemplate);

    const bucket = new s3.Bucket(this, "StaticWebsiteBucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });
    new s3Deployment.BucketDeployment(this, "DeployStaticWebsite", {
      sources: [s3Deployment.Source.asset("./frontend")],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, "websiteUrl", {
      value: bucket.bucketWebsiteUrl,
    });
  }
}

module.exports = { FrontendStack };
