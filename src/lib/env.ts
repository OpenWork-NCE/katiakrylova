import { z } from 'zod'

const schema = z.object({
  DATABASE_URI: z.string(),
  PAYLOAD_SECRET: z.string().min(8),
  NEXT_PUBLIC_SERVER_URL: z.string().url().default('http://localhost:3000'),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
})

export const env = schema.parse(process.env)
