import { Loader2 } from "lucide-react";

const ApiLoader = ({ text }) => (
  <div className="flex items-center gap-2">
    <Loader2 className="w-5 h-5 animate-spin text-white" />
    <span className="text-white text-sm font-medium">{text}...</span>
  </div>
);

export default ApiLoader;
