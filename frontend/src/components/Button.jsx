export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  mt = "mt-4",
}) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none";

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      onClick={onClick}
      className={`${mt} ${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
