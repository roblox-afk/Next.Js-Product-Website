/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/dashboard/:slug/product',
                destination: '/dashboard/:slug/products',
                permanent: true
            }
        ]
    },
    images : {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol:   'https',
                hostname:   '*',
                port:   '',
                pathname:   '/**'
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**'
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
