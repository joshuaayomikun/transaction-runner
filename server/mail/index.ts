import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

// console.log({
//     GMAIL_USER: process.env['GMAIL_USER'],
//     GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
// })
let transporter: Mail;
if(process.env.MAIL_SERVICE?.toLowerCase() === 'gmail'){
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })
} else {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT as string),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        })
}

interface IMailOptions {
    from?: string;
    to: string;
    subject: string;
    text: string;
};
const sendMail = async (mailOptions: IMailOptions) => {
    // console.log({USE_MAIL: process.env.USE_MAIL})
    if(process.env.USE_MAIL?.toLowerCase() === 'yes'){
        if(typeof mailOptions.from === "undefined" || mailOptions.from === ""){
            mailOptions.from = process.env.MAIL_USER
        }
        const info = await transporter.sendMail(mailOptions);
        return info
    }
}

export default sendMail