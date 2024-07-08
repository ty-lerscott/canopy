import { spawn } from "node:child_process";
import { resolve } from "node:path";

let serverProcess = null;

const restartServerPlugin = {
	name: "restart-server",
	setup(build) {
		build.onEnd(() => {
			if (serverProcess) {
				serverProcess.kill();
			}
			serverProcess = spawn(
				"node",
				[resolve(process.cwd(), "dist", "server.js")],
				{
					stdio: "inherit",
				},
			);
		});
	},
};

export default restartServerPlugin;
