import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  webpack: (webpackConfig, { isServer }) => {
    if (!isServer) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@payloadcms/plugin-cloud-storage/utilities': path.resolve(
          __dirname,
          'src/lib/cloud-storage-utilities-shim.js',
        ),
      }
    }
    return webpackConfig
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
