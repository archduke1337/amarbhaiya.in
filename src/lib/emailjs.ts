/**
 * @fileoverview EmailJS client-side integration — contact form email sender.
 * Uses EmailJS SDK. Call only from client components.
 */

export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

/** Send a contact form email via EmailJS */
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    return { success: false, error: "EmailJS not configured" }
  }

  try {
    const { default: emailjs } = await import("@emailjs/browser")
    await emailjs.send(serviceId, templateId, {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    }, publicKey)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to send email" }
  }
}
