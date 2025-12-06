import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'notifications@theluxshipping.com'

export type EmailTemplate = 
  | 'package_received'
  | 'shipment_update' 
  | 'invoice'
  | 'customs'
  | 'delivery'

interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  if (!resend) {
    console.error('Email service not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

export async function sendPackageReceivedEmail(
  to: string,
  data: {
    userName: string
    trackingNumber: string
    carrier: string
    receivedDate: string
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .info-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Package Received!</h1>
        </div>
        <div class="content">
          <p>Hi ${data.userName},</p>
          <p>Great news! We've received your package at our warehouse.</p>
          
          <div class="info-box">
            <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
            <p><strong>Carrier:</strong> ${data.carrier}</p>
            <p><strong>Received Date:</strong> ${data.receivedDate}</p>
          </div>
          
          <p>Your package is now safely stored in our warehouse. You can:</p>
          <ul>
            <li>Ship it immediately to your international address</li>
            <li>Wait and consolidate it with other packages (save on shipping!)</li>
            <li>Request photos or repackaging</li>
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/packages" class="button">View Package Details</a>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>TheLux Shipping - Your trusted international parcel forwarding service</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject: `Package Received: ${data.trackingNumber}`,
    html,
  })
}

export async function sendShipmentUpdateEmail(
  to: string,
  data: {
    userName: string
    trackingNumber: string
    status: string
    estimatedDelivery?: string
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .status-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
        .status { font-size: 24px; font-weight: bold; color: #667eea; text-transform: uppercase; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚢 Shipment Update</h1>
        </div>
        <div class="content">
          <p>Hi ${data.userName},</p>
          <p>Your shipment status has been updated:</p>
          
          <div class="status-box">
            <p class="status">${data.status.replace('_', ' ')}</p>
            <p><strong>Tracking:</strong> ${data.trackingNumber}</p>
            ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/shipments" class="button">Track Shipment</a>
          
          <p>We'll keep you updated as your package moves closer to you!</p>
        </div>
        <div class="footer">
          <p>TheLux Shipping - Your trusted international parcel forwarding service</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject: `Shipment Update: ${data.status.replace('_', ' ')}`,
    html,
  })
}

export async function sendInvoiceEmail(
  to: string,
  data: {
    userName: string
    invoiceId: string
    amount: number
    type: string
    dueDate: string
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .invoice-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 2px solid #667eea; }
        .amount { font-size: 36px; font-weight: bold; color: #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 New Invoice</h1>
        </div>
        <div class="content">
          <p>Hi ${data.userName},</p>
          <p>You have a new invoice ready for payment:</p>
          
          <div class="invoice-box">
            <p><strong>Invoice ID:</strong> ${data.invoiceId}</p>
            <p><strong>Type:</strong> ${data.type.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Amount Due:</strong></p>
            <p class="amount">$${data.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" class="button">Pay Invoice</a>
          
          <p>Please pay by the due date to avoid any service interruptions.</p>
        </div>
        <div class="footer">
          <p>TheLux Shipping - Your trusted international parcel forwarding service</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject: `New Invoice: $${data.amount.toFixed(2)} - ${data.type}`,
    html,
  })
}

export async function sendDeliveryEmail(
  to: string,
  data: {
    userName: string
    trackingNumber: string
    deliveryDate: string
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .success-box { background: white; padding: 30px; border-radius: 6px; margin: 20px 0; text-align: center; border: 2px solid #10b981; }
        .checkmark { font-size: 64px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 Package Delivered!</h1>
        </div>
        <div class="content">
          <p>Hi ${data.userName},</p>
          
          <div class="success-box">
            <div class="checkmark">✅</div>
            <h2>Delivery Confirmed</h2>
            <p><strong>Tracking:</strong> ${data.trackingNumber}</p>
            <p><strong>Delivered:</strong> ${data.deliveryDate}</p>
          </div>
          
          <p>Your package has been successfully delivered! We hope everything arrived in perfect condition.</p>
          
          <p>We'd love to hear about your experience:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback" class="button">Leave Feedback</a>
          
          <p>Thank you for choosing TheLux Shipping for your international shipping needs!</p>
        </div>
        <div class="footer">
          <p>TheLux Shipping - Your trusted international parcel forwarding service</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to,
    subject: `Package Delivered: ${data.trackingNumber}`,
    html,
  })
}
