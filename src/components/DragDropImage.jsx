import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Scissors, UploadCloud, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const DragDropImage = ({ value, onChange, setIsCropping }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (setIsCropping) setIsCropping(showCropModal);
  }, [showCropModal, setIsCropping]);

  const handleFileProcessing = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const uiContainerSize = 256;
        const scale = Math.max(
          uiContainerSize / img.width,
          uiContainerSize / img.height
        );

        setBaseScale(scale);
        setTempImage(reader.result);
        setShowCropModal(true);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
    };
    reader.readAsDataURL(file);
  };

  const performCrop = () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = tempImage;
    img.onload = () => {
      const outputSize = 512;
      const uiSize = 256;
      const pixelRatio = outputSize / uiSize;

      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, outputSize, outputSize);

      ctx.save();
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.translate(offset.x * pixelRatio, offset.y * pixelRatio);

      const finalScale = baseScale * zoom * pixelRatio;
      ctx.scale(finalScale, finalScale);

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      onChange(canvas.toDataURL("image/jpeg", 0.9));
      setShowCropModal(false);
    };
  };

  const handleCancel = () => {
    setShowCropModal(false);
    setTempImage(null);
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileProcessing(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current.click()}
        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2.5rem] transition-all cursor-pointer group relative overflow-hidden ${
          isDragging
            ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-[1.02]"
            : "border-slate-800 bg-slate-900/50 hover:bg-slate-800/40 hover:border-cyan-500/30"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={(e) => handleFileProcessing(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-600/20 blur-[40px] rounded-full scale-75 animate-pulse" />
              <img
                src={value}
                alt="Preview"
                className="w-44 h-44 rounded-full object-cover border-4 border-slate-800 relative z-10 shadow-2xl"
              />
              <div className="absolute bottom-2 right-2 p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full text-white shadow-xl z-20 group-hover:scale-110 transition-transform border border-white/20">
                <Camera className="w-5 h-5" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 ${
                  isDragging
                    ? "bg-cyan-500/20 border-cyan-400 rotate-12"
                    : "bg-slate-800/80 border-slate-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30"
                }`}
              >
                <UploadCloud
                  className={`w-8 h-8 transition-colors ${
                    isDragging
                      ? "text-cyan-400"
                      : "text-slate-500 group-hover:text-cyan-400"
                  }`}
                />
              </div>
              <p className="text-base font-bold text-slate-200">
                {isDragging ? "Drop to upload" : "Set your identity"}
              </p>
              <p className="text-sm text-slate-500 mt-2 text-center max-w-[240px] leading-relaxed">
                Drag and drop or click to browse. <br />
                <span className="text-xs text-slate-600 tracking-wider font-medium uppercase">
                  JPG, PNG, GIF UP TO 5MB
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/75"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-white/10 rounded-[2.5rem] py-8 md:p-8 max-w-sm w-full shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-600" />
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-cyan-400" /> Adjust Profile
                  Photo
                </h4>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className="relative md:w-64 w-52 h-52 md:h-64 mx-auto bg-black rounded-full overflow-hidden border-2 border-cyan-500/30 cursor-move touch-none shadow-inner"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setIsPointerDown(true);
                  setLastPointerPos({ x: e.clientX, y: e.clientY });
                }}
                onPointerMove={(e) => {
                  if (!isPointerDown) return;
                  const dx = e.clientX - lastPointerPos.x;
                  const dy = e.clientY - lastPointerPos.y;
                  setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
                  setLastPointerPos({ x: e.clientX, y: e.clientY });
                }}
                onPointerUp={(e) => {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  setIsPointerDown(false);
                }}
                onPointerCancel={() => setIsPointerDown(false)}
              >
                <img
                  src={tempImage}
                  alt="Crop"
                  draggable={false}
                  className="absolute pointer-events-none max-w-none left-1/2 top-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${
                      offset.x
                    }px), calc(-50% + ${offset.y}px)) scale(${
                      baseScale * zoom
                    })`,
                    transition: isPointerDown
                      ? "none"
                      : "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
                <div className="absolute inset-0 pointer-events-none ring-[100px] ring-slate-950/85 rounded-full" />
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <ZoomIn className="w-4 h-4 text-slate-500" />
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={performCrop}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DragDropImage;
