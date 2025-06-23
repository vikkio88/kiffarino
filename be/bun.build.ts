const build = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
});

if (!build.success) throw new AggregateError(build.logs);

console.log("Built correctly.");
