import { Navigate, Outlet } from "react-router-dom";
import { useGlobal } from "../context/Context";

export const AuthenticationRoute = () => {
  const { currentUser, isAuthenticating } = useGlobal();

  // Check if still authenticating then return loading
  if (isAuthenticating) {
    return;
  }

  return currentUser ? <Navigate to="/homepage" /> : <Outlet />;
};
