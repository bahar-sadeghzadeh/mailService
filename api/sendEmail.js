import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  // Handle CORS preflight `OPTIONS` request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Allowed methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allowed headers
    return res.status(200).end(); // End response for preflight request
  }

  // Handle `POST` request
  if (req.method === "POST") {
    const { to, subject, text } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    // Nodemailer setup
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DentistTest" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: text,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully", info });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    // Return 405 for unsupported methods
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow CORS for unsupported methods too
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
