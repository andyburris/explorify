/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async redirects() {
        return [
            {
                source: "/c/:hash",
                destination: "/customize/:hash",
                permanent: true,
            }
        ]
    },
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
      ) => {
        config.optimization.minimize = false
        return config
      },
}

module.exports = nextConfig
