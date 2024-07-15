import { Outlet, createRootRoute } from '@tanstack/react-router'

// Root component
const Root = () => {
    return (
        <Outlet />
    )
}

// Create the root route
export const rootRoute = createRootRoute({
    component: Root,
})

export const Route = rootRoute;
