// Environment variable wrapper
// Vite exposes VITE_* vars via import.meta.env
export const VITE_PUBLIC_BASE_URL: string =
  import.meta.env.VITE_PUBLIC_BASE_URL || 'http://localhost:5173';
