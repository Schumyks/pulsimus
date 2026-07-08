import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Prototype capture hygiene: hide the dev overlay badge from screenshots.
  devIndicators: false,
};

export default nextConfig;
