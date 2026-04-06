import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Favorites from "@/pages/favorites";
import Hotels from "@/pages/hotels";
import HotelDetail from "@/pages/hotel-detail";
import RoomDetail from "@/pages/room-detail";
import Profile from "@/pages/profile";
import BookingDetail from "@/pages/booking";
import Admin from "@/pages/admin";
import About from "@/pages/about";
import Press from "@/pages/press";
import Blog from "@/pages/blog";
import Careers from "@/pages/careers";
import HelpCenter from "@/pages/help-center";
import Contact from "@/pages/contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/press" component={Press} />
      <Route path="/blog" component={Blog} />
      <Route path="/careers" component={Careers} />
      <Route path="/help-center" component={HelpCenter} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/hotels/:hotelId/rooms/:roomId" component={RoomDetail} />
      <Route path="/hotels/:id" component={HotelDetail} />
      
      <Route path="/favorites">
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      
      <Route path="/booking/:id">
        <ProtectedRoute>
          <BookingDetail />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute adminOnly>
          <Admin />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
