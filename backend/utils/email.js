const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `ABSENCE <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text
  };

  return await transporter.sendMail(mailOptions);
};

const replaceVariables = (template, variables) => {
  let content = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, variables[key]);
  });
  return content;
};

module.exports = { sendEmail, replaceVariables };
