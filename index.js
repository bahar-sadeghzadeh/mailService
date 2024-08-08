const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

async function sendEmail(to, subject, text) {
  // First, define send settings by creating a new transporter:
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

  // Define and send message inside transporter.sendEmail() and await info about send from promise:
  let info = await transporter.sendMail({
    from: `"DentistTest" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: text,
  });

  // Random ID generated after successful send (optional)
  console.log(info.messageId);
}

app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;

  sendEmail(to, subject, text).catch((err) => console.log("error: ", err));
});

app.listen(port, () => {
  console.log(`user email: ${process.env.EMAIL_USER}`);
  console.log(`Server running on port ${port}`);
});
