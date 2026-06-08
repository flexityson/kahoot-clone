export default function Button({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }) {
  const baseStyle = "px-6 py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"

  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-purple-600/30",
    secondary: "bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-rose-700 hover:-translate-y-0.5 hover:shadow-red-600/30",
    outline: "border-2 border-purple-500 text-purple-600 bg-transparent hover:bg-purple-50 hover:-translate-y-0.5 hover:shadow-sm",
    glass: "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-md"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}