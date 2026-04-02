
import { useAgentRun } from '../hooks/useAgentRun';
import { SUCCESS_RUN } from '../data/fixtures';

export default function AgentRunPanel() {
  const { tasks, thoughts, runInfo, finalOutput, playStream } = useAgentRun();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Research Run</h1>
            <p className="text-xl font-semibold text-slate-800">{runInfo.query || "No active query"}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              runInfo.status === 'running' ? 'bg-blue-100 text-blue-700 animate-pulse' : 
              runInfo.status === 'complete' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'
            }`}>
              {runInfo.status}
            </span>
            {runInfo.status === 'idle' && (
              <button 
                onClick={() => playStream(SUCCESS_RUN)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Run Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Task Execution Area */}
      <div className="space-y-4">
        {Object.values(tasks).map((task) => (
          <div key={task.task_id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-mono text-xs font-bold">
                  {task.agent[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{task.label}</h3>
                  <p className="text-xs text-slate-500 font-mono">{task.agent}</p>
                </div>
              </div>
              <StatusBadge status={task.status} reason={task.reason} />
            </div>
            
            {/* Tool Calls & Output would go here */}
            <div className="p-4 text-sm text-slate-600">
              {task.toolCalls.length > 0 && (
                <div className="mb-2 font-mono text-[11px] bg-slate-900 text-slate-300 p-2 rounded">
                  {task.toolCalls.map((tc, i) => (
                    <div key={i}>&gt; {tc.tool}({tc.input_summary})</div>
                  ))}
                </div>
              )}
              {task.finalContent && <p className="font-medium text-slate-800 italic">"{task.finalContent}"</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Final Result - Prominent Bottom Section */}
      {finalOutput && (
        <div className="mt-12 bg-blue-900 text-white p-8 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-bold mb-4">Synthesis Result</h2>
          <p className="text-lg leading-relaxed text-blue-50 mb-6">{finalOutput.summary}</p>
          <div className="border-t border-blue-800 pt-4 flex gap-4">
             {finalOutput.citations.map((c, i) => (
               <span key={i} className="text-xs bg-blue-800 px-2 py-1 rounded">Source: {c.title}</span>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, reason }) {
  if (status === 'cancelled' && reason === 'sufficient_data') {
    return <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded border border-purple-100">OPTIMIZED</span>;
  }
  // ... handle other statuses
  return <span className="text-[10px] font-bold uppercase text-slate-400">{status}</span>;
}