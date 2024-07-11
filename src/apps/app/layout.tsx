import pkg from "@/apps/package.json";
import env from "@/tools/dotenv-config";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const IS_LOCAL = env.APP_ENV === "development";
const LOCAL_PREFIX = IS_LOCAL ? "🌑" : "🌕";
const appName = `${pkg.name[0].toUpperCase()}${pkg.name.substring(1)}`;

export const metadata: Metadata = {
	title: `${LOCAL_PREFIX} ${appName} Coming Soon`,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
