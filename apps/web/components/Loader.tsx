export default function Loader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
      <span className="text-sm text-slate-300">Processing...</span>
    </div>
  );
}
