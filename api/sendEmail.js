import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  const { to, subject, text } = req.body;

  // Ensure the method is POST
  if (req.method !== "post") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!to) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  // Nodemailer configuration
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"DentistTest" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: text,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
