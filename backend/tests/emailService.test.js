const test = require("node:test");
const assert = require("node:assert/strict");

const emailService = require("../services/emailService");

delete process.env.RESEND_API_KEY;
delete process.env.EMAIL_FROM;

test("email transport fails with a clear Resend configuration error when env is missing", async () => {
  await assert.rejects(
    () => emailService.sendEmail({
      to: "customer@example.com",
      subject: "Hello",
      text: "Test",
      html: "<p>Test</p>",
    }),
    /RESEND_API_KEY|EMAIL_FROM/i
  );
});

test("email validation remains intact", () => {
  assert.equal(emailService.isValidEmail("customer@example.com"), true);
  assert.equal(emailService.isValidEmail("not-an-email"), false);
});
