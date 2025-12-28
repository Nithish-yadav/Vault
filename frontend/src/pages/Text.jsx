import { useState, useRef, useEffect, useCallback } from "react";
import StarBorder from "../components/StarBorder";
import Toast from "../components/Toast";
import PasswordModal from "../components/PasswordModal";
import { useParams, useNavigate } from "react-router-dom";
import { sessionAPI } from "../services/api";


// Simple debounce function definition since we might not have lodash
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}

export default function Text() {
  const [text, setText] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedText, setLastSavedText] = useState(""); // Track saved state
  const [toast, setToast] = useState(null);
  const [sessionPassword, setSessionPassword] = useState(null); // Store password for authenticated access
  
  // Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState("LOCK"); // "LOCK" or "UNLOCK" or "ACCESS"

  const textareaRef = useRef(null);
  const { code } = useParams();
  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Load session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const session = await sessionAPI.getSession(code);
        const fetchedText = session.text || "";
        setText(fetchedText);
        setLastSavedText(fetchedText);
        setIsLocked(session.isLocked);
        
        // If locked and no text returned (first load), show Access Modal
        if (session.isLocked && !session.text) {
             setPasswordModalMode("ACCESS");
             setIsPasswordModalOpen(true);
        }

      } catch (error) {
        console.error("Failed to load session:", error);
        showToast("Unable to retrieve session. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [code]);

  // Auto-save logic
  const performAutoSave = async (currentText) => {
    if (isLocked && !sessionPassword) return; // Don't save if locked and not authenticated
    
    setSaving(true);
    try {
      await sessionAPI.saveText(code, currentText, sessionPassword);
      setLastSavedText(currentText);
      // We purposefully don't show a toast for every auto-save to avoid spam
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const debouncedSave = useDebounce(performAutoSave, 1000);

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    debouncedSave(newText);
  };

  // Manual Save
  const handleSave = async () => {
    if (isLocked && !sessionPassword) {
      showToast("Session is locked. Unlock to edit/save.", "info");
      return;
    }
    
    setSaving(true);
    try {
      await sessionAPI.saveText(code, text, sessionPassword);
      setLastSavedText(text);
      showToast("Session saved successfully.", "success");
    } catch (error) {
      console.error("Failed to save:", error);
      showToast("Failed to save changes. Please check connection.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Trigger Lock/Unlock flows
  const handleLockClick = () => {
    if (isLocked) {
        // Unlock Flow (Re-authenticate or Un-cache password?)
        // If we are already authenticated (have password), maybe "Lock" means "Clear local password"?
        // But user wants "Persistent Lock". 
        // Let's make "UNLOCK" button allow entering password if we don't have it, 
        // OR if we DO have it, maybe it does nothing or "Relocks" (clears local cache)?
        
        if (sessionPassword) {
            // We are authenticated. Clicking lock should probably "Logout" (clear local password)
            setSessionPassword(null);
            setText(""); // Clear text for security
            showToast("Session secure. Local access cleared.", "success");
        } else {
            // We are not authenticated. Open Modal to unlock.
            setPasswordModalMode("UNLOCK");
            setIsPasswordModalOpen(true);
        }
    } else {
        // Lock Flow (Set new password)
        setPasswordModalMode("LOCK");
        setIsPasswordModalOpen(true);
    }
  };

  // Handle Password Submission from Modal
  const handlePasswordSubmit = async (password) => {
    setIsPasswordModalOpen(false); // Close modal first

    try {
        if (passwordModalMode === "LOCK") {
            // Force save before locking
            if (text !== lastSavedText && !isLocked) {
                await sessionAPI.saveText(code, text);
            }
            await sessionAPI.lockSession(code, password);
            setIsLocked(true);
            setSessionPassword(password); // Authenticated immediately
            showToast("Session secured. You are authenticated.", "success");
            
        } else if (passwordModalMode === "UNLOCK" || passwordModalMode === "ACCESS") {
            const response = await sessionAPI.unlockSession(code, password);
            setText(response.text);
            setSessionPassword(password); // Store password for future saves
            // Note: isLocked stays TRUE from backend now, but we are authenticated locally
            setIsLocked(response.isLocked); 
            showToast("Authenticated. You can now edit.", "success");
        }
    } catch (error) {
        console.error("Operation failed:", error);
        showToast(passwordModalMode === "LOCK" ? "Failed to lock session." : "Access Denied: Invalid password.", "error");
        
        // Re-open modal if it was an access attempt so they can try again
        if (passwordModalMode === "ACCESS") {
            setTimeout(() => setIsPasswordModalOpen(true), 500);
        }
    }
  };

  // Close session
  const handleClose = () => {
    // Optional: could warn if unsaved changes, but auto-save handles most cases
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-2xl mb-2 animate-pulse">Establishing Secure Connection...</div>
          <div className="text-gray-500 font-mono tracking-widest">{code}</div>
        </div>
      </div>
    );
  }

  // 🔒 LOCKED STATE UI - Only shown if NO text is available AND not authenticated
  if (isLocked && !sessionPassword && !text && !isPasswordModalOpen) {
     // Fallback if modal is closed but we have no text (shouldn't really happen with new logic, but safe-guard)
     return (
        <div className="w-screen h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl text-red-500 tracking-widest mb-4">AUTHENTICATION REQUIRED</h2>
                <StarBorder as="button" onClick={() => setIsPasswordModalOpen(true)} color="#ef4444">
                    ENTER PASSWORD
                </StarBorder>
            </div>
            {/* Modal handles the actual input */}
            <PasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => navigate('/')} 
                onSubmit={handlePasswordSubmit}
                title="SESSION LOCKED" 
            />
        </div>
     );
  }
  
  // 🔓 EDITOR UI (Editable if authenticated, Read-Only if locked & not authenticated)
  // Determine validation status
  const canEdit = !isLocked || !!sessionPassword;

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Toast & Modal */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => {
            setIsPasswordModalOpen(false);
            // If checking access on load and cancelled, go home
            if (passwordModalMode === "ACCESS") navigate('/');
        }} 
        onSubmit={handlePasswordSubmit}
        title={passwordModalMode === "LOCK" ? "SET SESSION PASSWORD" : "UNLOCK SESSION"}
      />

      {/* Background Grid - subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Editor Container */}
      <div
        className={`
            relative z-10
            w-[90vw] max-w-[800px] h-[80vh]
            bg-black/50 backdrop-blur-xl
            border 
            ${isLocked && !sessionPassword ? 'border-red-500/30' : 'border-cyan-500/30'}
            rounded-2xl
            flex flex-col
            overflow-hidden
            shadow-2xl 
            transition-all duration-500
          `}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLocked && !sessionPassword ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
            </div>
            <div className="font-mono text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                SESSION: {code}
                {saving && <span className="text-cyan-500 animate-pulse">...SAVING</span>}
                {isLocked && !sessionPassword && <span className="text-red-500 flex items-center gap-1 font-bold"><span className="animate-pulse">●</span> READ ONLY</span>}
                {isLocked && sessionPassword && <span className="text-green-500 flex items-center gap-1 font-bold"><span className="animate-pulse">●</span> AUTHENTICATED</span>}
            </div>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
                Exit
            </button>
        </div>

        {/* TEXT AREA */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={canEdit ? "Start typing..." : "Session is locked. Unlock to edit."}
          disabled={!canEdit}
          className={`
            flex-1
            w-full
            resize-none
            bg-transparent
            text-gray-300
            caret-white
            outline-none
            font-mono
            text-sm md:text-base
            p-6
            leading-relaxed
            placeholder:text-gray-700
            scrollbar-none
            selection:bg-white/20
            disabled:opacity-80
            disabled:cursor-default
            transition-opacity duration-300
           `}
           spellCheck="false"
        />

        {/* ACTION BUTTONS */}
        <div className="p-4 md:p-6 border-t border-white/5 flex flex-col md:flex-row gap-3 md:gap-4 bg-black/20">
          <StarBorder 
            className="w-full cursor-pointer" 
            onClick={handleSave}
            disabled={saving || !canEdit}
            color={canEdit ? "#00FFFF" : "#4b5563"} 
          >
             {saving ? 'SAVING...' : 'SAVE'}
          </StarBorder>

          <StarBorder 
            className="w-full cursor-pointer" 
            color={sessionPassword ? "#ef4444" : "#00FFFF"} 
            onClick={handleLockClick}
          >
            {sessionPassword ? 'RELOCK' : (isLocked ? 'UNLOCK' : 'LOCK')}
          </StarBorder>

          <StarBorder 
            className="w-full cursor-pointer" 
            color="#00FFFF" 
            onClick={handleClose}
          >
             CLOSE
          </StarBorder>
        </div>
      </div>
    </div>
  );
}
