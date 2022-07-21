import nodemailer from "nodemailer";

export default class MailService{
    static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_POST,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })

    static async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.CLIENT_URL,
            text: '',
            html: 
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">Активировать</a>
                    </div>
                `

        });
    }
}