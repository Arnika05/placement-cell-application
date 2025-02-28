import nodemailer from "nodemailer"
import handlebars from "handlebars"
import { string } from "zod"
import toast from "react-hot-toast"

export const sendMail = async ({
    to, name, subject, body, 
} :{
    to: string
    name: string
    subject: string
    body: string
}) => {
    const { SMTP_PASSWORD, SMTP_EMAIL } = process.env

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    })

    try {
        const textResult = await transport.verify()
        console.log(textResult)
    } catch (error) {
        console.log(error)
        toast.error((error as Error)?.message)
        return
    }

    try {
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body,
        })
        return sendResult
    } catch (error) {
        console.log(error)
        toast.error((error as Error)?.message)
        return
    }
}

