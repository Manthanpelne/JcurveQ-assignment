export default function FinalResultView({ output }) {
  return (
    <div className="mt-12 bg-slate-900 text-white p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 border-t-4 border-blue-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl">
          ✨
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Executive Summary</h2>
      </div>
      
      <p className="text-lg leading-relaxed text-slate-300 mb-8 border-l-2 border-slate-700 pl-6 italic">
        {output.summary}
      </p>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Sources & Citations</h3>
        <div className="flex flex-wrap gap-3">
          {output.citations?.map((cite, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors cursor-default"
            >
              <span className="text-blue-400 text-xs">📄</span>
              <span className="text-xs font-medium text-slate-200">{cite.title}</span>
              {cite.page && <span className="text-[10px] text-slate-500">p.{cite.page}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}