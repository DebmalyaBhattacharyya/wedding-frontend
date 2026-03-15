import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";

// Layout & Navigation
import Navbar from "./components/Navbar";

// Core Pages
import Home from "./pages/Home";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import MyEnquiries from "./pages/dashboard/MyEnquiries";
import MyBookings from "./pages/dashboard/MyBookings";
import Profile from "./pages/dashboard/Profile";

// Marketing / Static Pages
import Services from "./pages/Services";
import Plans from "./pages/Plans";
import Portfolio from "./pages/Portfolio";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Contact from "./pages/Contact";

// 1. Define the Root Route (The Shell of the App)
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-brand-light selection:bg-brand selection:text-white flex flex-col">
      <Navbar />
      <main className="w-full flex-grow">
        <Outlet />
      </main>
   <Footer />
    </div>
  ),
});

// 2. Define All Individual Routes
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });
const servicesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/services", component: Services });
const plansRoute = createRoute({ getParentRoute: () => rootRoute, path: "/plans", component: Plans });
const portfolioRoute = createRoute({ getParentRoute: () => rootRoute, path: "/portfolio", component: Portfolio });
const reviewsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/reviews", component: Reviews });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: "/about", component: About });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: Contact });

// Core Functional Routes
const vendorsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/vendors", component: Vendors });
const vendorDetailsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/vendors/$vendorId", component: VendorDetails });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/login", component: Login });
const signupRoute = createRoute({ getParentRoute: () => rootRoute, path: "/signup", component: Signup });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: Admin });
// Dashboard & Profile Routes
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard", component: Dashboard });
const enquiriesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/enquiries", component: MyEnquiries });
const bookingsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/bookings", component: MyBookings });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/profile", component: Profile });
const bookingRoute = createRoute({ 
  getParentRoute: () => rootRoute, 
  path: "/book", 
  component: Booking 
});
// 3. Create the Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  plansRoute,
  portfolioRoute,
  reviewsRoute,
  aboutRoute,
  contactRoute,
  vendorsRoute,
  vendorDetailsRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  enquiriesRoute,
  bookingsRoute,
  profileRoute,
  bookingRoute,
  adminRoute
]);

// 4. Initialize the Router
const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}