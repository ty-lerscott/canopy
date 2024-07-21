import Separator from "@/components/separator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/clerk-react";
import {
	type AnyRoute,
	Outlet,
	createRootRoute,
	useSearch,
} from "@tanstack/react-router";

// Root component
const Root = () => {
	const forPrint = useSearch<
		AnyRoute & {
			padding?: boolean;
		}
	>({
		from: "/",
		select: ({ print }) => Boolean(print),
	});

	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{forPrint ? null : (
				<>
					<header className="flex items-center p-2 justify-end">
						<SignedOut>
							<SignInButton />
						</SignedOut>
						<SignedIn>
							<UserButton />
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
