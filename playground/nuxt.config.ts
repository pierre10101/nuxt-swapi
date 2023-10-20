export default defineNuxtConfig({
  modules: ["../src/module"],
  experimental: {
    typescriptBundlerResolution: true,
  },
  typescript: {
    shim: false,
  },
});
