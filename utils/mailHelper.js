const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
})

const MailHelper = {};

MailHelper.sendMail = async (emailContent) => {
    message = {
        from: emailContent.from || process.env.MAIL_FROM_ADDRESS,
        to: emailContent.to,
        subject: emailContent.subject,
        text: emailContent.body
   }
   transporter.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    })
}

module.exports = MailHelper;