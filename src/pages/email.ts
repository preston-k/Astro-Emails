import type { APIContext } from 'astro'
import { createTransport } from 'nodemailer'

const config = {
  host: import.meta.env.NODEMAIL_HOST,
  port: +import.meta.env.NODEMAIL_PORT,
  secure: +import.meta.env.NODEMAIL_PORT === 465,
  auth: {
    user: import.meta.env.NODEMAIL_USER,
    pass: import.meta.env.NODEMAIL_PASSWORD
  }
}

const transport = createTransport(config)

export async function POST(context: APIContext) {
  try {
    const data = await context.request.formData()
    const sendto = data.get('sendto')?.toString()
    const subject = data.get('subject')?.toString()
    const content = data.get('content')?.toString()
    const html = data.get('html')?.toString()

    if (!sendto || !subject || !content) {
      return new Response('Missing required fields', { status: 400 })
    }

    await transport.sendMail({
      subject,
      text: content,
      to: sendto,
      from: 'noreply@prestonkwei.com',
      html
    })

    return new Response('Email sent successfully!', { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
