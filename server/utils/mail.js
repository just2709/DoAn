const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  // 1, Create a transporter
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  // 2, Define the email options
  const mailOptions = {
    from: "Just <just27092001@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3, Send mail
  return transport.sendMail(mailOptions);
};

module.exports = sendEmail;
