/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
module.exports = {
  reactScriptVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: () => {
        return { url: false };
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
