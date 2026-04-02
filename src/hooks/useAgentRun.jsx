// src/hooks/useAgentRun.js
import { useState, useEffect, useRef } from 'react';

export function useAgentRun() {
  const [tasks, setTasks] = useState({});
  const [thoughts, setThoughts] = useState([]);
  const [runInfo, setRunInfo] = useState({ status: 'idle', query: '', startTime: null });
  const [finalOutput, setFinalOutput] = useState(null);
  const timeouts = useRef([]);

  const playStream = (events) => {
    // Clear previous run
    setTasks({});
    setThoughts([]);
    setFinalOutput(null);
    timeouts.current.forEach(clearTimeout);
    
    const baseTime = events[0].timestamp;

    events.forEach(event => {
      const delay = event.timestamp - baseTime;
      const t = setTimeout(() => {
        processEvent(event);
      }, delay);
      timeouts.current.push(t);
    });
  };

  const processEvent = (event) => {
    switch (event.type) {
      case 'run_started':
        setRunInfo({ status: 'running', query: event.query, startTime: Date.now() });
        break;
      case 'agent_thought':
        setThoughts(prev => [...prev, event]);
        break;
      case 'task_spawned':
        setTasks(prev => ({
          ...prev,
          [event.task_id]: { ...event, status: 'running', toolCalls: [], partials: [] }
        }));
        break;
      case 'task_update':
        setTasks(prev => ({
          ...prev,
          [event.task_id]: { ...prev[event.task_id], ...event }
        }));
        break;
      case 'tool_call':
      case 'tool_result':
        setTasks(prev => {
          const task = prev[event.task_id];
          const calls = [...task.toolCalls];
          if (event.type === 'tool_call') {
            calls.push({ ...event });
          } else {
            const idx = calls.findIndex(c => c.tool === event.tool && !c.output_summary);
            if (idx !== -1) calls[idx] = { ...calls[idx], ...event };
          }
          return { ...prev, [event.task_id]: { ...task, toolCalls: calls } };
        });
        break;
      case 'partial_output':
        setTasks(prev => ({
          ...prev,
          [event.task_id]: { 
            ...prev[event.task_id], 
            partials: [...prev[event.task_id].partials, event],
            finalContent: event.is_final ? event.content : prev[event.task_id].finalContent
          }
        }));
        break;
      case 'run_complete':
        setRunInfo(prev => ({ ...prev, status: 'complete' }));
        setFinalOutput(event.output);
        break;
    }
  };

  return { tasks, thoughts, runInfo, finalOutput, playStream };
}