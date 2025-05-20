import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSettings } from "@shared/types";
import { Loader } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial settings
  const { data: settings, isSuccess } = useQuery<AppSettings>({
    queryKey: ['/api/settings'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  useEffect(() => {
    if (isSuccess) {
      // Small delay to ensure everything is loaded properly
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F0F0F0]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-[#111111]" />
          <h1 className="text-2xl font-semibold">Loading Family Calendar...</h1>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
