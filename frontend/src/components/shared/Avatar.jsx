export default function Avatar({ src, alt, size = "medium" }) {
  const sizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-24 h-24"
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-purple-200 flex items-center justify-center overflow-hidden`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-purple-600">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </span>
      )}
    </div>
  )
}