import { useAppSelector } from "@/hooks";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {

  const { accessToken } = useAppSelector(state => state.auth);

  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes