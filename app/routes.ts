import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "pages/login.tsx"),
  route("/register", "pages/register.tsx"),
  route("/organizer/dashboard", "pages/organizer/dashboard.tsx"),
  route("/organizer/events", "pages/organizer/myevent.tsx"),
  route("/events/:id", "pages/customer/even-detail.tsx"),
  route("/organizer/events/create", "pages/organizer/create-event.tsx"),
] satisfies RouteConfig;
