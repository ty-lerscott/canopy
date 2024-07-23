import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import ProfileDialog from "@/components/profile-dialog";
import Separator from "@/components/separator";
import {
	SignInButton,
	SignedIn,
	SignedOut,
	useAuth,
	useUser,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	type AnyRoute,
	Link,
	Outlet,
	createRootRoute,
	useParams,
	useSearch,
} from "@tanstack/react-router";
import { useState } from "react";

const queryClient = new QueryClient();

const Root = () => {
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
	const resumeId = useParams({
		from: window.location.pathname.includes("resume")
			? "/resume/$resumeId"
			: "/",
		select: (select) => (select as Record<string, string>).resumeId,
	});

	const handleSignOut = async () => {
		if (!isLoaded) {
			return;
		}
		await signOut();
	};

	return (
		<QueryClientProvider client={queryClient}>
			{forPrint ? null : (
				<>
					<header className="flex items-center p-2 justify-between">
						<h1 className="text-[--primary] font-bold">
							<Link to="/">@maestro/resume</Link>
						</h1>
						<SignedOut>
							<SignInButton />
						</SignedOut>
						<SignedIn>
							<div className="flex items-center gap-4">
								<span className="text-xs text-[--ghost]">{resumeId}</span>
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
										<DropdownMenuItem onClick={handleSignOut}>
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
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

// Create the root route
export const rootRoute = createRootRoute({
	component: Root,
});

export const Route = rootRoute;
