import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import Dashboard   from "./pages/Dashboard";
import BookingsPage from "./pages/BookingsPage";
import CalendarPage from "./pages/CalendarPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import SchedulePage from "./pages/SchedulePage";
import ReviewsPage  from "./pages/ReviewsPage";
import { getBookings } from "./store/mockData";

export default function AdminApp() {
  const [page, setPage]           = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const b = getBookings();
    setPendingCount(b.filter(x => x.status === "pending").length);
  }, []);

  const pages = {
    dashboard:  <Dashboard setPage={setPage} />,
    bookings:   <BookingsPage onCountChange={setPendingCount} />,
    calendar:   <CalendarPage />,
    activities: <ActivitiesPage />,
    schedule:   <SchedulePage />,
    reviews:    <ReviewsPage />,
  };

  return (
    <AdminLayout page={page} setPage={setPage} pendingCount={pendingCount}>
      {pages[page] ?? <Dashboard setPage={setPage} />}
    </AdminLayout>
  );
}
