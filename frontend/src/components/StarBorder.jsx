const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "#00FFFF",
  speed = "3s",
  children,
  ...rest
}) => {
  return (
    <Component
      className={`group relative inline-block overflow-visible ${className}`}
      {...rest}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl -z-20"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />
      
      {/* Main button content */}
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-950/90 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-cyan-500/20">
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Animated particles */}
        <div
          className="absolute w-[200%] h-[200%] opacity-30 -bottom-1/2 -right-full rounded-full group-hover:opacity-50 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${color}40, transparent 40%)`,
            animation: `float ${speed} ease-in-out infinite`,
          }}
        />
        
        {/* Text content */}
        <div className="relative z-10 px-8 py-4 text-center">
          <span className="text-base font-bold tracking-widest bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-200 group-hover:to-purple-300 transition-all duration-300">
            {children}
          </span>
        </div>
      </div>
    </Component>
  );
};

export default StarBorder;
