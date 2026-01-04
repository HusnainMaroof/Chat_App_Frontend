import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ApiLoader from "../components/ui/ApiLoder";
import {
  verifyOTPFun,
  reSendOTPFun,
  signUpStatesReset,
  authMeFun,
} from "../features/auth/authSlice";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ReSendOtpStates, verifyOtpStates } = useSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // 1. Handle API Responses for Verification
  useEffect(() => {
    if (verifyOtpStates.result === "INVALID_OTP") {
      toast.error("Invalid code. Please check and try again.");
      setOtp(["", "", "", ""]);
      inputRefs[0].current.focus();
    } else if (verifyOtpStates.result === "OTP_EXPIRED") {
      toast.error("This OTP has expired. Please request a new one.");
    } else if (verifyOtpStates.result === "SESSION_EXPIRED") {
      toast.error("Session expired. Please sign up again.");
      navigate("/signup"); // Redirect to start over
    } else if (verifyOtpStates.result === "VERIFIED") {
      toast.success("Account activated successfully!");
      navigate("/login");
    }
  }, [verifyOtpStates.result, navigate]);

  // 2. Handle API Responses for Resend
  useEffect(() => {
    if (ReSendOtpStates.result === "SESSION_EXPIRED") {
      toast.error("Session expired. Please sign up again.");
      navigate("/signup");
    } else if (ReSendOtpStates.result === "Otp Resend Successfully") {
      toast.success("A new code has been sent!");
    }
  }, [ReSendOtpStates.result, navigate]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) inputRefs[index + 1].current.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 4) {
      toast.error("Please enter the 4-digit code");
      return;
    }
    dispatch(verifyOTPFun({ otp: finalOtp }));
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    dispatch(reSendOTPFun());
  };

    
    
  // rediract to home page finally
  useEffect(() => {
    if (verifyOtpStates?.result?.isVerified) {
      toast.success("Otp Verfication has done ");
      toast.success(
        `welcome to BaatCheet ${verifyOtpStates?.result.userName} `
      );

      setTimeout(() => dispatch(authMeFun()), 500);
    }
  }, [verifyOtpStates]);
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row md:min-h-[600px]">
            {/* FORM COLUMN */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md text-center">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-200 mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-slate-400">
                    Enter the 4-digit code sent to your email
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-8">
                  <div className="flex justify-center gap-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-14 h-16 text-center text-2xl font-bold bg-slate-800 border-2 rounded-xl text-cyan-400 focus:outline-none transition-all ${
                          verifyOtpStates.result === "INVALID_OTP"
                            ? "border-red-500"
                            : "border-slate-700 focus:border-cyan-500"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="auth-btn w-full py-4 flex justify-center items-center"
                    disabled={verifyOtpStates?.loading}
                  >
                    {verifyOtpStates?.loading ? (
                      <ApiLoader />
                    ) : (
                      "Verify & Activate"
                    )}
                  </button>

                  <div className="mt-6">
                    <p className="text-slate-500 mb-2">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend || ReSendOtpStates?.loading}
                      className={`font-medium transition ${
                        canResend
                          ? "text-cyan-400 hover:text-cyan-300"
                          : "text-slate-600 cursor-not-allowed"
                      }`}
                    >
                      {ReSendOtpStates?.loading
                        ? "Sending..."
                        : canResend
                        ? "Resend OTP"
                        : `Resend in ${timer}s`}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ILLUSTRATION COLUMN */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <img
                src="/signup.png"
                alt="Security"
                className="w-4/5 h-auto object-contain mb-6 opacity-80"
              />
              <div className="text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Secure Your Account
                </h3>
                <p className="text-slate-500 mt-2">
                  One more step to unlock your full access.
                </p>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default VerifyOtp;
