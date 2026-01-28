import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
// Assuming Countries is an array of objects: [{ country: "Afghanistan" }, ...]
import { Countries } from "../data/countries";

const SetupProfileOne = ({ formData, setFormData, errors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  // Filter countries based on search term
  const filteredCountries = Countries.filter((item) =>
    item.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm(""); // Reset search when closing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <motion.div
          className="relative"
          ref={selectRef}
          animate={errors?.country ? "shake" : ""}
          variants={shake}
        >
          <label className="text-[11px] text-slate-500 mb-2 block ml-1 font-bold uppercase tracking-wider">
            Origin Country
          </label>

          {/* Dropdown Toggle */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full bg-slate-800/40 border ${
              errors?.country
                ? "border-rose-500 ring-2 ring-rose-500/20"
                : isOpen
                  ? "border-cyan-500/50 ring-2 ring-cyan-500/10"
                  : "border-slate-700/50"
            } rounded-xl py-3 px-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800/60`}
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
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute z-50 w-full bg-slate-900 border border-slate-700 shadow-2xl rounded-xl mt-1 overflow-hidden flex flex-col max-h-72"
              >
                {/* Search Input Area */}
                <div className="p-2 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      autoFocus
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Country List */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((item) => (
                      <div
                        key={item.country}
                        onClick={() => {
                          setFormData({ ...formData, country: item.country });
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                        className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                          formData.country === item.country
                            ? "bg-cyan-500/10 text-cyan-400 font-bold"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span>{item.country}</span>
                        {formData.country === item.country && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-xs text-slate-500 italic">
                      No countries found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors?.country && (
            <p className="mt-1 text-[10px] text-rose-400 font-medium ml-1">
              {errors.country}
            </p>
          )}
        </motion.div>

        {/* Profile Bio Section */}
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
                formData.bio.length >= 300 ? "text-rose-400" : "text-slate-600"
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
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className={`w-full bg-slate-800/40 border rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all resize-none leading-relaxed text-sm ${
                errors?.bio ? "border-rose-500" : "border-slate-700/50"
              }`}
              placeholder="Tell everyone about your passions, skills, or what you're looking for..."
            />
          </div>
          {errors?.bio && (
            <p className="mt-1 text-[10px] text-rose-400 font-medium ml-1">
              {errors.bio}
            </p>
          )}
        </motion.div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-full border border-white/5 backdrop-blur-sm">
          <div className="w-4 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="w-2 h-2 rounded-full bg-slate-600" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-2">
            Step 1 of 2
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SetupProfileOne;
