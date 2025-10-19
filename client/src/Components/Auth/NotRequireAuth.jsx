import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const NotRequireAuth = () => {
  const auth = useSelector((state) => state.auth || {});
  const isLoggedIn = auth?.isLoggedIn || false;
  return isLoggedIn ? <Navigate to={"/"} replace /> : <Outlet />;
};

export default NotRequireAuth;