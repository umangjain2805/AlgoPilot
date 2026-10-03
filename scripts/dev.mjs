import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const root = fileURLToPath(new URL("../", import.meta.url));
const vite = fileURLToPath(
  new URL("../client/node_modules/vite/bin/vite.js", import.meta.url),
);
if (!existsSync(vite)) {
  console.error(
    "Install dependencies first: npm --prefix client install and npm --prefix server install",
  );
  process.exit(1);
}
const children = [
  spawn(process.execPath, ["server/server.js"], {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  }),
  spawn(process.execPath, [vite], {
    cwd: fileURLToPath(new URL("../client/", import.meta.url)),
    stdio: "inherit",
    windowsHide: true,
  }),
];
let shuttingDown = false;
const stop = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => child.kill());
  process.exitCode = code;
};
children.forEach((child) => {
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => stop(code || 0));
});
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
