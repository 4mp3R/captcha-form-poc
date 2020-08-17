const cdk = require("@aws-cdk/core");

class CaptchaFormPocStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
  }
}

module.exports = { CaptchaFormPocStack };
