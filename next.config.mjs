/** @type {import('next').NextConfig} */
const nextConfig = {
    // WalletConnect Modal
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding")
        return config
    },
}

export default nextConfig
