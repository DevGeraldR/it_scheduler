import { Navigate, Outlet } from "react-router-dom";
import { useGlobal } from "../context/Context";

export const AuthenticationRoute = () => {
  const { currentUser, isAuthenticating } = useGlobal();

  // Check if still authenticating then return loading
  if (isAuthenticating) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-screen bg-white">
        <div className="w-24 h-24 border-l-2 border-black rounded-full animate-spin"></div>
        <span>Checking status...</span>
      </div>
    );
  }

  return currentUser ? <Navigate to="/homepage" /> : <Outlet />;
};
