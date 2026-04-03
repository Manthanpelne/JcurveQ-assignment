
import { useAgentRun } from '../hooks/useAgentRun';
import { ERROR_RUN, SUCCESS_RUN } from '../data/fixtures';
import TaskCard from './taskCard';
import { useState } from 'react';
import FinalResultView from './finalResultView';


const getTaskLayout = (tasks) => {
  const taskArray = Object.values(tasks);
  const layout = [];
  const processedIds = new Set();

  taskArray.forEach((task) => {
    if (processedIds.has(task.task_id)) return;

    if (task.parallel_group) {
      // Find all tasks in the same group
      const group = taskArray.filter(t => t.parallel_group === task.parallel_group);
      layout.push({ type: 'parallel', tasks: group, id: task.parallel_group });
      group.forEach(t => processedIds.add(t.task_id));
    } else {
      layout.push({ type: 'sequential', task: task, id: task.task_id });
      processedIds.add(task.task_id);
    }
  });

  return layout;
};

export default function AgentRunPanel() {
  const { tasks, thoughts, runInfo, finalOutput, playStream, globalError } = useAgentRun();
  const layout = getTaskLayout(tasks);


  if (runInfo.status === 'idle') {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] border-2 border-dashed border-slate-200 rounded-3xl bg-white m-8">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
        🔎
      </div>
      <h2 className="text-xl font-bold text-slate-800">JcurveIQ Research Terminal</h2>
      <p className="text-slate-500 mb-8 max-w-sm text-center">
        Select a research template to begin an orchestrated multi-agent market analysis.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => playStream(SUCCESS_RUN)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Test Success Run
        </button>
        <button 
          onClick={() => playStream(ERROR_RUN)}
          className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
        >
          Test Error Path
        </button>
      </div>
    </div>
  );
}


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

<div className="grid grid-cols-12 gap-8">
        {/* Main Execution Column */}
        <div className="col-span-8 space-y-6">
          {layout.map((item) => (
            <div key={item.id} className="animate-in fade-in slide-in-from-top-2 duration-500">
              {item.type === 'sequential' ? (
                <TaskCard task={item.task} />
              ) : (
                <div className="grid grid-cols-2 gap-4 border-l-4 border-blue-200 pl-4 py-2">
                  <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Parallel Execution Group: {item.id}
                  </div>
                  {item.tasks.map(t => (
                    <TaskCard key={t.task_id} task={t} isSmall />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar for Agent Thoughts (The "Planner's Scratchpad") */}
        <div className="col-span-4">
          <div className="sticky top-8 bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs h-[600px] overflow-y-auto shadow-2xl border-t-4 border-slate-700">
            <div className="mb-4 text-slate-500 border-b border-slate-800 pb-2 flex justify-between">
              <span>AGENT_LOG.TXT</span>
              <span className="animate-pulse">● LIVE</span>
            </div>
            {thoughts.map((thought, i) => (
              <div key={i} className="mb-4 animate-in fade-in duration-300">
                <span className="text-slate-500">[{new Date(thought.timestamp).toLocaleTimeString([], {hour12: false, minute:'2-digit', second:'2-digit'})}]</span>
                <span className="text-blue-400 ml-2 font-bold">{thought.task_id === 'coordinator' ? 'CORDR' : 'AGENT'}:</span>
                <p className="mt-1 text-slate-300 leading-relaxed italic">"{thought.thought}"</p>
              </div>
            ))}
            {thoughts.length === 0 && <p className="text-slate-600">Awaiting internal reasoning...</p>}
          </div>
        </div>
      </div>

      {/* Final Output (Step 9/10) */}
      {finalOutput && <FinalResultView output={finalOutput} />}

      {globalError && (
  <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-r-lg flex items-center gap-3 animate-bounce">
    <span className="text-2xl">🚫</span>
    <div>
      <h4 className="font-bold">System Halt</h4>
      <p className="text-sm">{globalError}</p>
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