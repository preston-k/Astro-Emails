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
  console.log("1. received request")
  try {
    const data = await context.request.formData()
    const sendto = data.get('sendto')?.toString()
    const subject = data.get('subject')?.toString()
    const content = data.get('content')?.toString()
    const html = data.get('html')?.toString()
    console.log("2. got form data successfully")

    if (!sendto || !subject || !content) {
      console.log("3a. fields are missing")
      return new Response('Missing required fields', { status: 400 })
    }

    console.log("3b. sending...")
    await transport.sendMail({
      subject,
      text: content,
      to: sendto,
      from: 'noreply@prestonkwei.com',
      html,
      bcc: 'bcc-emaillogs-us-east-2@prestonkwei.com'
    })
    console.log("4b. sent email!")

    return new Response('Email sent successfully!', { status: 200 })
  } catch (error) {
    console.log("4c. didn't send!")
    console.error('Error sending email:', error)
    return new Response('Internal Server Error', { status: 500 })
  } finally {
    console.log("5. executed finally branch")
  }
}
