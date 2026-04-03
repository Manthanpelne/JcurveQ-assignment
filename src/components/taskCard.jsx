
export default function TaskCard({ task, isSmall = false }) {
  const isCancelled = task.status === 'cancelled' && task.reason === 'sufficient_data';
  const isRetrying = task.status === 'running' && task.error; 
  const hasFailedPermanently = task.status === 'failed' && !task.message?.includes('Retrying');

  return (
    <div className={`
      relative transition-all duration-500 border rounded-xl overflow-hidden
      ${isSmall ? 'p-3' : 'p-5'}
      ${isCancelled ? 'bg-purple-50/50 border-purple-100 opacity-80' : 'bg-white border-slate-200 shadow-sm'}
      ${hasFailedPermanently ? 'border-red-200 bg-red-50' : ''}
    `}>
      
      {/* Top Row: Agent & Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs
            ${isCancelled ? 'bg-purple-100 text-purple-600' : 'bg-blue-600 text-white'}
          `}>
            {task.agent.split('_').map(word => word[0].toUpperCase()).join('')}
          </div>
          <div>
            <h4 className={`font-bold leading-tight ${isSmall ? 'text-xs' : 'text-sm'}`}>
              {task.label}
            </h4>
            <span className="text-[10px] font-mono text-slate-400 uppercase">{task.agent}</span>
          </div>
        </div>
        
        <StatusIndicator status={task.status} reason={task.reason} isRetrying={isRetrying} />
      </div>

      {/* Tool Calls: Terminal Style */}
      {task.toolCalls?.length > 0 && (
        <div className="space-y-1 mb-3">
          {task.toolCalls.map((tool, idx) => (
            <div key={idx} className="group bg-slate-900 rounded-md p-2 font-mono text-[10px] relative overflow-hidden">
              <div className="flex justify-between text-blue-400 mb-1">
                <span>$ {tool.tool} --input</span>
                {tool.output_summary && <span className="text-emerald-400">✓ DONE</span>}
              </div>
              <div className="text-slate-300 truncate">{tool.input_summary}</div>
              {tool.output_summary && (
                <div className="mt-1 pt-1 border-t border-slate-800 text-slate-400 italic">
                  ↳ {tool.output_summary}
                </div>
              )}
              {/* Tool Loading Bar */}
              {!tool.output_summary && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 animate-progress-indefinite w-full" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Partial / Intermediate Outputs */}
      {task.partials?.length > 0 && !isCancelled && (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex justify-between">
            <span>Live Findings</span>
            {task.status === 'complete' && <span className="text-emerald-600">Finalized</span>}
          </div>
          <div className="space-y-2">
            {task.partials.map((p, i) => (
              <div key={i} className={`text-xs leading-relaxed transition-opacity ${!p.is_final && task.status === 'complete' ? 'opacity-40' : 'opacity-100'}`}>
                <span className="text-blue-500 mr-2">✦</span>
                {p.content}
                {p.quality_score && (
                  <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">
                    Score: {p.quality_score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recovery/Error Message */}
      {task.error && (
        <div className="mt-3 text-[11px] bg-amber-50 text-amber-700 p-2 rounded border border-amber-100 flex gap-2">
          <span className="font-bold">⚠️</span>
          <span>{task.error}</span>
        </div>
      )}

      {/* Cancelled Reasoning */}
      {isCancelled && (
        <div className="mt-2 text-xs italic text-purple-600 font-medium">
          "System determined enough data was collected from other parallel streams."
        </div>
      )}
    </div>
  );
}

function StatusIndicator({ status, reason, isRetrying }) {
  const configs = {
    running: { color: 'text-blue-600 bg-blue-50', label: 'Processing', pulse: true },
    complete: { color: 'text-emerald-600 bg-emerald-50', label: 'Resolved', pulse: false },
    failed: { color: 'text-red-600 bg-red-50', label: 'Error', pulse: false },
    cancelled: { color: 'text-slate-500 bg-slate-100', label: 'Stopped', pulse: false },
  };

  const config = configs[status] || configs.running;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border border-current transition-all ${config.color} ${isRetrying ? 'animate-bounce' : ''}`}>
      {config.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      <span className="text-[9px] font-black uppercase tracking-tighter">
        {isRetrying ? 'Retrying...' : (reason === 'sufficient_data' ? 'Sufficient' : config.label)}
      </span>
    </div>
  );
}