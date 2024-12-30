// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// require("dotenv").config();

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
async function handler(req, res) {
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
  await transporter.sendMail({
    from: `"DentistTest" <${process.env.EMAIL_USER}>`,
    to: req.to,
    subject: req.subject,
    html: req.text,
  });

  res.status(200).json({ success: true });
}

export default handler;
