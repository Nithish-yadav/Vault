import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6">
      <nav
        className="
          flex items-center justify-between
          px-8 py-4
          rounded-full
          bg-white/5 backdrop-blur-md
          border border-white/10
          text-white
          w-[90%] max-w-[500px]
          shadow-lg shadow-black/50
        "
      >
        <div className="font-bold tracking-wider text-xl">Vault</div>

        <div className="flex gap-6 text-sm font-medium opacity-80">
          <button 
            onClick={() => navigate('/')} 
            className="hover:opacity-100 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => window.open('https://github.com/Nithish-yadav/Vault.git', '_blank')} 
            className="hover:opacity-100 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Docs
          </button>
        </div>
      </nav>
    </div>
  );
}
