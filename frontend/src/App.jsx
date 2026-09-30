import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./app/router.jsx";
import { ErrorBoundary } from "./app/ErrorBoundary.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<p className="p-8 text-center">Memuat...</p>}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
