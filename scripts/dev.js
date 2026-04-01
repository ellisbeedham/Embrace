#!/usr/bin/env node
/**
 * Starts Next dev with TURBOPACK removed from the environment so Cursor / the shell
 * cannot force Turbopack on (avoids broken Edge chunk ENOENT in dev).
 */
const { spawn } = require("child_process");
const path = require("path");

const env = { ...process.env };
delete env.TURBOPACK;

const nextCli = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextCli, "dev", ...process.argv.slice(2)], {
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code == null ? 0 : code);
});
