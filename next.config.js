/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack5: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          net: false,
          tls: false,
          fs: false,
          child_process: false,
        },
      };
    }
    return config;
  },
  async redirects() {
    return [{ source: "/", destination: "/home", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/video/:slug*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
