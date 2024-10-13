/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TOGETHER_API_KEY: process.env["TOGETHER_API_KEY"],
    },
};

export default nextConfig;
