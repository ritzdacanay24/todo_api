const nodemailer = require('nodemailer');
const config = require('config');

const sendEmail = async (mailOptions) => {

    let smtpTransport = nodemailer.createTransport({
        service: config.email.service,
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        auth: {
            // type: 'OAuth2',
            user: config.email.user,
            pass: config.email.pass,
            clientId: config.email.clientId,
            clientSecret: config.email.clientSecret,
            refreshToken: config.email.refreshToken,
            accessToken: config.email.accessToken
        }
    });

    smtpTransport.sendMail(mailOptions);
    
};

exports.sendEmail = sendEmail;
