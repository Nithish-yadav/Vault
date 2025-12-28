import { useState } from "react";
import StarBorder from "./StarBorder";

export default function PasswordModal({ isOpen, onClose, onSubmit, title = "Enter Password" }) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm p-8 bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-mono text-white mb-6 text-center tracking-widest uppercase">{title}</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none transition-colors tracking-widest text-lg"
            autoFocus
          />
          
          <div className="flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
            
            <StarBorder as="button" type="submit" className="flex-1" color="#00FFFF">
              CONFIRM
            </StarBorder>
          </div>
        </form>
      </div>
    </div>
  );
}
