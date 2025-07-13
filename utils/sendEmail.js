require("dotenv").config();
const nodemailer = require("nodemailer");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("./CustomError");


exports.sendEmail = asyncHandler(async (options) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD,
    },
  });
  let message = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

    await transporter.sendMail(message);
    console.log(`email has sent successfuly to ${message.to}`);

 

});
