import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, UploadCloud, Scissors, Check, X, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";

const SetupProfileTwo = ({ formData, setFormData }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(formData.profilePhoto || null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Crop States
  const [tempImage, setTempImage] = useState(null); // The raw image before cropping
  const [showCropModal, setShowCropModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

  const handleFileProcessing = (file) => {
    if (!file) return;

    // Check type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    // Check size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File is too large! Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
      setShowCropModal(true);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileProcessing(file);
    e.target.value = ""; // Reset input
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileProcessing(file);
  };

  // Crop Logic
  const handlePointerDown = (e) => {
    setIsPointerDown(true);
    setLastPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - lastPointerPos.x;
    const dy = e.clientY - lastPointerPos.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => setIsPointerDown(false);

  const performCrop = () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = tempImage;
    img.onload = () => {
      const size = 400; // Output size
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // Calculate source dimensions based on zoom and offset
      // This is a simplified "What you see is what you get" crop
      const displayArea = 256; // The CSS size of the crop circle
      const scale = img.naturalWidth / (displayArea * zoom);
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the image onto canvas using the current viewport transform
      ctx.translate(size / 2, size / 2);
      ctx.scale(zoom * (size / displayArea), zoom * (size / displayArea));
      ctx.translate(offset.x, offset.y);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setPreview(croppedDataUrl);
      setFormData({ ...formData, profilePhoto: croppedDataUrl });
      setShowCropModal(false);
      toast.success("Profile photo updated!");
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6 relative"
    >
      {/* Upload & Drag/Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer group relative overflow-hidden ${
          isDragging 
            ? "bg-violet-500/10 border-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.2)] scale-[1.02]" 
            : "border-slate-800 bg-slate-900/50 hover:bg-slate-800/40 hover:border-violet-500/30"
        }`}
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
              <div className="absolute inset-0 bg-violet-600/20 blur-[40px] rounded-full scale-75 animate-pulse" />
              <img
                src={preview}
                alt="Preview"
                className="w-44 h-44 rounded-full object-cover border-4 border-slate-800 relative z-10 shadow-2xl"
              />
              <div className="absolute bottom-2 right-2 p-3 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full text-white shadow-xl z-20 group-hover:scale-110 transition-transform border border-white/20">
                <Camera className="w-5 h-5" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center relative z-10"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 ${
                isDragging ? "bg-violet-500/20 border-violet-400 rotate-12" : "bg-slate-800/80 border-slate-700/50 group-hover:bg-violet-500/10 group-hover:border-violet-500/30"
              }`}>
                <UploadCloud className={`w-8 h-8 transition-colors ${isDragging ? "text-violet-400" : "text-slate-500 group-hover:text-violet-400"}`} />
              </div>
              <p className="text-base font-bold text-slate-200">
                {isDragging ? "Drop to upload" : "Set your identity"}
              </p>
              <p className="text-sm text-slate-500 mt-2 text-center max-w-[240px] leading-relaxed">
                Drag and drop or click to browse photos. <br />
                <span className="text-xs text-slate-600">
                  JPG, PNG, GIF up to 5MB
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simple Crop Modal Overlay */}
      <AnimatePresence>
        {showCropModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
              
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-violet-400" /> Adjust Photo
                </h4>
                <button 
                  onClick={() => setShowCropModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Crop Area */}
              <div className="relative w-64 h-64 mx-auto bg-black rounded-full overflow-hidden border-2 border-violet-500/30 cursor-move touch-none shadow-inner"
                   onPointerDown={handlePointerDown}
                   onPointerMove={handlePointerMove}
                   onPointerUp={handlePointerUp}
                   onPointerLeave={handlePointerUp}>
                <img 
                  src={tempImage} 
                  alt="To Crop" 
                  draggable={false}
                  className="absolute pointer-events-none origin-center max-w-none"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-50%',
                    marginTop: '-50%',
                    transition: isPointerDown ? 'none' : 'transform 0.1s'
                  }}
                />
                {/* Circular Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none ring-[100px] ring-slate-900/80 rounded-full" />
              </div>

              {/* Zoom Control */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <ZoomIn className="w-4 h-4 text-slate-500" />
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowCropModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={performCrop}
                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-violet-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save Photo
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Drag to reposition image
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SetupProfileTwo;