/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://paygobackend-production.up.railway.app",
    JWT_SECRET: "oHmkNybAvL6If3N4PTvIIJfOWMKlLXJd",
  },
};

export default nextConfig;
