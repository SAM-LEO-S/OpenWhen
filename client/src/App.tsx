import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import Home from "@/pages/home";
import Verse from "@/pages/verse";
import SpecialVerse from "@/pages/special-verse";
import NotFound from "@/pages/not-found";


function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-deep-900/80 backdrop-blur-lg border-b border-cream-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Cross className="text-gold-400 text-xl" size={20} />
          <h1 className="text-xl font-serif font-semibold text-gray-800 dark:text-cream-50">
            Open When
          </h1>
        </div>
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="p-2 rounded-full bg-cream-200 dark:bg-deep-800 text-peaceful-500 dark:text-gold-400 hover:bg-cream-300 dark:hover:bg-gray-600 transition-all duration-200"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/verse/:emotion">
        {(match) => {
          if (!match) return null;
          // Extract timestamp from query parameter to force fresh loads
          const urlParams = new URLSearchParams(window.location.search);
          const timestamp = urlParams.get('t');
          const key = timestamp ? `${match.emotion}-${timestamp}` : match.emotion;
          return <Verse key={key} />;
        }}
      </Route>

      <Route path="/special-verse" component={SpecialVerse} />
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-cream-50 dark:bg-deep-800 transition-colors duration-300">
            <Header />
            <main>
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
