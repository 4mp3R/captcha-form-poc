const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const CaptchaFormPoc = require('../lib/captcha-form-poc-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CaptchaFormPoc.CaptchaFormPocStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
