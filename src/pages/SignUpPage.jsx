import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router"; // Ensure "react-router-dom" if standard
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import Checkbox from "../components/ui/Tick";
import ApiLoader from "../components/ui/ApiLoder";
import { signUpFun, signUpStatesReset } from "../features/auth/authSlice";

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signUpStates } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset state on unmount
  useEffect(() => {
    return () => dispatch(signUpStatesReset());
  }, [dispatch]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  // Password Validation Logic
  const passwordRequirements = useMemo(() => {
    const { password } = formData;
    return {
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    };
  }, [formData.password]);

  const strengthScore =
    Object.values(passwordRequirements).filter(Boolean).length;

  const handelSubmit = (e) => {
    e.preventDefault();
    const { email, userName, password } = formData;

    // 1. Basic Empty Validation
    if (!email || !userName || !password) {
      toast.error("Please fill in all fields");
      setErrors({ email: !email, userName: !userName, password: !password });
      return;
    }

    // 2. Password Regex Validation
    if (strengthScore < 3) {
      toast.error("Password does not meet requirements");
      return;
    }

    dispatch(signUpFun({ email, userName, password }));
  };

  // Listen for API response states
  useEffect(() => {
    if (signUpStates.result === "Email already exists") {
      toast.error("Email already exists");
    }
    if (signUpStates.result === "Registration Done") {
      toast.success(`OTP sent to ${formData.email}`);
      setTimeout(() => navigate("/verfiy_Otp"), 500);
    }
  }, [signUpStates, formData.email, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row min-h-[650px]">
            {/* FORM COLUMN */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>

                <form onSubmit={handelSubmit} className="space-y-5">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <input
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleChange}
                      className={errors.userName ? "inputError" : "input"}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "inputError" : "input"}
                      placeholder="johndoe@gmail.com"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "inputError" : "input"}
                      placeholder="••••••••"
                    />

                    {/* STRENGTH BAR */}
                    <div className="mt-3 flex gap-1 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore === 1
                            ? "w-1/3 bg-red-500"
                            : strengthScore === 2
                            ? "w-2/3 bg-yellow-500"
                            : strengthScore === 3
                            ? "w-full bg-green-500"
                            : "w-0"
                        }`}
                      />
                    </div>

                    {/* VALIDATION CHECKLIST */}
                    <div className="flex  justify-between flex-col md:flex-row ">
                      <div className="mt-2 text-xs space-y-1">
                        <p
                          className={
                            passwordRequirements.length
                              ? "text-green-400"
                              : "text-white"
                          }
                        >
                          {passwordRequirements.length ? "✓" : "○"} Min. 8
                          characters
                        </p>
                        <p
                          className={
                            passwordRequirements.capital
                              ? "text-green-400"
                              : "text-white"
                          }
                        >
                          {passwordRequirements.capital ? "✓" : "○"} At least
                          one capital letter
                        </p>
                        <p
                          className={
                            passwordRequirements.number
                              ? "text-green-400"
                              : "text-white"
                          }
                        >
                          {passwordRequirements.number ? "✓" : "○"} At least one
                          number
                        </p>
                      </div>
                      <div className="flex items-center justify-end">
                        <Checkbox
                          labelContent={showPassword ? "Hide" : "Show"}
                          isChecked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className={`${
                      signUpStates.loading
                        ? "auth-btnError  flex items-center justify-center"
                        : "auth-btn flex items-center justify-center py-1"
                    } `}
                    type="submit"
                    disabled={signUpStates.loading}
                  >
                    {signUpStates.loading ? <ApiLoader /> : "Create Account"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/"
                    className="auth-link text-slate-400 hover:text-white transition"
                  >
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION COLUMN */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <img
                src="/signup.png"
                alt="Signup Illustration"
                className="w-4/5 h-auto object-contain mb-6"
              />
              <div className="text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Start Your Journey Today
                </h3>
                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Free</span>
                  <span className="auth-badge">Easy Setup</span>
                  <span className="auth-badge">Private</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default SignUpPage;
