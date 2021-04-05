import nodemailer from 'nodemailer'

// console.log({
//     GMAIL_USER: process.env['GMAIL_USER'],
//     GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
// })
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

interface IMailOptions {
    from?: string;
    to: string;
    subject: string;
    text: string;
};
const sendMail = async (mailOptions: IMailOptions) => {
    mailOptions.from = process.env.GMAIL_USER
    const info = await transporter.sendMail(mailOptions);
    return info
}

export default sendMail