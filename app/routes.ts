import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),
  route("/profile", "pages/profile.tsx"),
  route("/edit-profile", "pages/edit-profile.tsx"),
  route("/organizer/dashboard", "pages/organizer/dashboard.tsx"),
  route("/organizer/events", "pages/organizer/myevent.tsx"),
  route("/events/:id", "pages/customer/even-detail.tsx"),
  route("/organizer/events/create", "pages/organizer/create-event.tsx"),
  route("/organizer/transactions", "pages/organizer/transaction.tsx"),
  route(
    "/organizer/events/:id/attendees",
    "pages/organizer/event-attendees.tsx",
  ),
] satisfies RouteConfig;
