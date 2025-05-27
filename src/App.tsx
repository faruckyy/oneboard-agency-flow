
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CleaningPage from "./pages/CleaningPage";
import DesignTasksPage from "./pages/DesignTasksPage";
import CommercialTasksPage from "./pages/CommercialTasksPage";
import AdminPage from "./pages/AdminPage";
import CalculatorPage from "./pages/CalculatorPage"; // New import
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="oneboard-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cleaning" element={<CleaningPage />} />
            <Route path="design" element={<DesignTasksPage />} />
            <Route path="commercial" element={<CommercialTasksPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="calculator" element={<CalculatorPage />} /> // New route
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
