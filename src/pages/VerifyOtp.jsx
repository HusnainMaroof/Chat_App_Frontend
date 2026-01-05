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
import { ArrowRight, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

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
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Background Decorative Blurs - Theme consistent */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-5xl z-10">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row md:min-h-[600px] bg-slate-900/50 backdrop-blur-xl">
            {/* FORM COLUMN */}
            <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center md:border-r border-white/5">
              <div className="w-full max-w-sm text-center">
                <div className="mb-10">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl blur-xl opacity-20 animate-pulse" />
                    <div className="relative h-16 w-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-2xl mx-auto">
                      <ShieldCheck className="h-8 w-8 text-violet-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">
                    Verify OTP
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Enter the 4-digit code sent to your email to activate your
                    account.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-10">
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
                        className={`w-14 h-16 text-center text-3xl font-bold bg-white/5 backdrop-blur-md border-2 rounded-2xl text-violet-400 focus:outline-none transition-all duration-300 ${
                          verifyOtpStates.result === "INVALID_OTP"
                            ? "border-red-500/50 bg-red-500/5 ring-4 ring-red-500/10"
                            : "border-white/10 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 rounded-2xl font-bold text-white shadow-lg shadow-violet-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                    disabled={verifyOtpStates.loading}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {verifyOtpStates.loading ? (
                        <ApiLoader />
                      ) : (
                        <>
                          <span>Verify & Activate</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>

                  <div className="pt-4">
                    <p className="text-slate-500 text-sm mb-3">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend || ReSendOtpStates.loading}
                      className={`inline-flex items-center gap-2 font-semibold transition-all duration-300 ${
                        canResend
                          ? "text-fuchsia-400 hover:text-fuchsia-300"
                          : "text-slate-600 cursor-not-allowed"
                      }`}
                    >
                      {ReSendOtpStates.loading ? (
                        "Sending..."
                      ) : (
                        <>
                          {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                          {canResend && (
                            <Sparkles className="h-4 w-4 animate-pulse" />
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* ILLUSTRATION COLUMN */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-violet-500/10 to-transparent opacity-40" />

              <div className="relative mb-12">
                <div className="absolute inset-0 bg-violet-500/20 blur-[80px] rounded-full scale-150 animate-pulse" />

                <img
                  src="../../public/otp.png"
                  alt="OTP Illustration"
                  className="h-full w-full object-contain drop-shadow-glow"
                  onerror="this.src='https://cdn-icons-png.flaticon.com/512/6357/6357048.png';this.style.padding='20px';"
                />
              </div>

              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-3">
                  Secure Your Account
                </h3>
                <p className="text-slate-400 max-w-[280px] leading-relaxed text-sm">
                  We've sent a unique security code to protect your privacy. One
                  more step to join the community.
                </p>

                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-[#0f172a] bg-slate-800 flex items-center justify-center shadow-lg"
                      >
                        <MessageSquare className="h-5 w-5 text-violet-400" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full bg-violet-500/50"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                      Join to be First to Try
                    </span>
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

export default VerifyOtp;
