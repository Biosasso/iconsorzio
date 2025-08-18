// This file sets a custom webpack configuration to use your Next.js app
// Sentry disabilitato per deploy Vercel
// https://nextjs.org/docs/api-reference/next.config.js/introduction

module.exports = {
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    i18n: {
        defaultLocale: 'it-IT',
        locales: ['it-IT']
    },
    reactStrictMode: true,
    env: {
        DEV_STATUS: process.env.NODE_ENV === 'development'
    }
}
