import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

/**
 * Send an OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - One-time password to send
 * @returns {Promise<boolean>} - Returns true if sent successfully
 */
export const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
          <h2 style="color: #333; text-align: center;">Your Login OTP</h2>
          <p style="color: #666; line-height: 1.6;">Use the following OTP to login to your account. This OTP will expire in 5 minutes.</p>
          <h1 style="color: #4F46E5; letter-spacing: 5px; font-size: 32px; text-align: center; padding: 20px; background: #f8f8f8; border-radius: 4px;">${otp}</h1>
          <p style="color: #666; line-height: 1.6;">If you didn't request this OTP, please ignore this email.</p>
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <small style="color: #999;">This is an automated message, please do not reply.</small>
          </div>
        </div>
      `,
      text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes. If you didn't request this OTP, please ignore this email.`,
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default { sendOTP };
