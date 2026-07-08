# Project Intelligence

**Version:** 1.0

**Status:** Living Document

---

# Purpose

This document defines the conceptual intelligence responsible for understanding software projects as living engineering systems.

Project Intelligence is the workspace's mechanism for maintaining deep, continuous, and evolving understanding of the software projects it serves.

This is not an implementation document. It does not discuss databases, APIs, AI models, prompts, vector databases, embeddings, frameworks, or implementation details.

Instead, it defines what it means to understand a project, how that understanding evolves, and how it serves every other intelligence capability in the workspace.

Every recommendation, workflow, guidance moment, and engineering insight depends on accurate project understanding. Project Intelligence is the foundation upon which all other workspace intelligence is built.

---

# Project Intelligence Philosophy

Projects are living systems.

They are not static collections of files. They are not frozen specifications. They are living engineering systems that grow, evolve, and accumulate knowledge over time.

A project begins as an idea. It becomes a plan. It becomes code. It becomes a deployed system. It becomes a maintained product. It eventually becomes legacy. Throughout this lifecycle, the project's understanding of itself deepens.

Projects evolve continuously. Requirements change. Technologies shift. Team composition changes. Business context transforms. Architectural decisions are revisited. Technical debt accumulates and is addressed. The project that exists today is not the project that existed six months ago.

Projects accumulate knowledge. Every decision adds to the project's engineering narrative. Every mistake teaches. Every success validates. Every revision refines. The project becomes smarter through its own history.

Projects change identity slowly but state constantly. The project's fundamental purpose—its identity—remains relatively stable. But its implementation, its architecture, its health, its momentum, and its understanding—its state—change continuously.

Project Intelligence exists to understand this living system. It maintains the workspace's understanding of what the project is, where it stands, and where it should go.

The workspace should never "forget" how a project became what it is. Every stage of evolution should be preserved, understood, and available for future reasoning. Project Intelligence ensures that the project's story is never lost.

---

# What Project Intelligence Actually Does

Project Intelligence performs several fundamental activities:

**Understand:** It builds a comprehensive model of the project—its goals, its architecture, its constraints, its health, its history, and its future direction. Understanding is not a single snapshot. It is a continuously refined model that grows richer over time.

**Interpret:** It interprets project signals—changes in files, decisions in conversations, shifts in goals, emergence of risks—and translates them into project understanding. Interpretation connects raw observation to meaningful project state.

**Connect:** It connects disparate project elements into a coherent whole. It understands how architecture decisions affect security. How timeline constraints affect quality. How past decisions constrain future options. Connection transforms isolated facts into project wisdom.

**Summarize:** It distills complex project state into actionable understanding. It knows what matters most, what can be deferred, and what must be addressed immediately. Summarization reduces cognitive load by making the project's current state accessible without requiring manual synthesis.

**Predict:** It anticipates project trajectories based on current state and historical patterns. It recognizes when momentum is building, when technical debt is accumulating, when architecture is drifting, and when risks are emerging. Prediction enables proactive guidance rather than reactive firefighting.

**Prioritize:** It determines what deserves attention right now. Not everything can be addressed simultaneously. Project Intelligence identifies the most valuable focus based on project phase, health, goals, and emerging risks.

**Track evolution:** It monitors how the project changes over time. It notices when architecture shifts, when goals evolve, when constraints change, when assumptions are challenged. Tracking evolution preserves the project's narrative.

**Detect inconsistencies:** It identifies when project reality diverges from project documentation, when new decisions contradict old ones, when goals shift without corresponding plan updates, when architecture drifts from documented principles. Detection enables conscious correction rather than silent degradation.

**Maintain continuity:** It ensures that project understanding persists across sessions, across developers, across time. The project should not need to be re-explained. Its understanding should be preserved and available.

**Guide focus:** It informs the workspace's navigation, recommendations, and workflows. Project Intelligence does not produce recommendations itself. It provides the understanding that makes recommendations relevant, timely, and project-specific.

---

# The Project Understanding Model

Project Intelligence maintains a conceptual model of the project organized in layers of abstraction.

**Project:** The top-level entity representing a cohesive software development effort. The project is the container for all understanding.

**Goals:** The objectives that drive the project forward. Goals provide direction and purpose. They answer: why does this project exist?

**Architecture:** The technical structure and design philosophy. Architecture explains how the project is organized and why. It answers: how is the project built?

**Constraints:** The boundaries within which the project must operate. Constraints include budget, timeline, technology, team, experience, and business requirements. They answer: what limits our options?

**Current State:** The project's present condition across all dimensions—what has been built, what is being built, what remains, what is healthy, and what is at risk. Current state answers: where is the project right now?

**Focus:** The single engineering concern that deserves attention now. Focus is derived from current state, goals, and project health. It answers: what matters most right now?

**Recommendations:** Guidance informed by the entire understanding model. Recommendations flow from the interaction of all layers. They answer: what should we do next, and why?

Each layer depends on the previous one. Goals without project context are generic. Architecture without goals is arbitrary. Constraints without architecture are uninformed. Current state without constraints is unrealistic. Focus without current state is guessing. Recommendations without focus are generic advice.

Project Intelligence maintains all layers simultaneously, ensuring that every recommendation is grounded in the full project understanding.

---

# Identity vs State

Projects possess both identity and state, and distinguishing between them is essential for accurate understanding.

**Project Identity** is stable and slow-changing. It represents what the project fundamentally is.

Identity includes:
- The problem it solves
- The users it serves
- The value it provides
- Its fundamental purpose

Identity persists across phases, across team changes, across technology shifts. A project's identity may persist for years while everything about its implementation changes.

**Project State** is dynamic and continuously changing. It represents what is true about the project at a given moment.

State includes:
- Current phase and progress
- Architecture and technology choices
- Health across dimensions
- Active risks and opportunities
- Recent decisions and outcomes
- Current momentum and focus

State changes with every commit, every decision, every conversation, every discovery. State is the project's immediate reality.

Understanding the difference between identity and state prevents several errors:
- It prevents treating the project as static when it is evolving
- It prevents confusing temporary state with fundamental purpose
- It enables the workspace to track evolution without losing track of identity
- It allows recommendations to respect identity while adapting to state

A project's identity remains constant while its state flows. Project Intelligence maintains both and understands how they interact.

---

# Understanding a Project

Project Intelligence maintains understanding across multiple dimensions. No single dimension is sufficient. Together they create a comprehensive project model.

**Goals:** What is this project trying to achieve? What does success look like? Goals provide the "why" behind every engineering decision.

**Users:** Who will use this software? What are their needs, constraints, and expectations? User understanding shapes design, performance, and usability decisions.

**Constraints:** What limits the project's options? Budget, timeline, technology, team size, regulations, and experience all shape what is possible.

**Architecture:** How is the project structured? What patterns guide its organization? How do components interact? Architecture understanding enables coherent evolution.

**Technology choices:** What tools, frameworks, and platforms does the project use? Why were they chosen? Technology understanding informs compatibility, maintenance, and evolution.

**Risks:** What could go wrong? Technical risks, business risks, operational risks, security risks—all must be understood to provide proactive guidance.

**Current work:** What is being built right now? What is in progress? What is paused? What is planned next? Current work understanding enables relevant guidance.

**Past decisions:** What choices have been made? Why were they made? What alternatives were rejected? Past decision understanding prevents repetition and enables consistency.

**Future direction:** Where is the project heading? What is planned? What is aspirational? Future direction understanding aligns current decisions with long-term objectives.

**Health:** How is the project performing across planning, architecture, documentation, security, testing, deployment, and maintainability? Health understanding guides prioritization.

**Knowledge:** What has the project learned? What patterns have emerged? What lessons have been documented? Knowledge understanding prevents repeated mistakes.

**Open questions:** What remains unresolved? What needs investigation? What assumptions need validation? Open question understanding prevents premature closure.

**Assumptions:** What is believed but not verified? What conditions are assumed to be true? Assumption understanding enables validation and risk management.

**Opportunities:** Where could the project improve? What alternatives exist? What optimizations are possible? Opportunity understanding enables proactive enhancement.

All these dimensions exist simultaneously. Project Intelligence maintains them as an integrated whole, not as isolated data points. Understanding a project means understanding how these dimensions interact.

---

# Project Awareness

Project Intelligence maintains continuous awareness of the project without requiring explicit requests.

Awareness means:
- The workspace always knows what the project is
- The workspace always knows where the project stands
- The workspace always knows what matters most
- Nothing requires re-explanation
- Context is preserved across sessions
- Understanding survives inactivity

Awareness grows over time. New projects start with limited understanding. As conversations occur, decisions are made, and artifacts are produced, understanding deepens. The workspace knows more about a project after six months than after six days.

Awareness adapts. As the project evolves, understanding evolves. New technologies are learned. New decisions are recorded. New risks emerge. New opportunities appear. Project Intelligence updates continuously.

Awareness survives sessions. Closing the workspace does not lose understanding. Returning to the project days or weeks later should feel like returning to a living conversation, not starting over. Project Intelligence preserves continuity.

Continuous awareness means the workspace is always ready. It does not need to "load" project context. It does not need to re-establish understanding. It knows the project as it exists right now, not as it existed when the last conversation ended.

---

# Project Evolution

Projects evolve continuously, and Project Intelligence tracks that evolution.

Evolution differs from modification. Modification is a change to a specific element. Evolution is the cumulative effect of many changes over time.

A project's architecture may evolve through hundreds of individual modifications. Its understanding of its users may evolve through dozens of conversations. Its technical debt may evolve through months of expedient decisions. Its health may evolve through gradual improvement or gradual degradation.

Project Intelligence tracks evolution by:
- Recording significant changes with context
- Noticing patterns of change over time
- Identifying when evolution accelerates or stalls
- Recognizing when evolution contradicts project goals
- Preserving the narrative of how the project became what it is

Engineering maturity grows through evolution. Early-stage projects make many changes as they discover their direction. Mature projects make fewer but more significant changes as they refine their architecture. Project Intelligence understands the project's maturity level and adjusts its expectations and guidance accordingly.

Architectural understanding changes as the project grows. Early architecture is speculative. Mature architecture is validated by implementation. Project Intelligence tracks how architectural understanding evolved and uses that history to inform future recommendations.

Evolution is not always positive. Projects can degrade through accumulated technical debt, drifting architecture, forgotten decisions, and undocumented changes. Project Intelligence notices degradation and signals when intervention is needed.

---

# Engineering Focus

Project Intelligence determines what matters most right now.

Not everything can be addressed simultaneously. A project has many dimensions, many issues, many opportunities. Focus selects the one that deserves attention.

**Urgent** matters immediately. It cannot wait. Security vulnerabilities, production incidents, and deployment blockers are urgent. They require immediate response.

**Important** matters significantly but may allow some flexibility. Architecture decisions, technical debt reduction, and planning activities are important. They shape the project's future.

**Interesting** is intellectually engaging but not critical. New technologies, optimization opportunities, and experimental features may be interesting. They deserve attention but not at the expense of urgent or important matters.

**Necessary** is required for progress. Documentation, testing, and validation are necessary. They enable other work but may not feel urgent.

**Optional** is valuable but not required. Refactoring for elegance, performance optimization beyond requirements, and aesthetic improvements are optional. They improve the project but do not block progress.

Project Intelligence distinguishes these categories and guides focus accordingly. It ensures that urgent matters receive immediate attention, important matters receive scheduled attention, and interesting matters receive attention when appropriate.

Focus is not static. It shifts as the project evolves. What was urgent yesterday may be resolved today. What was interesting may become important as the project matures. Project Intelligence continuously re-evaluates focus based on current state.

---

# Focus Drift

Projects lose focus gradually. Focus drift occurs when the project's activities diverge from its goals without conscious recognition.

Focus drift happens through:
- Accumulation of features that do not serve core goals
- Architectural changes that contradict established principles
- Technical decisions made without reference to project direction
- Conversations that wander from established priorities
- Opportunities that distract from essential work

Focus drift is rarely dramatic. It happens through many small deviations that individually seem reasonable but collectively shift the project away from its purpose.

Project Intelligence detects focus drift by:
- Comparing current activities against stated goals
- Identifying decisions that contradict established direction
- Noticing when architecture diverges from documented principles
- Recognizing when the project is building things it does not need
- Observing when momentum is spent on peripheral rather than central concerns

When focus drift is detected, Project Intelligence does not force the project back on track. It surfaces the drift, explains the discrepancy, and invites reconsideration. The developer may decide that the drift is appropriate—goals may have changed. Or the developer may recognize that drift has occurred unconsciously and adjust course.

Recovering focus is not about returning to the past. It is about ensuring that current activities align with current goals. Project Intelligence facilitates that alignment through understanding, not enforcement.

---

# Goal Awareness

Project Intelligence maintains awareness of project goals across multiple time horizons.

**Long-term goals** define the project's ultimate purpose. They are stable and persistent. They guide major decisions and provide continuity across project phases.

**Short-term goals** define immediate objectives. They are tactical and may change frequently. They guide daily engineering decisions and workflow progression.

**Hidden goals** are objectives that are not explicitly stated but influence decisions. They may emerge from business context, team preferences, or unspoken assumptions. Project Intelligence identifies hidden goals by observing decision patterns.

**Competing goals** are objectives that conflict with each other. A project may want both rapid delivery and high quality. It may want both flexibility and consistency. Competing goals require trade-offs.

**Changing goals** are objectives that evolve as the project matures. Early-stage projects have different goals than mature projects. Changing goals are natural and should be acknowledged explicitly rather than assumed constant.

Goal awareness ensures that recommendations, workflows, and guidance align with what the project is actually trying to achieve. It prevents the workspace from optimizing for goals that are no longer relevant or from ignoring goals that have emerged.

When goals change, Project Intelligence signals the shift and coordinates with other engines to re-align understanding and guidance. Goal changes are significant events that affect every dimension of project understanding.

---

# Constraint Awareness

Every project operates within constraints that limit possible approaches.

**Budgets** limit financial resources for tools, services, and infrastructure. Budget constraints shape technology choices and implementation approaches.

**Deadlines** limit time available for delivery. Timeline constraints affect scope, quality, and approach.

**Team size** limits available human resources. Team constraints affect complexity, process, and communication overhead.

**Developer experience** limits what can be built confidently. Experience constraints affect technology choices, architecture complexity, and validation requirements.

**Existing systems** create integration and compatibility requirements. Existing system constraints limit architectural freedom.

**Business constraints** include market conditions, customer requirements, regulatory compliance, and organizational politics. Business constraints often override technical preferences.

**Technical constraints** include technology choices already made, dependencies already established, and architectures already in place. Technical constraints create path dependency.

Constraint awareness ensures that recommendations respect reality. The workspace does not suggest approaches that violate known constraints. It adapts recommendations to work within boundaries.

Constraints are not obstacles to good engineering. They are parameters that make engineering relevant. Engineering without constraints is abstract. Engineering with constraints is practical.

Project Intelligence makes constraints visible throughout the project. It ensures that recommendations, workflows, and guidance acknowledge and respect the boundaries within which the project operates.

---

# Opportunity Awareness

Not every engineering moment is about solving problems. Some are about recognizing opportunities.

Opportunities are situations where the project could improve without solving an existing problem. They represent positive potential.

**Simplification** opportunities exist when the project could be simpler without losing capability. Complexity often accumulates invisibly. Opportunity awareness surfaces simplification possibilities.

**Automation** opportunities exist when manual processes could be automated. Automation reduces ongoing effort and human error.

**Optimization** opportunities exist when performance, cost, or efficiency could be improved. Optimization is not always urgent but is often valuable.

**Better tools** opportunities exist when superior technologies, libraries, or services become available. Tool improvements can reduce effort, improve quality, or enable new capabilities.

**Cost savings** opportunities exist when expenses could be reduced without sacrificing value. Cost awareness respects budget constraints while seeking efficiency.

**Architecture improvements** opportunities exist when the project structure could be reorganized for better maintainability, scalability, or clarity. Architecture opportunities are often invisible until explicitly considered.

Opportunity awareness differs from problem-solving. Problems demand attention. Opportunities invite attention. The workspace surfaces opportunities at appropriate moments without creating anxiety or urgency where none exists.

Project Intelligence continuously scans for opportunities and queues them for natural presentation. It recognizes that the best time to suggest an improvement is when the developer is receptive, not when the developer is under pressure.

---

# Risk Awareness

Every project carries risk. Project Intelligence maintains continuous awareness of risks across multiple dimensions.

**Technical risks** include unproven technologies, complex integrations, performance unknowns, and scalability concerns. Technical risks affect the project's ability to function as intended.

**Architectural risks** include structural weaknesses, coupling problems, scalability limitations, and maintenance burdens. Architectural risks affect the project's ability to evolve.

**Business risks** include market changes, funding instability, shifting requirements, and stakeholder misalignment. Business risks affect the project's continued viability.

**Operational risks** include deployment failures, monitoring gaps, incident response readiness, and disaster recovery. Operational risks affect the project's ability to serve users reliably.

**Security risks** include vulnerabilities, exposure of sensitive data, authentication weaknesses, and compliance gaps. Security risks affect the project's protection of users and data.

**Maintainability risks** include technical debt, documentation gaps, knowledge silos, and complex dependencies. Maintainability risks affect the project's long-term sustainability.

**Knowledge risks** include undocumented decisions, departed team members, lost context, and forgotten rationale. Knowledge risks affect the project's ability to learn from its history.

**Hidden risks** are threats that are not yet visible but may emerge. Hidden risks require continuous monitoring and pattern recognition.

**Unknown risks** are threats that cannot be anticipated. Unknown risks require resilience and adaptability.

Risk awareness ensures that the workspace surfaces threats before they become problems. It does not create anxiety. It creates preparedness. Risks that are known and managed are less dangerous than risks that emerge unexpectedly.

Project Intelligence tracks risks continuously. It updates risk assessments as the project evolves. It coordinates with the Recommendation Engine to propose mitigation when risks become significant.

---

# Project Signals

Projects communicate their state through signals. Project Intelligence reads these signals continuously.

**Healthy growth signals:** Steady progress, consistent quality, expanding test coverage, improving documentation, declining technical debt, increasing automation, growing team confidence.

**Stagnation signals:** Repeated discussions without decisions, features that never complete, architectural questions that remain unresolved, momentum that stalls without obvious cause.

**Confusion signals:** Contradictory decisions, unclear goals, changing requirements without re-planning, team members pursuing different directions, documentation that disagrees with reality.

**Technical debt signals:** Increasing bug rates, declining performance, growing complexity, difficult changes, developer frustration, workarounds that become permanent.

**Architecture drift signals:** Code that diverges from documented architecture, new features that bypass established patterns, components that grow without coordination, dependencies that accumulate without governance.

**Lost momentum signals:** Missed milestones, declining commit frequency, extended periods without significant progress, team members working on peripheral rather than core activities.

**Overengineering signals:** Unnecessary abstraction, premature optimization, excessive generalization, complexity beyond current needs, architectural sophistication that exceeds project maturity.

**Scope creep signals:** Features that emerge without planning, requirements that expand without evaluation, goals that multiply without prioritization, ambition that outpaces capacity.

**Delivery readiness signals:** Completed features awaiting deployment, tested code awaiting release, configured infrastructure awaiting traffic, documented processes awaiting activation.

Project Intelligence reads these signals continuously. It does not wait for explicit reports. It observes patterns, trends, and anomalies. It interprets signals in context—what indicates stagnation in one project may indicate deliberation in another.

Signals inform focus, recommendations, and workflows. They are the raw material of project awareness.

---

# Project Momentum

Momentum is the project's capacity to make progress. It is not just speed. It is consistent, directed movement toward goals.

Momentum is built through:
- Clear goals that everyone understands
- Consistent progress that builds confidence
- Small wins that compound into larger achievements
- Decisive action that resolves ambiguity
- Learning from mistakes without getting stuck
- Team alignment around shared direction

Momentum is lost through:
- Unclear goals that create confusion
- Repeated failures that erode confidence
- Analysis paralysis that prevents progress
- Changing direction without completing current work
- Mistakes that become obstacles rather than lessons
- Team misalignment that creates friction

Project Intelligence tracks momentum by observing:
- Progress velocity relative to goals
- Decision speed and quality
- Team confidence and engagement
- Completion rates for planned work
- Recovery speed from setbacks
- Clarity of current direction

When momentum is high, Project Intelligence supports acceleration by removing obstacles and providing confidence. When momentum is low, Project Intelligence identifies the cause and recommends interventions—sometimes that means addressing blockers, sometimes it means adjusting scope, sometimes it means acknowledging that the project needs time to regroup.

Momentum is not always linear. Projects may pause, redirect, and rebuild. Project Intelligence understands that momentum loss is not always failure. Sometimes it is recalibration.

---

# Project Maturity

Projects mature over time, and maturity affects what guidance is most valuable.

Maturity is understanding, not age. A project that is months old may have mature architecture if it has been thoughtfully developed. A project that is years old may have immature processes if it has grown without reflection.

**Idea:** The project exists as a concept. Understanding is speculative. Guidance focuses on validation, feasibility, and initial planning.

**Exploration:** The project is researching possibilities. Understanding is emerging. Guidance focuses on research, build-versus-buy decisions, and proof of concepts.

**Planning:** The project has clear goals and a roadmap. Understanding is structured. Guidance focuses on scope definition, architecture decisions, and resource planning.

**Building:** The project is under active development. Understanding is deepening through implementation. Guidance focuses on architecture consistency, quality assurance, and momentum maintenance.

**Stabilizing:** The project is approaching completion. Understanding is comprehensive. Guidance focuses on quality verification, deployment preparation, and knowledge preservation.

**Production:** The project is serving users. Understanding is validated by reality. Guidance focuses on reliability, monitoring, and incremental improvement.

**Growth:** The project is expanding its capabilities and user base. Understanding is challenged by scale. Guidance focuses on scalability, performance, and team coordination.

**Long-term maintenance:** The project is mature and stable. Understanding is deep. Guidance focuses on technical debt management, knowledge preservation, and evolutionary improvement.

Maturity affects every dimension of project understanding. Early-stage projects need exploratory guidance. Mature projects need refinement guidance. Project Intelligence calibrates its understanding and recommendations to the project's maturity level.

---

# Engineering Narrative

Every project tells a story. Project Intelligence preserves and understands that story.

The engineering narrative connects:
- **Past:** Why the project started, what was tried, what was learned, how decisions were made
- **Present:** What the project is now, what it is building, what challenges it faces, what momentum it has
- **Future:** Where the project is heading, what it aims to become, what obstacles it may encounter

The narrative is not a formal document. It is the accumulated understanding of why the project is the way it is.

Decisions connect the story. Each decision is a chapter. Each rejected alternative is a path not taken. Each mistake is a lesson. Each success is validation.

Reasoning preserves the story. When the workspace explains why a decision was made, it contributes to the narrative. When it connects current choices to past reasoning, it strengthens the story's continuity.

Memory explains the story. Engineering Memory preserves the narrative so that future engineers can understand not just what happened, but why.

The engineering narrative is valuable because it answers questions that data alone cannot answer:
- Why was this technology chosen over alternatives?
- Why did the architecture evolve this way?
- Why was this feature prioritized over that one?
- Why did this approach fail and that one succeed?

Project Intelligence maintains the narrative as a living understanding, not a static history. The narrative continues to grow as the project continues to evolve.

---

# Knowledge Accumulation

Projects become smarter through knowledge accumulation.

Knowledge accumulation is the process by which engineering experience transforms into engineering capability.

**Experience** occurs through implementation, testing, deployment, and maintenance. Each activity produces data—what worked, what failed, what surprised, what was learned.

**Understanding** emerges when experience is interpreted. Patterns are recognized. Causes are identified. Principles are extracted. Understanding turns data into meaning.

**Knowledge** crystallizes when understanding is validated and organized. Knowledge is experience that has been processed into reusable form.

**Wisdom** develops when knowledge is applied effectively. Wisdom is knowing not just what works, but when, why, and for whom.

Project Intelligence facilitates knowledge accumulation by:
- Recording experience with context
- Interpreting patterns across activities
- Connecting new situations to past experience
- Validating knowledge against current reality
- Making knowledge accessible for future decisions

Knowledge accumulation explains why the workspace should never require repeated explanations. The project's knowledge base grows continuously. Each conversation adds to understanding. Each decision adds to precedent. Each outcome adds to validation.

Accumulated knowledge reduces cognitive load. The developer does not need to remember everything. The workspace remembers. The developer does not need to rediscover patterns. The workspace connects current challenges to past solutions.

---

# Contradiction Detection

Projects accumulate contradictions as they evolve. Project Intelligence detects these contradictions before they compound.

**Goal vs implementation:** The project may be building features that do not serve its stated goals. Goal implementation contradiction is common when requirements evolve without explicit goal updates.

**Architecture vs reality:** The documented architecture may diverge from actual code structure. Architecture reality contradiction occurs when implementation bypasses intended patterns.

**Documentation vs decisions:** Written documentation may describe choices that have been superseded by later decisions. Documentation decision contradiction occurs when changes are not reflected in documentation.

**Roadmap vs progress:** The planned roadmap may diverge from actual progress. Roadmap progress contradiction occurs when estimates prove unrealistic or priorities shift without plan updates.

**Recommendations vs constraints:** Previous recommendations may have assumed constraints that no longer apply. Recommendation constraint contradiction occurs when context changes invalidate earlier guidance.

Project Intelligence detects contradictions by continuously comparing different project elements. It does not wait for contradictions to be reported. It identifies them through pattern recognition and inconsistency detection.

When contradictions are detected, Project Intelligence surfaces them transparently. It does not silently choose one version over another. It explains the discrepancy and invites resolution.

Contradictions are not failures. They are natural in evolving projects. The danger is not contradiction itself. It is unacknowledged contradiction that compounds over time. Project Intelligence ensures that contradictions are visible and resolved consciously.

---

# Recommendation Context

Project Intelligence prepares the context that makes recommendations meaningful.

Before the Recommendation Engine can produce useful guidance, it needs accurate project understanding. Project Intelligence provides that understanding.

Recommendation context includes:
- Current project phase and maturity
- Active goals and their priorities
- Established architecture and its rationale
- Current constraints and their source
- Recent decisions and their outcomes
- Active risks and their severity
- Available opportunities and their value
- Project health across dimensions
- Current momentum and focus
- Open questions and unresolved issues

Project Intelligence assembles this context continuously. It does not gather it on demand. By the time a recommendation is needed, the context is already current.

The quality of recommendations depends entirely on the quality of project understanding. Generic recommendations come from generic understanding. Project-specific recommendations come from project-specific understanding.

Project Intelligence ensures that every recommendation is grounded in the actual project, not in generic patterns or assumptions.

---

# Collaboration With Other Engines

Project Intelligence collaborates with every other engine in the workspace. It provides project understanding that makes their outputs relevant and accurate.

**Workspace Core:** Project Intelligence informs Workspace Core about project state, phase transitions, and focus changes. Workspace Core coordinates project lifecycle management based on this understanding.

**Observation Engine:** Project Intelligence receives raw observations from the Observation Engine. It interprets observations as project signals—file changes, decision records, conversation patterns, and activity trends.

**Intent Engine:** Project Intelligence provides project context to the Intent Engine. Intent hypotheses are evaluated against project goals and current state to determine relevance and priority.

**Context Intelligence:** Project Intelligence is a primary source of context for Context Intelligence. It provides project-level understanding that supplements immediate task context.

**Engineering Memory:** Project Intelligence retrieves historical understanding from Engineering Memory. It accesses past decisions, previous states, and project evolution to inform current understanding.

**Knowledge Engine:** Project Intelligence requests validated knowledge relevant to the project's current challenges. Knowledge Engine provides patterns and lessons that apply to the project's specific context.

**Reasoning Engine:** Project Intelligence provides the project understanding that Reasoning Engine uses to evaluate recommendations. Reasoning occurs within project context, not in abstract.

**Recommendation Engine:** Project Intelligence is the primary context provider for the Recommendation Engine. Recommendations are produced with full project understanding.

**Workflow Engine:** Project Intelligence informs the Workflow Engine about project phase, maturity, and focus. Workflows adapt to project state rather than imposing generic processes.

**Engineering GPS:** Project Intelligence provides current position and project understanding to Engineering GPS. GPS uses this understanding to determine navigation and next steps.

**Project Health:** Project Intelligence collaborates with Project Health by providing project context that informs health assessments. Health assessments inform Project Intelligence about quality trends.

**AI Orchestrator:** Project Intelligence provides project awareness to the AI Orchestrator. Orchestration uses this awareness to calibrate communication style, proactivity, and intervention timing.

Collaboration flows in both directions. Project Intelligence receives information from other engines and provides understanding to them. It is both a consumer and a producer in the intelligence network.

---

# Continuous Understanding

Project Intelligence never stops understanding the project.

Understanding is not a one-time activity. It is continuous. The project changes, and understanding changes with it.

Continuous understanding means:
- The workspace is always ready to provide relevant guidance
- No context loading is required before interactions
- Returning to the project feels like continuing, not starting
- New information is integrated immediately
- Stale understanding is detected and refreshed

Project Intelligence operates in the background, monitoring project signals, integrating new information, and updating its model. It does not wait for the developer to request understanding. It maintains understanding proactively.

Continuous understanding survives sessions, survives inactivity, survives team changes. The project's understanding is preserved in Engineering Memory and continuously refreshed through observation and interaction.

The developer should never need to remind the workspace of what the project is. The workspace should always know. Continuous understanding ensures this.

---

# Long-Term Learning

Project Intelligence improves over time through long-term learning.

Learning occurs across the project's lifetime:
- Early decisions inform later decisions
- Mistakes become lessons
- Patterns emerge from repetition
- Understanding deepens through iteration
- Knowledge compounds through use

Long-term learning means that the project becomes more capable of guiding itself as it matures. The workspace does not just remember the project. It understands the project better over time.

Learning also occurs across projects:
- Patterns from one project inform understanding of another
- Lessons from previous projects accelerate learning in new projects
- Workflow effectiveness improves across uses
- Recommendation quality increases with experience

Project Intelligence coordinates long-term learning by:
- Preserving project evolution in Engineering Memory
- Connecting current understanding to historical patterns
- Identifying cross-project learnings
- Updating project models as new evidence emerges
- Ensuring that learning compounds rather than stagnates

Long-term learning transforms the workspace from a tool that responds to current needs into a partner that grows with the project. The relationship deepens over time. Understanding becomes richer. Guidance becomes more precise. The workspace becomes more valuable the longer it works with the project.

---

# Architectural Principles

These principles govern Project Intelligence behavior and design.

**Projects are living systems.** They evolve continuously. Understanding must evolve with them.

**Understanding precedes guidance.** No recommendation is better than its project understanding. Accurate understanding is the foundation of valuable guidance.

**Identity is stable; state is fluid.** The project's purpose persists while its implementation evolves. Both must be understood.

**Continuity survives sessions.** Project understanding persists across time, inactivity, and team changes.

**Evolution is preserved, not just current state.** The project's story matters as much as its present condition.

**Context is continuously assembled.** Understanding is not gathered on demand. It is maintained proactively.

**Contradictions are surfaced, not hidden.** Discrepancies between project elements are opportunities for conscious correction.

**Opportunities are balanced with risks.** Positive potential deserves attention alongside threat awareness.

**Focus is singular.** Multiple competing priorities create confusion. One clear focus enables effective action.

**Goals guide everything.** Every understanding, every recommendation, every workflow connects to project goals.

**Maturity calibrates guidance.** Early projects need exploration. Mature projects need refinement. Guidance adapts to maturity.

**Knowledge accumulates.** Every interaction adds to understanding. Learning is continuous and compounding.

**Awareness is passive but ready.** Project Intelligence operates continuously in the background but is always available for active use.

**Understanding is shared.** Project understanding serves all other engines. It is not hoarded or fragmented.

**The developer remains in control.** Project Intelligence informs. It does not direct. The developer makes decisions.

**Simplicity serves clarity.** Complex project models are less useful than clear ones. Understanding should be accessible, not just comprehensive.

---

# Non Goals

Project Intelligence does not:

**Manage tasks.** Task management tracks work items. Project Intelligence understands the project's engineering state and direction.

**Replace reasoning.** Reasoning Engine applies engineering judgment. Project Intelligence provides the understanding that informs judgment.

**Store memory.** Engineering Memory preserves knowledge. Project Intelligence consumes memory to build understanding.

**Generate workflows.** Workflow Engine structures engineering processes. Project Intelligence informs which workflows are appropriate.

**Edit code.** Code editing is the developer's responsibility. Project Intelligence understands the codebase but does not modify it.

**Replace recommendations.** Recommendation Engine produces guidance. Project Intelligence provides the context that makes guidance relevant.

**Become project management software.** Project management serves teams and stakeholders. Project Intelligence serves engineering understanding.

**Track developer productivity.** Productivity metrics are not the goal. Engineering quality is the goal.

**Produce status reports.** Project Intelligence informs understanding. It does not generate reports for stakeholders.

**Enforce standards.** Standards are valuable, but enforcement is not Project Intelligence's role. It surfaces deviations and invites conscious choice.

**Make engineering decisions.** Decisions belong to the developer. Project Intelligence provides understanding that informs decisions.

**Operate in real-time with millisecond precision.** Project Intelligence operates continuously but not instantaneously. It maintains awareness without requiring immediate response to every change.

**Replace the developer's judgment.** Judgment is the developer's domain. Project Intelligence enriches judgment with understanding.

**Guarantee project success.** Success depends on many factors beyond understanding. Project Intelligence improves the probability of good decisions. It does not ensure outcomes.

**Focus on non-engineering aspects.** Project Intelligence understands the engineering project. Business strategy, marketing, finance, and HR are outside its scope unless they directly affect engineering decisions.

Project Intelligence exists to understand. Everything outside understanding is outside its responsibility.

---

# Closing Philosophy

Understanding a project is the foundation upon which every other intelligence capability depends.

Without project understanding, there can be no meaningful reasoning. Reasoning without context is speculation. Without project understanding, recommendations are generic advice. Without project understanding, workflows are rigid procedures. Without project understanding, memory is disconnected history. Without project understanding, guidance is irrelevant noise.

Project Intelligence ensures that the workspace does not merely remember conversations about a project. It ensures that the workspace knows the project.

Knowing a project means understanding its goals, its history, its architecture, its constraints, its health, its momentum, and its direction. It means understanding how these elements interact and evolve. It means maintaining that understanding continuously across time, sessions, and changes.

When Project Intelligence succeeds, the workspace feels like it truly knows the project. The developer does not need to explain context. The developer does not need to repeat history. The developer does not need to restate goals. The workspace already understands.

That understanding makes every other capability more valuable. Recommendations become project-specific rather than generic. Workflows become adaptive rather than rigid. Reasoning becomes grounded rather than speculative. Memory becomes meaningful rather than archival.

Project Intelligence is the workspace's memory of what the project is. It is the workspace's understanding of how the project became what it is. It is the workspace's anticipation of where the project should go.

Great engineering depends on great understanding. Project Intelligence exists to provide that understanding. Not as a one-time snapshot, but as a continuous, evolving, deepening comprehension of a living engineering system.

When the workspace understands the project, everything else follows.

---

**Version:** 1.0

**Last Updated:** July 2026