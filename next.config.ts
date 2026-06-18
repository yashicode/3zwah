import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old route names → new Azwa information architecture.
  // (/assistant stays for now; Stage 2 merges it into /find-support.)
  async redirects() {
    return [
      { source: "/training", destination: "/workshops", permanent: false },
      { source: "/services", destination: "/find-support", permanent: false },
      { source: "/assistant", destination: "/find-support", permanent: false },
      { source: "/support", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
