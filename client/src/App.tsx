import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import LotteryResults from "@/pages/lottery-results";
import PlayLottery from "@/pages/play-lottery";
import TransactionHistory from "@/pages/transaction-history";
import ProfilePage from "@/pages/profile-page";
import AdminPage from "@/pages/admin-page";
import LandingPage from "@/pages/landing-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import "./index.css";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/results" component={LotteryResults} />
      <ProtectedRoute path="/play-lottery" component={PlayLottery} />
      <ProtectedRoute path="/history" component={TransactionHistory} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      
      {/* Catch all route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
