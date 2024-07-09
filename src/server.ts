import dotenv from "dotenv";
import Server from "./api";

const IS_PROD = process.env.APP_ENV === "production";

if (!IS_PROD) {
	dotenv.config({
		path: ".env.local",
	});
}

const PORT = Number(process.env.PORT) || 3000;

Server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
