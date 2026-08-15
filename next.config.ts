import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // pnpm hoists `next` to the monorepo root. Keep Turbopack rooted there so
  // it can resolve the package and the workspace lockfile.
  turbopack: {
    root: path.join(frontendRoot, ".."),
  },
};

export default nextConfig;
