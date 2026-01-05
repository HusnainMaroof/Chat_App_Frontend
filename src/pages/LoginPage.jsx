import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import Checkbox from "../components/ui/Tick";
import ApiLoader from "../components/ui/ApiLoder";
import {
  authMeFun,
  loginFun,
  loginStatesReset,
} from "../features/auth/authSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginStates } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState({ emailError: "", passError: "" });

  // Ref to store current promise handlers
  const loginPromiseRef = useRef();

  // Custom login promise based on loginStates
  const createLoginPromise = () =>
    new Promise((resolve, reject) => {
      loginPromiseRef.current = { resolve, reject };
    });

  // Watch loginStates to resolve/reject promise and show toast
  useEffect(() => {
    if (!loginPromiseRef.current) return;

    const { resolve, reject } = loginPromiseRef.current;

    if (loginStates.loading) {
      // Loading toast handled by toast.promise, so skip here
      return;
    }

    if (loginStates.success) {
      resolve(loginStates.result);
      loginPromiseRef.current = null;
    }

    if (loginStates.error) {
      reject(loginStates.result);
      loginPromiseRef.current = null;
    }
  }, [loginStates]);

  // Map backend errors to input fields
  useEffect(() => {
    if (loginStates.error && loginStates.result) {
      if (loginStates.result.includes("Email")) {
        setError({ emailError: loginStates.result, passError: "" });
      } else if (loginStates.result.includes("pass")) {
        setError({ emailError: "", passError: loginStates.result });
      } else {
        setError({ emailError: "", passError: "" });
      }
    }
  }, [loginStates.error, loginStates.result]);

  // Handle login button click
  const handelLogin = () => {
    dispatch(loginStatesReset());

    // Form validation
    if (!email || !password) {
      setError({
        emailError: !email ? "Please enter your email" : "",
        passError: !password ? "Please enter your password" : "",
      });
      toast.error("Please enter email and password");
      return;
    }

    setError({ emailError: "", passError: "" });

    // Dispatch login thunk
    dispatch(loginFun({ email, password }));

    // Fire toast using custom promise
    toast.promise(createLoginPromise(), {
      loading: "Logging in...",
      success: "Logged in successfully!",
      error: (err) => err || "Could not login!",
    });
  };

  // Navigate on successful login
  useEffect(() => {
    if (loginStates.success) {
      dispatch(authMeFun());
      // Navigate to dashboard or home page if needed
      // navigate("/dashboard");
    }
  }, [loginStates.success, dispatch]);

  useEffect(() => {
    dispatch(loginStatesReset());
  }, [dispatch]);
  return (
    <div className="w-full flex items-center justify-center p-1 md:p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-800/60" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">Login to access your account</p>
                </div>

                {/* FORM */}
                <form
                  className="space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${
                          error.emailError ? "inputError" : "input"
                        }`}
                        placeholder="johndoe@gmail.com"
                      />
                      {error.emailError && (
                        <span className="text-red-500 text-sm">
                          {error.emailError}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${
                          error.passError ? "inputError" : "input"
                        }`}
                        placeholder="Enter your password"
                      />
                      {error.passError && (
                        <span className="text-red-500 text-sm">
                          {error.passError}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Forgot Password & Show Password */}
                  <div className="flex md:items-center justify-between flex-col md:flex-row">
                    <span className="underline text-white hover:opacity-80 cursor-pointer text-sm md:text-lg">
                      <Link to={"/forgotpassowrd"}>Forgot Password</Link>
                    </span>

                    <div className="flex items-center justify-end gap-4 text-white">
                      <Checkbox
                        labelContent={
                          showPass ? "Hide Password" : "Show Password"
                        }
                        isChecked={showPass}
                        onChange={() => setShowPass(!showPass)}
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className={`${
                      loginStates.loading ? "auth-btnError" : "auth-btn"
                    }`}
                    onClick={handelLogin}
                    disabled={loginStates.loading}
                    type="button"
                  >
                    {loginStates.loading ? (
                      <ApiLoader size={"2em"} text={"Loading"} />
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION COLUMN */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect anytime, anywhere
                  </h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default LoginPage;
