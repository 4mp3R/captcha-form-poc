#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { BackendStack } = require("./backend-stack");
const { FrontendStack } = require("./frontend-stack");

const stackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "eu-central-1",
  },
};

const app = new cdk.App();
new BackendStack(app, "CaptchaFormPocBackendStack", stackProps);
new FrontendStack(app, "CaptchaFormPocFrontendStack", stackProps);
