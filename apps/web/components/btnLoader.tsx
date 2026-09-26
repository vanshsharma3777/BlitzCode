export default function ButtonLoader() {
  return (
    <div className="relative flex items-center justify-center w-5 h-5">

      <div className="absolute inset-0 rounded-full border-2 border-[var(--borders)] opacity-40" />

      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)] border-r-[var(--accent)] animate-spin shadow-[0_0_8px_var(--accent-glow)]" />

    
      <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-pulse" />
    </div>
  );
}