export function toMailtoHref(email: string): string {
  return `mailto:${email.trim()}`
}

export function toWhatsAppHref(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '')
  if (!digits) {
    return 'https://wa.me/'
  }

  const normalized = digits.startsWith('20')
    ? digits
    : digits.startsWith('0')
      ? `20${digits.slice(1)}`
      : `20${digits}`

  return `https://wa.me/${normalized}`
}
