//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  vercel: {
    functions: {
      maxDuration: 30
    }
  }
});
