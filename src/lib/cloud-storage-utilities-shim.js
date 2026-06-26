import path from 'path'
import { sanitizeFilename } from 'payload/shared'

function sanitizePrefix(prefix) {
  return prefix.replace(/^\/+|\/+$/g, '')
}

/** Client-safe subset of @payloadcms/plugin-cloud-storage/utilities (avoids server barrel). */
export function getFileKey({
  collectionPrefix,
  docPrefix,
  filename,
  useCompositePrefixes = false,
}) {
  const safeCollectionPrefix = sanitizePrefix(collectionPrefix || '')
  const safeDocPrefix = sanitizePrefix(docPrefix || '')
  const safeFilename = sanitizeFilename(filename)
  const fileKey = useCompositePrefixes
    ? path.posix.join(safeCollectionPrefix, safeDocPrefix, safeFilename)
    : path.posix.join(safeDocPrefix || safeCollectionPrefix, safeFilename)

  return {
    fileKey,
    sanitizedCollectionPrefix: safeCollectionPrefix,
    sanitizedDocPrefix: safeDocPrefix,
    sanitizedFilename: safeFilename,
  }
}