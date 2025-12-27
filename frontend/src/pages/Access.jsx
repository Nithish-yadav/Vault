import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarBorder from "../components/StarBorder";

export default function Access() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!code.trim()) return;
    navigate(`/text/${code.trim()}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-cyan-500/30">
       {/* BACKGROUND - Simple Tech Grid */}
       <div className="fixed inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)"></div>
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
