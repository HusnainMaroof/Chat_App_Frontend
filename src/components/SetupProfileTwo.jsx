import DragDropImage from "./DragDropImage";
import { motion, AnimatePresence } from "framer-motion";

const SetupProfileTwo = ({ formData, setFormData, setIsCropping }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <DragDropImage
        value={formData.profilePhoto}
        onChange={(img) => setFormData({ ...formData, profilePhoto: img })}
        setIsCropping={setIsCropping}
      />
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-full border border-white/5 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-slate-600" />
          <div className="w-4 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-2">
            Step 2 of 2
          </span>
        </div>
      </div>
    </motion.div>
  );
};
export default SetupProfileTwo;
