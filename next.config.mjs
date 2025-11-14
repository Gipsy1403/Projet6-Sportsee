/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',       // le port de ton backend / serveur d’images
        pathname: '/images/**',
      },
    ],
},
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
