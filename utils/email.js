// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME  ,
            pass: process.env.EMAIL_PASSWORD
        }

        //LESS SECURE APP option in gmail
        
    })

    //define email option
    const mailOptions = {
        from: 'Arya Pathak <arya@natours.io>',
        to: options.email,
        subject: options.subject,
        text: options.text,
    }

    //send email

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;