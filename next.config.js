/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
	swcMinify: true,
	images: {
		unoptimized: true
	},
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
}

module.exports = nextConfig
