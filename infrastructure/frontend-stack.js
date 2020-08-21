const fs = require("fs");
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3Deployment = require("@aws-cdk/aws-s3-deployment");
const ssm = require("@aws-cdk/aws-ssm");
const env = require("../env.json");

function prepareFrontendArtifacts(scope) {
  fs.rmdirSync("dist/frontend", { recursive: true });
  fs.mkdirSync("dist/frontend", { recursive: true });

  const httpApiEndpoint = ssm.StringParameter.valueFromLookup(
    scope,
    "CaptchaFormPocHttpApiEndpoint"
  );
  const compiledWebsiteTemplate = fs
    .readFileSync("frontend/index.html")
    .toString()
    .replace(/{CONTACT_REQUEST_ENDPOINT}/, httpApiEndpoint)
    .replace(/{RECAPTCHA_SITE_KEY}/g, env.reCaptchaSiteKey);
  fs.writeFileSync("dist/frontend/index.html", compiledWebsiteTemplate);
}

class FrontendStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    prepareFrontendArtifacts(this);

    const bucket = new s3.Bucket(this, "StaticWebsiteBucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });
    new s3Deployment.BucketDeployment(this, "DeployStaticWebsite", {
      sources: [s3Deployment.Source.asset("dist/frontend")],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, "websiteUrl", {
      value: bucket.bucketWebsiteUrl,
    });
  }
}

module.exports = { FrontendStack };
