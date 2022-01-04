require("dotenv").config();
const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

module.exports = {
  send: (from, to, subject, text) => {
    // Setup e-mail data.
    const options = {
      from,
      to,
      subject,
      text,
    };

    // Return a promise of the function that sends the email.
    return transporter.sendMail(options, function (err, data) {
      if (err) {
        console.log("Error");
      } else {
        console.log("Email sent successfully");
      }
    });
  },
};
