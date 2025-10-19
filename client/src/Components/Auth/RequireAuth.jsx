import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const auth = useSelector((state) => state.auth || {});
  const isLoggedIn = auth?.isLoggedIn;
  const role = auth?.role || "";
  const location = useLocation();

  return isLoggedIn && allowedRoles.find((myRole) => myRole === role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to={"/denied"} state={{ from: location }} replace />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default RequireAuth;