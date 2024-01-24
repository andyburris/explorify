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
    }
}

module.exports = nextConfig
