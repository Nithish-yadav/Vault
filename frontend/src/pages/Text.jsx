import { useState, useRef, useEffect } from "react";
import StarBorder from "../components/StarBorder";
import { useParams, useNavigate } from "react-router-dom";

export default function Text() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const { code } = useParams();
  const navigate = useNavigate();

  // Resize logic removed as we want full height or fixed height editor for better UX in this design
  
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Background Grid - subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Editor Container */}
      <div
        className="
            relative z-10
            w-[90vw] max-w-[800px] h-[80vh]
            bg-black/50 backdrop-blur-xl
            border border-white/10
            rounded-2xl
            flex flex-col
            overflow-hidden
            shadow-2xl shadow-black
          "
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
            </div>
            <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                SESSION: {code}
            </div>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
                Exit
            </button>
        </div>

        {/* TEXT AREA */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing..."
          className="
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
           "
           spellCheck="false"
        />

        {/* ACTION BUTTONS */}
        <div className="p-6 border-t border-white/5 flex gap-4 bg-black/20">
          <StarBorder className="w-full cursor-pointer" onClick={() => console.log('Save')}>Save</StarBorder>

          <StarBorder className="w-full cursor-pointer" color="#00FFFF" onClick={() => console.log('Lock')}>
            Lock
          </StarBorder>

          <StarBorder className="w-full cursor-pointer" color="#00FFFF" onClick={() => navigate('/')}>
             Close
          </StarBorder>
        </div>
      </div>
    </div>
  );
}
