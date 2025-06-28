const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
});

if (!result.success) {
  console.error("❌ Build failed for @kiffarino/be:");
  for (const log of result.logs) {
    console.error(log.message);
  }
  throw new AggregateError(result.logs, "Build failed.");
}

console.log("✅ @kiffarino/be build done.");
