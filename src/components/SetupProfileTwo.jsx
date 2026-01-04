import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const SetupProfileTwo = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(formData.profilePhoto || null);

const handleFileChange = (e) => {
  const myfile = e.target.files[0];

  if (!myfile) return;

  // Check if file is larger than 5MB
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (myfile.size > maxSize) {
    toast.error("File is too large! Please select an image under 5MB.");
    e.target.value = ""; 
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData({ ...formData, profilePhoto: reader.result });
    setPreview(reader.result);
  };
  reader.readAsDataURL(myfile);
};
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <div
        className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-800 rounded-[2rem] bg-slate-900/50 hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all cursor-pointer group relative overflow-hidden"
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-400/20 blur-[40px] rounded-full scale-75" />
              <img
                src={preview}
                alt="Preview"
                className="w-44 h-44 rounded-full object-cover border-4 border-slate-800 relative z-10 shadow-2xl"
              />
              <div className="absolute bottom-2 right-2 p-3 bg-cyan-600 rounded-full text-white shadow-xl z-20 group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center relative z-10"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-500">
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <p className="text-base font-bold text-slate-200">
                Set your identity
              </p>
              <p className="text-sm text-slate-500 mt-2 text-center max-w-[240px] leading-relaxed">
                Click to browse your photos. <br />
                <span className="text-xs text-slate-600">
                  JPG, PNG, GIF up to 5MB
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SetupProfileTwo;
