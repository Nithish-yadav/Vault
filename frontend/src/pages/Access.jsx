import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarBorder from "../components/StarBorder";
import Navbar from "../components/Navbar";

export default function Access() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!code.trim()) return;
    navigate(`/text/${code.trim()}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-cyan-500/30">
        <Navbar />
       {/* BACKGROUND - Animated Perspective Grid */}
       <div className="fixed inset-0 z-0 bg-black perspective-1000 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
            style={{
              transformOrigin: 'top',
              transform: 'rotateX(60deg) scale(2)',
              animation: 'grid-movement 1s linear infinite'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
       </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
        <div className="flex flex-col items-start gap-2">
            <label className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">Enter Access Code</label>
            <div className="flex items-center gap-2 text-xl md:text-2xl font-mono text-cyan-500">
                <span>&gt;</span>
                <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="_"
                className="
                    bg-transparent
                    border-none
                    outline-none
                    text-cyan-500
                    placeholder:text-cyan-500/50
                    w-[300px]
                    uppercase
                    tracking-widest
                "
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
            </div>
        </div>

        <StarBorder 
            as="button" 
            className="cursor-pointer" 
            onClick={handleSubmit}
            color="#00FFFF"
        >
            INITIALIZE
        </StarBorder>
      </div>
    </div>
  );
}
