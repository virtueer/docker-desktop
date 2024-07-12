import "../globals.css";
import "@xterm/xterm/css/xterm.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Sidebar from "@/components/sidebar";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootPage,
});

function RootPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-w-screen w-screen max-w-screen min-h-screen h-screen max-h-screen bg-night-500 text-white dark overflow-hidden">
        <Sidebar />
        <div className="w-full p-5 pl-0 overflow-auto">
          <Outlet />
        </div>
        <Toaster />
      </div>
      {/* <TanStackRouterDevtools /> */}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}
