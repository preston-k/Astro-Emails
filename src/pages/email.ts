import type { APIContext } from 'astro'
import { createTransport } from "nodemailer"

const config = {
  host: import.meta.env.NODEMAIL_HOST,
  port: +import.meta.env.NODEMAIL_PORT,
  secure: import.meta.env.NODEMAIL_PORT == "465",
  auth: {
    user: import.meta.env.NODEMAIL_USER,
    pass: import.meta.env.NODEMAIL_PASSWORD
  }
}

const transport = createTransport(config)

export async function POST(context: APIContext) {
  const data = await context.request.formData()
  const sendto = data.get("sendto")?.toString()
  const subject = data.get("subject")?.toString()
  const content = data.get("content")?.toString()
  const html = data.get("html")?.toString()
  await transport.sendMail({
    subject: subject,
    text: content,
    to: sendto,
    from: "noreply@prestonkwei.com",
    html: html
  })

  return new Response('Email sent sucessfully! TO: '+sendto+'SUB: '+subject+'CONT: '+content)
}

