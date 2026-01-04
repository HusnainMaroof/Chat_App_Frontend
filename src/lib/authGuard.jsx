import { Navigate, Outlet, useLocation } from "react-router";

export const ProtectedRoute = ({ user, authMeStates }) => {
  const location = useLocation();
  const isInvalid =
    authMeStates?.result === "TOKEN_MISSING" ||
    authMeStates?.result === "IN_VAILD_USER" ||
    !user;

  if (isInvalid) {
    return <Navigate to="/" replace />;
  }
if (
  !authMeStates?.result?.profileVerified &&
  location.pathname !== "/setupProfile"
) {
  return <Navigate to="/setupProfile" replace />;
}

// If profile IS verified and they try to go to setup, send them to chat
if (
  authMeStates?.result?.profileVerified &&
  location.pathname === "/setupProfile"
) {
  return <Navigate to="/chatPage" replace />;
}
  return <Outlet />;
};

// GUARD 2: Only for Guests (Login/Signup)
export const PublicRoute = ({ user }) => {
  if (user ) {
    return <Navigate to="/chatPage" replace />;
  }

  return <Outlet />;
};
