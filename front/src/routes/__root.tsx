import "../globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootPage,
});

function RootPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-w-screen min-h-screen bg-[#161e22] text-white">
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </QueryClientProvider>
  );
}
