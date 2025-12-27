 import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-semibold text-white">
          Share text across devices
        </h1>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/access")}
            className="px-6 py-3 rounded-full bg-white text-black font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
