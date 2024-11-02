/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TOGETHER_API_KEY: process.env["TOGETHER_API_KEY"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
