/** @type {import('next').NextConfig} */
const nextConfig = {
    images : {
        dangerouslyAllowSVG: true,
        domains: [
            "placehold.co"
        ],
        remotePatterns: [
            {
                protocol:   'https',
                hostname:   '*',
                port:   '',
                pathname:   '/**'
            }
        ]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        serverActions: {
            // edit: updated to new key. Was previously `allowedForwardedHosts`
            allowedOrigins: ['localhost:3000'],
        },
    }
};

export default nextConfig;
