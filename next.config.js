// @ts-check
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'liveblocks.io',
        pathname: '/**',
      },
    ],
    domains: ['aws-file-uploder.s3.ap-northeast-2.amazonaws.com'], // S3 버킷 도메인 추가
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of `yjs` resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: false, // 경고를 무시한채로 빌드 origin true , 테스트용 입니다.
  },
};

module.exports = nextConfig;
