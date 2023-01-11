const nodemailer = require('nodemailer');

async function send_email(data) {

    const config_transport = {
        service: 'gmail',
        auth: {
            user: process.env.user_email,
            pass: process.env.password_email
        }
    }

    const transporter = nodemailer.createTransport(config_transport)

    const mail_option = {
        from: process.env.user_email,
        to: data.email,
        subject: 'REGISTRATION SUCCESS',
        text: `${data.code}`
    }

    let my_result = await transporter.sendMail(mail_option)
    return my_result

}


module.exports = { send_email }

