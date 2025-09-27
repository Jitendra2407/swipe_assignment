// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle pdf-parse module issues
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'mammoth': 'commonjs mammoth'
      });
    }
    
    // Handle canvas dependency for pdf-parse
    config.resolve.alias.canvas = false;
    
    return config;
  },
  // Handle dynamic imports properly
  transpilePackages: []
};

// module.exports = nextConfig;
export default nextConfig;