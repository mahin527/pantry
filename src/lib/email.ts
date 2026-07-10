import nodemailer from "nodemailer"
import { env } from "./env"

function createTransporter() {
  const host = env.EMAIL_HOST
  const port = Number(env.EMAIL_PORT) || 587
  const secure = env.EMAIL_SECURE === "true"
  const user = env.EMAIL_USER
  const pass = env.EMAIL_PASSWORD

  // If email credentials are not configured, return null (email sending is optional)
  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const transporter = createTransporter()

  if (!transporter) {
    // Email not configured — log generic warning without exposing reset URL/token
    console.warn("Email service not configured. Password reset email was not sent.")
    return
  }

  const from = env.EMAIL_FROM || "noreply@pantry.com"

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#2563eb;padding:32px 24px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Pantry</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Password Reset</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="margin:0 0 12px;color:#1f2937;font-size:18px;">Hello,</h2>
              <p style="margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.6;">
                We received a request to reset your Pantry account password. Click the button below to set a new password.
              </p>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                This link will expire in <strong>1 hour</strong>. If you didn't request this, please ignore this email.
              </p>
              <!-- Reset Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td align="center" style="background-color:#2563eb;border-radius:8px;">
                    <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
                Or copy and paste this link in your browser:<br />
                <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9fafb;padding:16px 24px;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">&copy; ${new Date().getFullYear()} Pantry. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"Pantry" <${from}>`,
    to: email,
    subject: "Reset Your Pantry Password",
    html,
  })
}

export async function sendOtpEmail(email: string, otp: number): Promise<void> {
  const transporter = createTransporter()

  if (!transporter) {
    console.warn("Email service not configured. OTP email was not sent for:", email)
    return
  }

  const from = env.EMAIL_FROM || "noreply@pantry.com"

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td align="center" style="background-color:#2563eb;padding:32px 24px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Pantry</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Email Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;text-align:center;">
              <h2 style="margin:0 0 12px;color:#1f2937;font-size:18px;">Verify Your Email</h2>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                Use the OTP below to verify your email address. This code expires in <strong>10 minutes</strong>.
              </p>
              <div style="background-color:#f3f4f6;border-radius:12px;padding:24px;margin:0 auto 24px;display:inline-block;">
                <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#2563eb;">${otp}</span>
              </div>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
                If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:#f9fafb;padding:16px 24px;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">&copy; ${new Date().getFullYear()} Pantry. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: `"Pantry" <${from}>`,
    to: email,
    subject: "Verify Your Pantry Email",
    html,
  })
}
