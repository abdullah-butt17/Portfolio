const nodemailer = require('nodemailer');

const sendContactEmail = async ({
  recipient,
  name,
  email,
  subject,
  message,
}) => {
  if (!recipient) {
    throw new Error('Admin profile email is not configured.');
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail email configuration is missing.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: subject
      ? `Portfolio Contact: ${subject}`
      : `New Portfolio Contact from ${name}`,

    text: `
You received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}
    `.trim(),

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Portfolio Contact</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject'}</p>

        <hr />

        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  });
};

module.exports = { sendContactEmail };