const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587, // or 587
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Book store" <computereng021@gmail.com>`,
      to: email,
      subject: subject,
      text: `Your OTP is: ${text}`,
      html: `
        <h3>We received a request to reset the password for your account. To proceed with the password reset, please use the One-Time Password (OTP) below:</h3>
        <p style="font-size: 1.5em; font-weight: bold; background-color: #f0f0f0; padding: 10px; width: max-content; border-radius: 4px;">
          Your OTP is: <span style="color: #007bff;">${text}</span>
        </p>
        <h3>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team immediately.</h3>
        <h3>Thank you,<br />
        Ahmad Alsafoty E-commerce<br />
        Email: computereng021@gmail.com</h3>
      `,
    });

    console.log(info.response);
    return info;
  } catch (error) {
    console.error("Email not sent:", error);
    throw error;
  }
};
module.exports = sendEmail;
