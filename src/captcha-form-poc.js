#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { CaptchaFormPocStack } = require("./captcha-form-poc-stack");

const app = new cdk.App();
new CaptchaFormPocStack(app, "CaptchaFormPocStack");
