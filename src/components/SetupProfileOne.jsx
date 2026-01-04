import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, CheckCircle2, FileText } from "lucide-react";
import { Countries } from "../data/countries";

const SetupProfileOne = ({ formData, setFormData, errors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shake animation for fields
  const shake = {
    shake: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      className="space-y-6"
    >
      <div className="space-y-5">
        {/* Country Select */}
        <motion.div
          className="relative"
          ref={selectRef}
          animate={errors?.country ? "shake" : ""}
          variants={shake}
        >
          <label className="text-[11px] text-slate-500 mb-2 block ml-1 font-bold uppercase tracking-wider">
            Origin Country
          </label>

          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full bg-slate-800/40 border ${
              errors?.country
                ? "border-rose-500 ring-2 ring-rose-500/20"
                : isOpen
                ? "border-cyan-500/50 ring-2 ring-cyan-500/10"
                : "border-slate-700/50"
            } rounded-xl py-3 px-4 flex items-center justify-between cursor-pointer transition-all`}
          >
            <div className="flex items-center gap-3">
              <Globe
                className={`w-4 h-4 ${
                  formData.country ? "text-cyan-400" : "text-slate-500"
                }`}
              />
              <span
                className={
                  formData.country ? "text-slate-100" : "text-slate-500"
                }
              >
                {formData.country || "Where are you based?"}
              </span>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 5 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full bg-slate-900 border border-slate-700 shadow-2xl rounded-xl mt-1 max-h-60 overflow-y-auto"
              >
                {Countries.map((item) => (
                  <div
                    key={item.country}
                    onClick={() => {
                      setFormData({ ...formData, country: item.country });
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      formData.country === item.country
                        ? "bg-cyan-500/10 text-cyan-400 font-bold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{item.country}</span>

                    {formData.country === item.country && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {errors?.country && (
            <p className="mt-1 text-[10px] text-rose-400 font-medium ml-1">
              {errors.country}
            </p>
          )}
        </motion.div>

        {/* Bio */}
        <motion.div
          className="relative"
          animate={errors?.bio ? "shake" : ""}
          variants={shake}
        >
          <div className="flex justify-between items-center mb-2 px-1">
            <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Profile Bio
            </label>
            <span
              className={`text-[10px] font-mono ${
                formData.bio.length > 250 ? "text-rose-400" : "text-slate-600"
              }`}
            >
              {formData.bio.length}/300
            </span>
          </div>

          <div className="relative group">
            <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <textarea
              rows="5"
              maxLength={300}
              value={formData.bio || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              className={`w-full bg-slate-800/40 border rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all resize-none leading-relaxed text-sm ${
                errors?.bio ? "border-rose-500" : "border-slate-700/50"
              }`}
              placeholder="Tell everynoe about your passions, skills, or what you're looking for..."
            />
          </div>

          {errors?.bio && (
            <p className="mt-1 text-[10px] text-rose-400 font-medium ml-1">
              {errors.bio}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SetupProfileOne;
