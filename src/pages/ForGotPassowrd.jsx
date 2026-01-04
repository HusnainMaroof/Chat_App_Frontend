import React, { useEffect, useState } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  passLinkStatesReset,
  reSetPassLinkFun,
} from "../features/auth/authSlice";
import ApiLoader from "../components/ui/ApiLoder";

const ForGotPassowrd = () => {
  const dispatch = useDispatch();
  const { ReSetPassLinkStates } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    return () => dispatch(passLinkStatesReset());
  }, [dispatch]);
  const handelSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("please Enter the Email");
      setError("please Enter the Email");
      return;
    }
    dispatch(passLinkStatesReset());
    dispatch(reSetPassLinkFun({ email }));
  };

  useEffect(() => {
    if (ReSetPassLinkStates?.result === "user not Exsited") {
      toast.error("please Enter the correct Email");
      setError("Email does not Exist");
      setEmail("");
    }

    if (ReSetPassLinkStates.result?.link === "link sended") {
      toast.success("we have send Reset Email on you email");
      setEmail("");
      setError(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [ReSetPassLinkStates]);
  return (
    <div className="w-full flex items-center justify-center relative   ">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <div className="absolute left-10 top-10 text-white z-40 ">
          <Link to={"/"}>
            {" "}
            <span className="flex items-center  gap-1 hover:opacity-85 hover:scale-110 transition-all duration-150 cursor-pointer underline">
              Back
            </span>
          </Link>
        </div>
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col justify-center md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full  max-w-md">
                {/* HEADING */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Send Reset Email
                  </h2>
                  <p className="text-slate-400">We want to Verfiy Your Email</p>
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
                        className={` ${error ? "inputError" : "input"} `}
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>

                  {ReSetPassLinkStates.result?.link === "link sended" && (
                    <p className="text-green-600 font-semibold py-2">
                      We have Send you Reset Passwod email check you email and
                      click verfiy
                    </p>
                  )}

                  {/* PASSWORD INPUT */}

                  <button
                    className="auth-btn flex items-center justify-center"
                    onClick={handelSubmit}
                    type="button"
                  >
                    {ReSetPassLinkStates?.loading ? (
                      <ApiLoader />
                    ) : (
                      "Send Email"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/resetLink.png"
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

export default ForGotPassowrd;
