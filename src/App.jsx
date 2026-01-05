import { Navigate, Route, Routes } from "react-router";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { authMeFun } from "./features/auth/authSlice";
import { ProtectedRoute, PublicRoute } from "./lib/authGuard";
import LazyLoader from "./components/ui/CustomLoader";
import ForGotPassowrd from "./pages/ForGotPassowrd";
import ReSetPassword from "./pages/ReSetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import SetupProfile from "./pages/SetupProfile";

function App() {
  const { authMeStates, user } = useSelector((state) => state.auth);
  const { connectingStates } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authMeFun());
  }, [dispatch]);

  if (authMeStates?.loading)
    return (
      <div className="min-h-screen bg-slate-900 relative flex items-center justify-center px-4 overflow-hidden">
        <div className="w-[200px] ">
          <LazyLoader />
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center md:px-2 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        {/* these are the Public Routes  */}
        <Route element={<PublicRoute user={user} />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgotpassowrd" element={<ForGotPassowrd />} />
          <Route path={`/reset-password/:Link`} element={<ReSetPassword />} />
          <Route path={`/verfiy_Otp`} element={<VerifyOtp />} />
        </Route>

        {/* these are the Protected Routes */}

        <Route
          element={<ProtectedRoute user={user} authMeStates={authMeStates} />}
        >
          <Route path="/chatPage" element={<ChatPage />} />
          <Route path="/setupProfile" element={<SetupProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
