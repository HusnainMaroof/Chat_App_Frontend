import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import ApiLoader from "../components/ui/ApiLoder";
import SetupProfileTwo from "../components/SetupProfileTwo";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import SetupProfileOne from "../components/SetupProfileOne";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  authMeFun,
  updateProfileFun,
  updateProfileStatesReset,
} from "../features/auth/authSlice";

const SetupProfile = () => {
  const dispatch = useDispatch();
  const { UpdateProfileStates } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    bio: "",
    profilePhoto: null,
  });
  const [errors, setErrors] = useState({});

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (formData.bio.trim().length < 10)
      newErrors.bio = "Bio must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    dispatch(updateProfileStatesReset());
    if (e) e.preventDefault();

    // single source of truth
    if (UpdateProfileStates.loading || isCropping) return;

    if (step === 1) {
      if (validateStepOne()) setStep(2);
      return;
    }

    dispatch(updateProfileFun(formData));
  };

  useEffect(() => {
    if (UpdateProfileStates.error) {
      toast.error(
        UpdateProfileStates.result === "file uploading Error"
          ? "file Uploading Error"
          : "Something went wrong"
      );
      dispatch(updateProfileStatesReset());
    }

    if (UpdateProfileStates.result === "profile updated") {
      toast.success("Profile setup successfully completed!");
      setTimeout(() => {
        dispatch(authMeFun());
        dispatch(updateProfileStatesReset());
      }, 1000);
    }
  }, [UpdateProfileStates, dispatch]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x { animation: gradient-x 15s ease infinite; }
      `}</style>

      <div className="relative w-full max-w-6xl">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row min-h-[640px]">
            {/* FORM SIDE */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-slate-900/40 backdrop-blur-3xl border-r border-white/5">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Complete Setup
                </h2>
                <p className="text-slate-400 mt-2">
                  Almost there! Your profile helps us personalize your
                  networking experience.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-8 flex flex-col justify-center h-full max-w-md w-full"
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
                      setIsCropping={setIsCropping}
                    />
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {step === 2 &&
                    !UpdateProfileStates.loading &&
                    !isCropping && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="p-4 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800/50 transition-all flex items-center justify-center"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                  <button
                    type="submit"
                    disabled={UpdateProfileStates.loading || isCropping}
                    className={`flex-1 py-4 rounded-xl font-black transition-all duration-300 relative overflow-hidden group ${
                      UpdateProfileStates.loading || isCropping
                        ? "bg-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                        : "bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] hover:shadow-cyan-500/40"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {UpdateProfileStates.loading ? (
                        <ApiLoader text={"Updateing Profile"} />
                      ) : (
                        <>
                          <span>
                            {step === 1 ? "Next Step" : "Complete Profile"}
                          </span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>

            {/* ART SIDE */}
            <div className="hidden md:w-1/2 md:flex flex-col items-center justify-center p-12 bg-slate-900/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.1),transparent_50%)]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  className="relative z-10 text-center"
                >
                  <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full  group-hover:bg-cyan-500/20 transition-all duration-700" />
                    <div className="relative p-4 bg-slate-800/40 rounded-[2.5rem]  backdrop-blur-xl shadow-2xl">
                      <img src="./profile-setup.png" alt="" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className=" flex gap-6  grayscale hover:grayscale-0 transition-all duration-500 text-white">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-white">
                    SSL Secure
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white">
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
