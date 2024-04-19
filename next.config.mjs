/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["api.producthunt.com"],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // WalletConnect Modal
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding")
        return config
    },
}

export default nextConfig
