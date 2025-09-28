import transporter from '../config/mail.js';

/**
 * @description A centralized utility for sending emails.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text body of the email.
 * @param {Array} [attachments] - An optional array of attachment objects for Nodemailer.
 */
export const sendEmail = async (to, subject, text, attachments = []) => {
  try {
    const mailOptions = {
      from: `"TrustX Service Center" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    // In a real application, you might add more robust error handling,
    // like sending the error to a logging service.
  }
};



/*import transporter from '../config/mail.js';

const sendEmail = async (to, subject, text, attachments = []) => {
  try {
    await transporter.sendMail({
      from: `"Vehicle Service Center" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;*/