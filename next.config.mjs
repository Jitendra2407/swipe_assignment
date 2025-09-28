// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Add this redirects function
//   async redirects() {
//     return [
//       {
//         source: '/',
//         destination: '/interviewee',
//         permanent: true, // This makes it a permanent redirect (HTTP 308)
//       },
//     ]
//   },

//   // Keep your existing configurations
//   experimental: {
//     serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       config.externals.push({
//         'pdf-parse': 'commonjs pdf-parse',
//         'mammoth': 'commonjs mammoth'
//       });
//     }
    
//     config.resolve.alias.canvas = false;
    
//     return config;
//   },
//   transpilePackages: []
// };

// export default nextConfig;



// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this line
  output: 'standalone',

  // Add this redirects function
  async redirects() {
    return [
      {
        source: '/',
        destination: '/interviewee',
        permanent: true, // This makes it a permanent redirect (HTTP 308)
      },
    ]
  },

  // Keep your existing configurations
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'mammoth': 'commonjs mammoth'
      });
    }

    config.resolve.alias.canvas = false;

    return config;
  },
  transpilePackages: []
};

export default nextConfig;