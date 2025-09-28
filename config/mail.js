import nodemailer from 'nodemailer';

// This function configures and creates a reusable transporter object using the SMTP transport.
// It pulls the necessary credentials (host, port, user, and password) from your .env file,
// keeping your sensitive information secure and separate from the source code.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // `true` for port 465, `false` for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password from .env
  },
});

export default transporter;