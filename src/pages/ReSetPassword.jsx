import React, { useEffect, useState } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import Checkbox from "../components/ui/Tick";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  passwordReSetStates,
  reSetPasswordFun,
} from "../features/auth/authSlice";
import ApiLoader from "../components/ui/ApiLoder";

const ReSetPassword = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { ReSetPasswrodStates } = useSelector((state) => state.auth);
  const [password, setPassword] = useState();
  const [confirmPassowrd, setConfirmPassword] = useState();
  const [error, setError] = useState();
  const [showPass, setShowPass] = useState(false);
  const { Link } = useParams();

  // clear stat when pages load
  useEffect(() => {
    return () => dispatch(passwordReSetStates());
  }, [dispatch]);

  // submit
  const handelSubmit = (e) => {
    e.preventDefault();
    dispatch(passwordReSetStates());
    if (!password || !confirmPassowrd) {
      setError("Please enter the new password and confirm Password");
      toast.error("Please enter the new password and confirm Password");
    }

    if (password !== confirmPassowrd) {
      setError("you passowrd does not match");
      toast.error("you passowrd does not match");
    }

    dispatch(reSetPasswordFun({ Link, password }));
  };

  useEffect(() => {
    if (ReSetPasswrodStates.result === "INVALID_TOKEN OR TOEKN EXPIRED") {
      toast.error("Token Expired");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
    if (ReSetPasswrodStates.result === "password has been ReSet") {
      toast.success("your password has been Reset");
      setError(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [ReSetPasswrodStates]);
  return (
    <div className="w-full flex items-center justify-center relative   ">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <div className="absolute left-10 top-10 text-white z-40 "></div>
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col justify-center md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full  max-w-md">
                {/* HEADING */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Reset You Passwrd
                  </h2>
                  <p className="text-slate-400">We want to Verfiy Your Email</p>
                </div>

                {/* FORM (no logic) */}
                <form className="space-y-6">
                  {/* password INPUT */}
                  <div>
                    <label className="auth-input-label">New Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={` ${error ? "inputError" : "input"} `}
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Confirm Passowrd</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={confirmPassowrd}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={` ${error ? "inputError" : "input"} `}
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 text-white">
                    <Checkbox
                      labelContent={
                        showPass ? "Hide Password" : "Show Password"
                      }
                      isChecked={showPass}
                      onChange={() => setShowPass(!showPass)}
                    />
                  </div>

                  {/* PASSWORD INPUT */}

                  <button
                    className="auth-btn"
                    onClick={handelSubmit}
                    type="button"
                  >
                    {ReSetPasswrodStates.loading ? (
                      <ApiLoader />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/resetPassowrd.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect anytime, anywhere
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Secure</span>
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
};

export default ReSetPassword;
