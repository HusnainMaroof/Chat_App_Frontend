import { useDispatch, useSelector } from "react-redux";
import {
  resetSaveContactStates,
  saveContactThunk,
} from "../features/socket/socketSlice";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddContact = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  // Accessing the Redux state as per your socket slice structure
  const { saveContactStates } = useSelector((state) => state.socket);
  const [error, setError] = useState(null);
  const handleAddContact = (e) => {
    dispatch(resetSaveContactStates());
    e.preventDefault();
    if (!email) {
      setError("please enter the Email");
      toast.error("please Enter the Email");
      return;
    }
    setError(null);
    dispatch(saveContactThunk({ email }));
  };

  useEffect(() => {
    if (saveContactStates?.result === "You cannot Add your Own Email") {
      setError("You cannot Add your Own Email");
      toast.error("You cannot Add your Own Email");
    } else if (
      saveContactStates?.result === "This Contact user does not exist"
    ) {
      setError("This Contact user does not exist");
      toast.error("This Contact user does not exist");
    } else if (
      saveContactStates?.result === "This user is already in your contact list"
    ) {
      setError("This user is already in your contact list");
      toast.error("This user is already in your contact list");
    } else if (saveContactStates?.result === "Contact has been saved") {
      toast.success(`   Successfully added ${email}`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [saveContactStates]);

  if (!isOpen) {
    return null;
  }

  const handelOutSide = () => {
    onClose();
    dispatch(resetSaveContactStates());
    setError(null);
    setEmail(null);
  };
  const handleClose = () => {
    onClose();
    dispatch(resetSaveContactStates());
    setError(null);
    setEmail(null);
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handelOutSide}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-violet-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
            <UserPlus className="h-8 w-8 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Add New Contact
          </h2>
          <p className="text-slate-400 text-sm px-4">
            Enter the email address of the person you'd like to chat with.
          </p>
        </div>

        {/* Conditional Rendering based on Success State */}
        {saveContactStates?.result === "Contact has been saved" ? (
          <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in">
            <div className="h-14 w-14 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-emerald-400 font-semibold text-lg">
              Contact Added!
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Successfully added {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleAddContact} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
              </div>

              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${"text-slate-500 group-focus-within:text-violet-400"}`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-800/50 border rounded-2xl py-3.5 pl-12 pr-4 ${
                    error
                      ? "inputError"
                      : "text-slate-200 placeholder:text-slate-600 outline-none transition-all border-white/10 focus:border-violet-500/50 focus:bg-slate-800"
                  }`}
                />
              </div>

              {/* Enhanced Error Messaging */}
              {error && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <p className="text-xs text-rose-300 font-medium leading-tight">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={saveContactStates?.loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saveContactStates?.loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading
                </>
              ) : (
                "Add to Contacts"
              )}
            </button>
          </form>
        )}

        {/* Encryption Badge */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-violet-500" />
            Verified Secure Invitation
            <span className="h-1 w-1 rounded-full bg-violet-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddContact;
