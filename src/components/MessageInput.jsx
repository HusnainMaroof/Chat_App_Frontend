import React, { useState, useRef, useEffect, useContext } from "react";
import { Loader2, Paperclip, Send, Smile, X, FileImage } from "lucide-react";
import { sendMessageSocket } from "../features/socket/socketService";
import { context } from "../context/context";
import { useDispatch, useSelector } from "react-redux";
import { appendMessage } from "../features/socket/socketSlice";

const MessageInput = ({ text, setText }) => {
  const { activeChat } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imageBlob, setImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Clean object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      console.error("Only image files are allowed");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageBlob(file);
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageBlob) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("message", text.trim());

      if (imageBlob) {
        formData.append("image", imageBlob);
      }

      const tempId = Date.now().toString();
      const payload = {
        senderId: user.userId,
        recipientId: activeChat.contactUserId,
        content: { text },
        tempId,
        status: "sending",
        timestamp: new Date().toISOString(),
      };

      dispatch(appendMessage(payload));

      sendMessageSocket(payload);

      setText("");
      removeImage();
      textareaRef.current?.focus();
    } catch (err) {
      console.log("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  console.log();

  return (
    <div className="p-3 sm:p-4 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 relative">
      {/* IMAGE PREVIEW */}
      {previewUrl && (
        <div className="absolute bottom-full left-0 w-full px-4 mb-2">
          <div className="max-w-5xl mx-auto">
            <div className="relative inline-block group">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-2xl border border-violet-500/50"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 h-7 w-7 bg-rose-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center">
                <FileImage className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto flex items-end gap-3"
      >
        {/* FILE BUTTON */}
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl transition ${
              previewUrl
                ? "bg-violet-500/20 text-violet-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Paperclip className="h-5 w-5" />
          </button>
        </div>

        {/* TEXTAREA */}
        <div className="flex-1 bg-slate-800/50 border border-white/10 rounded-2xl focus-within:border-violet-500/50">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              previewUrl ? "Add a caption..." : "Type your message..."
            }
            className="w-full resize-none bg-transparent py-3 px-4 text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />
        </div>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={(!text.trim() && !imageBlob) || isSending}
          className="h-12 w-12 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-2xl flex items-center justify-center disabled:opacity-50"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5 ml-0.5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
