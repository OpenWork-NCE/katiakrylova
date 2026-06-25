export type ContactInfo = {
  email?: string | null
  phone?: string | null
  vimeoUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
}

export async function getContact(_locale: string): Promise<ContactInfo | null> {
  return null
}
