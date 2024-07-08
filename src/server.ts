import dotenv from "dotenv";
import Server from "./api";

const BUILD_MODE = process.env.NODE_ENV === "production";

if (!BUILD_MODE) {
	dotenv.config({
		path: ".env.local",
	});

	Server.listen(Number(process.env.PORT) || 3000, () =>
		console.log(`Server is listening on port ${Number(process.env.PORT)}`),
	);
}
