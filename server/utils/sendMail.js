const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "quangthoi601@gmail.com",
      pass: "kmctfdmousvqftpk",
    },
  });
  const mailOptions = {
    from: "Just <quangthoi601@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
