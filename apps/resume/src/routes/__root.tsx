import { lazy, useState } from "react";
import useTitle from "@/hooks/use-title";
import { Toaster } from "@/components/sonner";
import Separator from "@/components/separator";
import { useQueryClient } from "@tanstack/react-query";
import type { Resume } from "~/apps/server/src/types/drizzle";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/dropdown-menu";
import {
	useAuth,
	useUser,
	SignedIn,
	SignedOut,
	SignInButton,
} from "@clerk/clerk-react";
import {
	Outlet,
	useSearch,
	type AnyRoute,
	createRootRoute,
} from "@tanstack/react-router";

import "./global.css";

const ProfileDialog = lazy(() => import("@/components/profile"));
const IS_LOCAL = import.meta.env.APP_ENV === "development";
const REDIRECT_URL = `https://resume.lerscott.${IS_LOCAL ? "local" : "com"}`;

const Root = () => {
	useTitle();
	const queryClient = useQueryClient();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { isLoaded, signOut } = useAuth();
	const { user } = useUser();
	const forPrint = useSearch<
		AnyRoute & {
			padding?: boolean;
		}
	>({
		from: window.location.pathname.includes("resume")
			? "/resume/$resumeId"
			: "/",
		select: ({ print }) => Boolean(print),
	});

	const data = queryClient.getQueryData(["getResume", { isLoaded }]) as Resume;

	const handleSignOut = async () => {
		if (!isLoaded) {
			return;
		}
		await signOut();
	};

	return (
		<>
			{forPrint ? null : (
				<>
					<header className="flex items-center p-2 justify-between">
						<h1 className="text-[--primary] font-bold">
							<a href="/">@maestro/resume</a>
						</h1>
						<SignedOut>
							<SignInButton
								forceRedirectUrl={REDIRECT_URL}
								fallbackRedirectUrl={REDIRECT_URL}
							/>
						</SignedOut>
						<SignedIn>
							<div className="flex items-center gap-4">
								{data?.name ? (
									<span className="text-xs text-[--ghost]">{data?.name}</span>
								) : null}
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Avatar className="size-6">
											<AvatarImage src={user?.imageUrl} />
											<AvatarFallback className="bg-[--primary] text-2xs font-bold text-white">
												{user?.fullName
													?.split(" ")
													.map((name) => name[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
											Profile
										</DropdownMenuItem>
										<Separator />
										<DropdownMenuItem onSelect={handleSignOut}>
											Sign Out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<ProfileDialog
									isOpen={isDialogOpen}
									setIsOpen={setIsDialogOpen}
								/>
							</div>
						</SignedIn>
					</header>
					<Separator />
				</>
			)}

			<Outlet />
			<Toaster richColors />
			{forPrint ? null : <ReactQueryDevtools />}
		</>
	);
};

export const rootRoute = createRootRoute({
	component: Root,
});

export const Route = rootRoute;
