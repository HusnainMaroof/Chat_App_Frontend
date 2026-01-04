import { useContext, useState } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { Link, useNavigate } from "react-router";
import { context } from "../context/context";
import { useDispatch, useSelector } from "react-redux";
import { authMeFun, loginFun } from "../features/auth/authSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Checkbox from "../components/ui/Tick";
import ApiLoader from "../components/ui/ApiLoder";

function LoginPage() {
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  const { loginStates, authMeStates } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState({
    passError: false,
    emailError: false,
  });

  const handelLogin = () => {
    if (!email || !password) {
      setError({
        passError: "please enter the password",
        emailError: "please enter the email ",
      });
      toast.error("please enter the email and password");
    }

    toast.promise(Dispatch(loginFun({ email, password })), {
      loading: "Loging in...",
      success: <span>Loging In Successfully Welcom back {email}</span>,
      error: <span>Could not LogIn.</span>,
    });
  };

  useEffect(() => {
    if (loginStates?.error) {
      if (loginStates?.result === "invalid Credentials") {
        toast.error("please enter the correct email and password");
        setEmail("");
        setPassword("");
        setError({
          passError: "please enter the correct password",
          emailError: "please enter the Correct email ",
        });
      } else if (loginStates?.result === "Invalid Email") {
        toast.error("please enter the correct email ");
        setEmail("");
        setError({ ...error, emailError: "please enter the email " });
      } else if (loginStates?.result === "Invalid pass") {
        toast.error("please enter the correct password ");
        setPassword("");
        setError({ ...error, passError: "please enter the password " });
      }
    }
    if (loginStates.success) {
      if (loginStates.result === "user login Successfully") {
        setTimeout(() => {
          Dispatch(authMeFun());
        }, 500);
      }
    }
  }, [loginStates]);
  return (
    <div className="w-full flex items-center justify-center p-1 md:p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* HEADING */}
                <div className="text-center mb-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-800/60" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400">
                    Login to access to your account
                  </p>
                </div>

                {/* FORM (no logic) */}
                <form className="space-y-6">
                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={` ${
                          error.emailError ? "inputError" : "input"
                        } `}
                        placeholder="johndoe@gmail.com"
                      />
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
                        className={` ${
                          error.passError ? "inputError" : "input"
                        } `}
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Forgot Passowrd*/}

                  <div className=" flex md:items-center justify-between flex-col md:flex-row ">
                    <span className="underline text-white hover:opacity-80 cursor-pointer text-sm md:text-lg">
                      {" "}
                      <Link to={"/forgotpassowrd"}>Forgot Passowrd</Link>
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
                    className={` ${
                      loginStates.loading ? "auth-btnError" : "auth-btn"
                    } `}
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

            {/* ILLUSTRATION - RIGHT SIDE */}
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
