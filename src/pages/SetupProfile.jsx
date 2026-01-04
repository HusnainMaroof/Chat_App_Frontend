import React, { useState, useEffect } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ApiLoader from "../components/ui/ApiLoder";
import SetupProfileOne from "../components/SetupProfileOne";
import SetupProfileTwo from "../components/SetupProfileTwo";
import { CheckCircle2, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  authMeFun,
  updateProfileFun,
  updateProfileStatesReset,
} from "../features/auth/authSlice";

const SetupProfile = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { authMeStates, UpdateProfileStates } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    country: "",
    bio: "",
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // ✅ Real-time validation for disabling button
  useEffect(() => {
    setIsValid(formData.country.trim() && formData.bio.trim());
  }, [formData]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (step === 1) {
      const newErrors = {};
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      setStep(2);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        dispatch(updateProfileFun(formData));

        setIsSubmitting(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (UpdateProfileStates.error) {
      console.log(UpdateProfileStates.result);
      toast.error("Error while updating Profile");
      dispatch(updateProfileStatesReset());
    }

    if (UpdateProfileStates.result === "profile updated") {
      toast.success("profile updated Successfully");
      dispatch(updateProfileStatesReset());

      dispatch(authMeFun());
    }
  }, [UpdateProfileStates]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-1">
      <div className="relative w-full max-w-6xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row min-h-[640px]">
            {/* FORM COLUMN */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-slate-900/20 backdrop-blur-3xl">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    Step {step} of 2
                  </span>
                </div>
                <h1 className="text-4xl font-semibold text-white mb-3 tracking-tight">
                  {step === 1 ? "Your Identity" : "Profile Picture"}
                </h1>
                <p className="text-white text-sm font-medium leading-relaxed max-w-md">
                  {step === 1
                    ? `Welcome back ${authMeStates?.result?.userName}. Let's personalize your public profile.`
                    : "Last step! Upload a photo so the community can see the face behind the profile."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-8 flex flex-col justify-between h-full max-w-md"
              >
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <SetupProfileOne
                      key="s1"
                      formData={formData}
                      setFormData={setFormData}
                      errors={errors}
                    />
                  ) : (
                    <SetupProfileTwo
                      key="s2"
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-4 rounded-xl font-bold border border-slate-800 text-slate-400 hover:bg-slate-800/50 transition-all flex items-center justify-center"
                      title="Back to Details"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    type="submit"
                    className={`flex-1 py-4 rounded-xl font-black transition-all duration-300 relative overflow-hidden group ${
                      isSubmitting
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                        : isValid
                        ? "bg-cyan-700 text-slate-950 hover:bg-cyan-600 shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] hover:shadow-cyan-500/40"
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                    disabled={!isValid || isSubmitting}
                  >
                    <div className="relative z-10 flex items-center justify-center ">
                      {isSubmitting ? (
                        <ApiLoader />
                      ) : (
                        <>
                          <span className="text-white font-semibold">
                            {step === 1 ? "Next Step" : "Complete Profile"}
                          </span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>

            {/* ILLUSTRATION COLUMN */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-12 bg-slate-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.1),transparent_50%)]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  className="relative z-10 text-center"
                >
                  <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full scale-125 group-hover:bg-cyan-500/20 transition-all duration-700" />
                    <img
                      src={"/profile-setup.png"}
                      alt="Illustration"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="max-w-sm px-4">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-4">
                      {step === 1
                        ? "Local Networking"
                        : "Professional Presence"}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      {step === 1
                        ? "Your location helps us connect you with relevant groups and events in your specific timezone."
                        : "Profiles with high-quality photos get 12x more connections. First impressions matter."}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Trust Badges */}
              <div className="absolute bottom-10 flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-bold">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold">GDPR Ready</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default SetupProfile;
