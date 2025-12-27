import FaultyTerminal from "../components/FaultyTerminal";
import ErrorBoundary from "../components/ErrorBoundary";
import StarBorder from "../components/StarBorder";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import TargetCursor from "../components/TargetCursor";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white selection:bg-cyan-500/30">
        <TargetCursor />
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <ErrorBoundary>
          <FaultyTerminal
            scale={2.5}
            gridMul={[1, 1]}
            digitSize={1.8}
            timeScale={0.7}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={0.3}
            noiseAmp={1.2}
            brightness={0.8}
            curvature={0.1}
            tint="#336363ff"
            mouseReact={true}
            mouseStrength={1}
            pageLoadAnimation={false}
          />
        </ErrorBoundary>
      </div>

      <Navbar />

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 glitch-text" style={{ fontFamily: '"Poppins", sans-serif' }}>
          VauLT
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-10 tracking-wide">
          Secure-Fast-Encrypted<br />
          The terminal for your data transfer
        </p>

        <div className="flex gap-4">
            <StarBorder 
                as="button" 
                className="cursor-pointer font-bold tracking-wider cursor-target" 
                onClick={() => navigate('/access')}
                color="#00FFFF"
            >
                ACCESS NOW
            </StarBorder>
        </div>
      </div>
    </div>
  );
}
