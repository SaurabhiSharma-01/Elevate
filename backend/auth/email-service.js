/* ============================================================
   ELEVATE — Email Service
   Sends student login credentials via nodemailer.
   Falls back to console logging if SMTP is not configured.
   ============================================================ */

'use strict';

const nodemailer = require('nodemailer');

// ─── Transporter Setup ────────────────────────────────────────────────────────

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('[Email] ⚠️  EMAIL_USER / EMAIL_PASS not set in .env — emails will be logged to console only.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
}

// ─── Templates ────────────────────────────────────────────────────────────────

/**
 * Generate the student welcome email HTML body.
 */
function buildStudentCredentialEmail({ name, username, password, loginUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fa; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1f3c 0%, #2d3561 100%); padding: 36px 40px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 4px; }
    .logo span { color: #4f9cf9; }
    .tagline { color: #8ba3c7; font-size: 13px; letter-spacing: 2px; margin-top: 6px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 20px; font-weight: 700; color: #1a1f3c; margin-bottom: 12px; }
    .text { color: #5a6481; font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
    .cred-box { background: #f0f4ff; border: 1px solid #d0dcff; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; }
    .cred-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e0e8ff; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { font-size: 12px; color: #7a8aaa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .cred-value { font-size: 15px; color: #1a1f3c; font-weight: 700; font-family: monospace; }
    .btn { display: block; background: linear-gradient(135deg, #4f9cf9, #2d6ce8); color: #fff; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; margin-bottom: 24px; }
    .warning { background: #fff8e6; border-left: 4px solid #f5a623; border-radius: 6px; padding: 12px 16px; font-size: 13px; color: #8a6500; margin-bottom: 24px; }
    .footer { background: #f4f6fa; padding: 20px 40px; text-align: center; font-size: 12px; color: #9aa4bf; border-top: 1px solid #e8edf5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ELE<span>V</span>ATE</div>
      <div class="tagline">LEARN · GROW · RISE</div>
    </div>
    <div class="body">
      <div class="greeting">Welcome, ${name}! 🎓</div>
      <p class="text">
        Your college Training &amp; Placement cell has registered you on the <strong>Elevate</strong> platform. 
        Below are your login credentials to access your personalised career dashboard.
      </p>
      <div class="cred-box">
        <div class="cred-row">
          <span class="cred-label">Username (PRN)</span>
          <span class="cred-value">${username}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Temporary Password</span>
          <span class="cred-value">${password}</span>
        </div>
      </div>
      <a class="btn" href="${loginUrl}">Log In to Elevate →</a>
      <div class="warning">
        ⚠️ This is a system-generated temporary password. Please change it after your first login. Keep your credentials private.
      </div>
      <p class="text">
        If you face any issues logging in, contact your college T&amp;P office.
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Elevate Platform · Powered by Raisoni Group
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ─── Send Functions ───────────────────────────────────────────────────────────

/**
 * Send login credentials to a newly imported student.
 * @param {object} student  { name, email, prn, passingYear }
 * @param {string} username PRN
 * @param {string} password Plain-text generated password
 * @returns {Promise<boolean>} true if sent, false if console-only
 */
async function sendStudentCredentials(student, username, password) {
  const loginUrl = process.env.LOGIN_URL || 'http://localhost:5000/login';
  const fromAddress = process.env.EMAIL_FROM || 'Elevate Platform <noreply@elevate.com>';

  const html = buildStudentCredentialEmail({
    name: student.name,
    username,
    password,
    loginUrl,
  });

  const mailOptions = {
    from: fromAddress,
    to: student.email,
    subject: '🎓 Your Elevate Platform Login Credentials',
    html,
  };

  const tp = getTransporter();

  if (!tp) {
    // Console fallback — useful in development when SMTP is not configured
    console.log('\n[Email] ──────────────────────────────────────────────────────');
    console.log(`[Email] TO      : ${student.email}`);
    console.log(`[Email] SUBJECT : ${mailOptions.subject}`);
    console.log(`[Email] USERNAME: ${username}`);
    console.log(`[Email] PASSWORD: ${password}`);
    console.log(`[Email] LOGIN   : ${loginUrl}`);
    console.log('[Email] ──────────────────────────────────────────────────────\n');
    return false;
  }

  try {
    await tp.sendMail(mailOptions);
    console.log(`[Email] ✅ Credentials sent to ${student.email}`);
    return true;
  } catch (err) {
    console.error(`[Email] ❌ Failed to send to ${student.email}:`, err.message);
    return false;
  }
}

module.exports = { sendStudentCredentials };
