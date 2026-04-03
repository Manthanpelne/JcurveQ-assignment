
### 1. Agent Thoughts: The "Planner's Scratchpad"
**Decision:** I implemented agent thoughts as a persistent, auto-scrolling sidebar log with a terminal-style aesthetic (dark background, emerald text).  
**Reasoning:** Financial analysts are the target users. They require high levels of auditability. By separating "thoughts" from "tasks," we provide a "Chain of Thought" that doesn't clutter the primary action list but remains available for the user to verify *why* the coordinator made certain decisions.  
**Reconsideration Signal:** If user testing shows analysts find the technical jargon in thoughts distracting, I would move this behind an "Internal Logs" toggle.

### 2. Parallel Task Layout: Grid-in-List
**Decision:** Tasks sharing a `parallel_group` ID are rendered in a 2-column responsive grid, visually grouped by a left-accent border and a group header.  
**Reasoning:** A strictly vertical list for parallel tasks implies a sequential dependency that doesn't exist. The grid layout visually communicates "simultaneity" and makes the UI feel faster and more efficient. It also prevents "scroll fatigue" when the coordinator spawns many peer-fetchers at once.  
**Reconsideration Signal:** If the system regularly spawns more than 4 tasks in parallel, a 2-column grid might become too tall; I would switch to a condensed "Badge Cloud" or a horizontal carousel.

### 3. Partial Outputs: Live Streaming vs. Finality
**Decision:** Intermediate outputs (`is_final: false`) are displayed inline immediately. When a final output arrives, the intermediates are kept but dimmed (reduced opacity).  
**Reasoning:** In a long-running research task (20s+), "stale" spinners kill trust. Seeing "Apple R&D spend: $16.2B" appear mid-run gives the user immediate value and proof of life. Dimming them upon completion ensures the user's eye is drawn only to the verified, final data point.  
**Reconsideration Signal:** If partial outputs are frequently corrected/contradicted by final outputs, I would hide them to avoid "data whiplash."

### 4. Cancelled with Reason: "Sufficient Data"
**Decision:** This state is styled with a **Purple/Indigo** palette and labeled as **"OPTIMIZED"** rather than "Cancelled."  
**Reasoning:** To a non-technical user, "Cancelled" sounds like a failure or a manual intervention. By using a "smart" color like purple and a label like "Optimized," we frame the event as a success of the Coordinator's intelligence (saving time/resources because the answer is already clear).  
**Reconsideration Signal:** If analysts express concern that they are "missing" data, I would add a tooltip explaining exactly which data points were deemed redundant.

### 5. Task Dependency Awareness
**Decision:** Tasks that have `depends_on` requirements are rendered in a "Queued" or "Waiting" state until their dependencies complete.  
**Reasoning:** Rather than drawing complex SVG lines (Gantt charts), which can be overwhelming, we use status-based sequencing. This ensures the UI never contradicts the execution logic—a "Synthesis" task will never appear to be running while its "Fetch" dependencies are still spinning.  
**Reconsideration Signal:** For extremely complex trees (depth > 5), a small "mini-map" or breadcrumb of dependencies might be necessary to explain long wait times.