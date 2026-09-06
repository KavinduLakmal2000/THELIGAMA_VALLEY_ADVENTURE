const test = require("node:test");
const assert = require("node:assert/strict");

const emailService = require("../services/emailService");
const {
  isValidBookingTransition,
  BOOKING_STATUS_TRANSITIONS,
  normalizeSelectedActivityIds,
  isValidBookingDate,
} = require("../models/Booking");

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

test("multiple selected activities are normalized and deduplicated", () => {
  assert.deepEqual(normalizeSelectedActivityIds(["a1", "b2", "a1", "c3"]), ["a1", "b2", "c3"]);
  assert.deepEqual(normalizeSelectedActivityIds(["", null, undefined, "d4"]), ["d4"]);
  assert.deepEqual(normalizeSelectedActivityIds([]), []);
});

test("booking dates remain calendar-only values and reject malformed input", () => {
  assert.equal(isValidBookingDate("2026-09-15"), true);
  assert.equal(isValidBookingDate("2026-09-01"), true);
  assert.equal(isValidBookingDate("2026-09-30"), true);
  assert.equal(isValidBookingDate("2024-02-29"), true);

  assert.equal(isValidBookingDate("15/09/2026"), false);
  assert.equal(isValidBookingDate("09-15-2026"), false);
  assert.equal(isValidBookingDate("abc"), false);
  assert.equal(isValidBookingDate(undefined), false);
  assert.equal(isValidBookingDate(null), false);
  assert.equal(isValidBookingDate("2026-02-29"), false);
  assert.equal(isValidBookingDate("2026-02-30"), false);
  assert.equal(isValidBookingDate("2026-13-15"), false);
});
