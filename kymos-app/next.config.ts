import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mssql', 'msnodesqlv8'],
  turbopack: {},
};

export default nextConfig;
