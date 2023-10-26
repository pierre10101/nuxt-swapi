export default defineNuxtConfig({
  modules: ["../src/module", 'nuxt-full-static'],
  ssr: true,
  experimental: {
    typescriptBundlerResolution: true,
  },
  typescript: {
    shim: false,
  },
});
