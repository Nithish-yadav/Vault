import { useEffect, useState } from "react";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger entry animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for exit animation to finish before unmounting
      setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "border-green-500/50 bg-green-500/10 text-green-400",
    error: "border-red-500/50 bg-red-500/10 text-red-400",
    info: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-6 py-3
        rounded-xl border backdrop-blur-md shadow-2xl
        transition-all duration-300 ease-out
        max-w-[90vw] whitespace-normal text-center
        ${colors[type]}
        ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}
      `}
    >
      {icons[type]}
      <span className="font-medium tracking-wide text-sm">{message}</span>
    </div>
  );
};

export default Toast;
