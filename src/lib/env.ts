import { z } from 'zod'

const isVercel = process.env.VERCEL === '1'

const blobToken = z
  .string()
  .transform((value) => value.replace(/^['"]|['"]$/g, '').trim())
  .refine(
    (value) => value.length === 0 || /^vercel_blob_rw_[a-zA-Z0-9]+_[a-zA-Z0-9]+$/.test(value),
    'BLOB_READ_WRITE_TOKEN must match vercel_blob_rw_<store_id>_<random_string>',
  )

const schema = z.object({
  DATABASE_URI: z.string(),
  PAYLOAD_SECRET: z.string().min(8),
  NEXT_PUBLIC_SERVER_URL: z.string().url().default('http://localhost:3000'),
  BLOB_READ_WRITE_TOKEN: isVercel ? blobToken.pipe(z.string().min(1)) : blobToken.optional(),
})

export const env = schema.parse(process.env)
