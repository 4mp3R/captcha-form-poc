#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { BackendStack } = require("./backend-stack");
const { FrontendStack } = require("./frontend-stack");
const env = require("../env.json");

const stackProps = {
  env: {
    account: env.cdkDefaultAccount,
    region: env.awsRegion,
  },
};

const app = new cdk.App();
new BackendStack(app, "CaptchaFormPocBackendStack", stackProps);
new FrontendStack(app, "CaptchaFormPocFrontendStack", stackProps);
