import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This should make your app listen on all network interfaces (including USB tethering)
  devServer: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 3000, // Ensure this is the same port you're trying to access
  },
  
  
};

export default nextConfig;