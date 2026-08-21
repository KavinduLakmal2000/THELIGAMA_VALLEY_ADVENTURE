const validator = require("validator");
const { Resend } = require("resend");

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY ? sanitizeText(process.env.RESEND_API_KEY) : "";

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function sanitizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return sanitizeText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getEmailFrom() {
  return process.env.EMAIL_FROM ? sanitizeText(process.env.EMAIL_FROM) : "";
}

function isValidEmail(value) {
  const email = sanitizeText(value).toLowerCase();
  if (!email) return false;
  return validator.isEmail(email);
}

async function sendEmail({ to, subject, text, html }) {
  const emailFrom = getEmailFrom();

  if (!emailFrom) {
    throw new Error("Email sender is not configured. Set EMAIL_FROM.");
  }

  const resend = getResendClient();
  if (!resend) {
    throw new Error("Resend API key is missing. Set RESEND_API_KEY.");
  }

  const recipient = sanitizeText(to);
  if (!recipient || !isValidEmail(recipient)) {
    throw new Error("A valid recipient email is required.");
  }

  const payload = {
    from: emailFrom,
    to: [recipient],
    subject: sanitizeText(subject || ""),
    text: typeof text === "string" ? text : "",
    html: typeof html === "string" ? html : "",
  };

  console.log("📧 Sending email via Resend...");

  try {
    const response = await resend.emails.send(payload);

    if (response && response.error) {
      const errorMessage = response.error?.message || "Unknown Resend error";
      throw new Error(`Resend email failed: ${errorMessage}`);
    }

    if (!response || !response.data || !response.data.id) {
      throw new Error("Resend email failed: no response data returned.");
    }

    console.log("✅ Resend email queued successfully");
    return response;
  } catch (error) {
    const message = error && error.message ? error.message : "Unknown Resend send error";
    console.error("❌ Resend email send failed:", message);
    throw new Error(`Resend email failed: ${message}`);
  }
}

async function sendBookingConfirmedEmail(booking) {
  if (!booking || !booking.email) {
    throw new Error("Booking email is required for confirmation email.");
  }

  const customerName = sanitizeText(booking.name || "Guest");
  const activity = sanitizeText(booking.activity || "Your booking");
  const date = sanitizeText(booking.date || "");
  const slot = sanitizeText(booking.slot || "");
  const guests = Number(booking.guests || 1);
  const total = Number(booking.total || 0);
  const companyEmail = process.env.COMPANY_EMAIL ? sanitizeText(process.env.COMPANY_EMAIL) : "";
  const adminNote = sanitizeText(booking.adminNote || "");

  const text = [
    `Hi ${customerName},`,
    "",
    "We are pleased to confirm your booking.",
    "",
    `Activity: ${activity}`,
    `Date: ${date}`,
    `Time: ${slot}`,
    `Guests: ${guests}`,
    `Total: LKR ${total.toLocaleString()}`,
    booking.message ? `Notes: ${sanitizeText(booking.message)}` : "Notes: None",
    adminNote ? `Additional note: ${adminNote}` : "",
    "",
    "Our team will contact you with more details soon.",
    companyEmail ? `Questions? Contact ${companyEmail}.` : "",
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px; color: #0f172a;">Booking confirmed</h2>
      <p>Hi <strong>${escapeHtml(customerName)}</strong>,</p>
      <p>We are pleased to confirm your booking.</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p><strong>Activity:</strong> ${escapeHtml(activity)}</p>
        <p><strong>Date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(slot)}</p>
        <p><strong>Guests:</strong> ${escapeHtml(String(guests))}</p>
        <p><strong>Total:</strong> LKR ${escapeHtml(String(total.toLocaleString()))}</p>
      </div>
      <p><strong>Notes:</strong> ${escapeHtml(booking.message || "No additional notes provided.")}</p>
      ${adminNote ? `<p><strong>Additional note:</strong> ${escapeHtml(adminNote)}</p>` : ""}
      <p>Our team will contact you with more details soon.</p>
      ${companyEmail ? `<p>Questions? Contact <a href="mailto:${escapeHtml(companyEmail)}">${escapeHtml(companyEmail)}</a>.</p>` : ""}
    </div>
  `;

  return sendEmail({
    to: booking.email,
    subject: "Your booking has been confirmed",
    text,
    html,
  });
}

async function sendBookingRejectedEmail(booking) {
  if (!booking || !booking.email) {
    throw new Error("Booking email is required for rejection email.");
  }

  const customerName = sanitizeText(booking.name || "Guest");
  const activity = sanitizeText(booking.activity || "Your booking");
  const date = sanitizeText(booking.date || "");
  const slot = sanitizeText(booking.slot || "");
  const guests = Number(booking.guests || 1);
  const total = Number(booking.total || 0);
  const companyEmail = process.env.COMPANY_EMAIL ? sanitizeText(process.env.COMPANY_EMAIL) : "";
  const adminNote = sanitizeText(booking.adminNote || "");

  const text = [
    `Hi ${customerName},`,
    "",
    "We are sorry to inform you that your booking was not accepted.",
    "",
    `Activity: ${activity}`,
    `Date: ${date}`,
    `Time: ${slot}`,
    `Guests: ${guests}`,
    `Total: LKR ${total.toLocaleString()}`,
    booking.message ? `Notes: ${sanitizeText(booking.message)}` : "Notes: None",
    adminNote ? `Additional note: ${adminNote}` : "",
    "",
    "If you would like to discuss alternatives, please contact us directly.",
    companyEmail ? `Questions? Contact ${companyEmail}.` : "",
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px; color: #0f172a;">Booking update</h2>
      <p>Hi <strong>${escapeHtml(customerName)}</strong>,</p>
      <p>We are sorry to inform you that your booking was not accepted.</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p><strong>Activity:</strong> ${escapeHtml(activity)}</p>
        <p><strong>Date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(slot)}</p>
        <p><strong>Guests:</strong> ${escapeHtml(String(guests))}</p>
        <p><strong>Total:</strong> LKR ${escapeHtml(String(total.toLocaleString()))}</p>
      </div>
      <p><strong>Notes:</strong> ${escapeHtml(booking.message || "No additional notes provided.")}</p>
      ${adminNote ? `<p><strong>Additional note:</strong> ${escapeHtml(adminNote)}</p>` : ""}
      <p>If you would like to discuss alternatives, please contact us directly.</p>
      ${companyEmail ? `<p>Questions? Contact <a href="mailto:${escapeHtml(companyEmail)}">${escapeHtml(companyEmail)}</a>.</p>` : ""}
    </div>
  `;

  return sendEmail({
    to: booking.email,
    subject: "Your booking was rejected",
    text,
    html,
  });
}

async function sendNewBookingNotification(booking) {
  // implemented below after sendBookingReceivedEmail
  if (!booking) throw new Error("Booking is required for company notification.");
  const companyEmail = process.env.COMPANY_EMAIL ? sanitizeText(process.env.COMPANY_EMAIL) : "";
  if (!companyEmail) throw new Error("COMPANY_EMAIL is not configured.");

  const customerName = sanitizeText(booking.name || "Guest");
  const activity = sanitizeText(booking.activity || "");
  const date = sanitizeText(booking.date || "");
  const slot = sanitizeText(booking.slot || "");
  const guests = Number(booking.guests || 1);
  const total = Number(booking.total || 0);
  const phone = sanitizeText(booking.phone || "");
  const email = sanitizeText(booking.email || "");

  const text = [
    `New booking received and pending confirmation.`,
    "",
    `Customer: ${customerName}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    "",
    `Activity: ${activity}`,
    `Date: ${date}`,
    `Time: ${slot}`,
    `Guests: ${guests}`,
    `Total: LKR ${total.toLocaleString()}`,
    booking.message ? `Notes: ${sanitizeText(booking.message)}` : "Notes: None",
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px; color: #0f172a;">New booking — Pending confirmation</h2>
      <p>A new booking has been received and is waiting for admin confirmation.</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p><strong>Customer:</strong></p>
        <p>Name: ${escapeHtml(customerName)}</p>
        <p>Email: ${escapeHtml(email)}</p>
        ${phone ? `<p>Phone: ${escapeHtml(phone)}</p>` : ""}
        <hr />
        <p><strong>Booking details:</strong></p>
        <p>Activity: ${escapeHtml(activity)}</p>
        <p>Date: ${escapeHtml(date)}</p>
        <p>Time: ${escapeHtml(slot)}</p>
        <p>Guests: ${escapeHtml(String(guests))}</p>
        <p>Total: LKR ${escapeHtml(String(total.toLocaleString()))}</p>
      </div>
      <p><strong>Notes:</strong> ${escapeHtml(booking.message || "No additional notes provided.")}</p>
      <p>Please open the admin dashboard to review and confirm or reject the booking.</p>
    </div>
  `;

  return sendEmail({
    to: companyEmail,
    subject: "New Booking — Pending Confirmation",
    text,
    html,
  });
}

async function sendBookingReceivedEmail(booking) {
  if (!booking || !booking.email) throw new Error("Booking email is required for received email.");

  const customerName = sanitizeText(booking.name || "Guest");
  const activity = sanitizeText(booking.activity || "");
  const date = sanitizeText(booking.date || "");
  const slot = sanitizeText(booking.slot || "");
  const guests = Number(booking.guests || 1);
  const total = Number(booking.total || 0);
  const companyEmail = process.env.COMPANY_EMAIL ? sanitizeText(process.env.COMPANY_EMAIL) : "";

  const text = [
    `Hi ${customerName},`,
    "",
    "We have received your booking request.",
    "",
    "Your booking is currently pending confirmation. Our team will review it and send you another email once your booking has been confirmed or rejected.",
    "",
    `Activity: ${activity}`,
    `Date: ${date}`,
    `Time: ${slot}`,
    `Guests: ${guests}`,
    `Total: LKR ${total.toLocaleString()}`,
    booking.message ? `Notes: ${sanitizeText(booking.message)}` : "Notes: None",
    "",
    companyEmail ? `Questions? Contact ${companyEmail}.` : "",
  ].filter(Boolean).join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px; color: #0f172a;">Booking Received</h2>
      <p>Hi <strong>${escapeHtml(customerName)}</strong>,</p>
      <p>We have received your booking request.</p>
      <p>Your booking is currently <strong>pending confirmation</strong>. Our team will review it and send you another email once your booking has been confirmed or rejected.</p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p><strong>Activity:</strong> ${escapeHtml(activity)}</p>
        <p><strong>Date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Time:</strong> ${escapeHtml(slot)}</p>
        <p><strong>Guests:</strong> ${escapeHtml(String(guests))}</p>
        <p><strong>Total:</strong> LKR ${escapeHtml(String(total.toLocaleString()))}</p>
      </div>
      <p><strong>Notes:</strong> ${escapeHtml(booking.message || "No additional notes provided.")}</p>
      ${companyEmail ? `<p>Questions? Contact <a href="mailto:${escapeHtml(companyEmail)}">${escapeHtml(companyEmail)}</a>.</p>` : ""}
    </div>
  `;

  return sendEmail({
    to: booking.email,
    subject: "Booking Received — Pending Confirmation",
    text,
    html,
  });
}

module.exports = {
  isValidEmail,
  sendEmail,
  sendBookingConfirmedEmail,
  sendBookingRejectedEmail,
  sendNewBookingNotification,
  sendBookingReceivedEmail,
};
