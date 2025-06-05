import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // If there is no token (user is not authenticated), redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, allow access to the protected route (List page)
  return <Outlet />;
};

export default PrivateRoute;
