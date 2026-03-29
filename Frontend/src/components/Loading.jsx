export const Loading = ({title}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#012029] rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-semibold animate-pulse">{title}</p>
    </div>
  );
}