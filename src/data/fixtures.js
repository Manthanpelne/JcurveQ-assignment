
export const SUCCESS_RUN = [
  { type: "run_started", run_id: "r_001", query: "Analyse Apple R&D intensity vs large-cap peers (2019–2023)", timestamp: 1000 },
  { type: "agent_thought", task_id: "coordinator", thought: "Breaking into: (1) Apple 10-K fetch, (2) peer identification, (3) parallel peer fetches, (4) synthesis.", timestamp: 2000 },
  { type: "task_spawned", task_id: "t_001", label: "Fetch Apple 10-K filings", agent: "filing_fetcher", parallel_group: null, depends_on: [], timestamp: 3000 },
  { type: "tool_call", task_id: "t_001", tool: "sec_edgar_search", input_summary: "ticker=AAPL, years=2019–2023", timestamp: 4500 },
  { type: "tool_result", task_id: "t_001", tool: "sec_edgar_search", output_summary: "5 filings found.", timestamp: 6000 },
  { type: "partial_output", task_id: "t_001", content: "Apple R&D spend: 2019 $16.2B → 2023 $29.9B", is_final: false, timestamp: 7000 },
  { type: "task_update", task_id: "t_001", status: "complete", timestamp: 7500 },
  // Parallel Group
  { type: "task_spawned", task_id: "t_002", label: "Fetch MSFT Data", agent: "peer_analyst", parallel_group: "p_001", depends_on: ["t_001"], timestamp: 8000 },
  { type: "task_spawned", task_id: "t_003", label: "Fetch GOOGL Data", agent: "peer_analyst", parallel_group: "p_001", depends_on: ["t_001"], timestamp: 8000 },
  { type: "task_spawned", task_id: "t_004", label: "Fetch META Data", agent: "peer_analyst", parallel_group: "p_001", depends_on: ["t_001"], timestamp: 8000 },
  { type: "task_update", task_id: "t_004", status: "failed", error: "Rate limit. Retrying...", timestamp: 9500 },
  { type: "task_update", task_id: "t_004", status: "running", timestamp: 11000 },
  { type: "task_update", task_id: "t_004", status: "cancelled", reason: "sufficient_data", message: "3 of 4 peers fetched. Proceeding.", timestamp: 13000 },
  { type: "partial_output", task_id: "t_002", content: "MSFT R&D: $27.2B", is_final: true, quality_score: 0.95, timestamp: 14000 },
  { type: "task_update", task_id: "t_002", status: "complete", timestamp: 14100 },
  { type: "partial_output", task_id: "t_003", content: "GOOGL R&D: $45.4B", is_final: true, quality_score: 0.98, timestamp: 14500 },
  { type: "task_update", task_id: "t_003", status: "complete", timestamp: 14600 },
  // Synthesis
  { type: "task_spawned", task_id: "t_005", label: "Synthesize Final Report", agent: "coordinator", depends_on: ["t_001", "t_002", "t_003"], timestamp: 16000 },
  { type: "agent_thought", task_id: "t_005", thought: "Merging peer data with Apple metrics...", timestamp: 17000 },
  { type: "partial_output", task_id: "t_005", content: "Finalizing R&D intensity analysis...", is_final: false, timestamp: 19000 },
  { type: "run_complete", run_id: "r_001", status: "complete", output: { summary: "Apple's R&D intensity has grown to 8.0%, lagging MSFT's 12.9% but growing faster in absolute dollars.", citations: [{title: "Apple 10-K 2023"}] }, timestamp: 21000 }
];