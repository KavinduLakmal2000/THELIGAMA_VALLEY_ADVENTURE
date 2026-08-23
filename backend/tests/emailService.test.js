const test = require("node:test");
const assert = require("node:assert/strict");

const emailService = require("../services/emailService");
const { isValidBookingTransition, BOOKING_STATUS_TRANSITIONS } = require("../models/Booking");

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

test("booking workflow allows only the new valid transitions", () => {
  assert.equal(isValidBookingTransition("pending", "payment_pending"), true);
  assert.equal(isValidBookingTransition("pending", "rejected"), true);
  assert.equal(isValidBookingTransition("payment_pending", "confirmed"), true);
  assert.equal(isValidBookingTransition("pending", "confirmed"), false);
  assert.equal(isValidBookingTransition("payment_pending", "payment_pending"), false);
  assert.equal(isValidBookingTransition("confirmed", "rejected"), false);
  assert.deepEqual(BOOKING_STATUS_TRANSITIONS.pending, ["payment_pending", "rejected"]);
  assert.deepEqual(BOOKING_STATUS_TRANSITIONS.payment_pending, ["confirmed"]);
});
