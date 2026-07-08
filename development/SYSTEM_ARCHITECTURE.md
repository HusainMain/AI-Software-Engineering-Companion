# System Architecture

**Version:** 1.1

**Status:** Living Document

---

# Purpose

This document defines the conceptual architecture of the AI Software Engineering Workspace.

It describes how the major capabilities of the workspace collaborate to create the behaviors defined in:

- PRODUCT_BLUEPRINT.md
- WORKSPACE_BEHAVIOR.md
- CORE_CONCEPTS.md

This is not a technical architecture document. It does not discuss programming languages, frameworks, databases, APIs, networking, deployment, or implementation.

Instead, it defines the major subsystems, their responsibilities, and how information flows between them.

The architecture should remain technology agnostic and valid for many years.

---

# Architectural Philosophy

Architecture is organized around responsibilities, not technologies.

Every subsystem exists to reduce developer cognitive load. Intelligence is distributed across specialized capabilities rather than concentrated in one monolithic AI. Context is more valuable than raw conversation history. Decisions are first-class engineering assets.

Systems collaborate instead of operating independently. Information should flow intentionally rather than being broadcast everywhere. The workspace should become smarter through accumulated engineering knowledge.

---

# High-Level View

The workspace consists of multiple collaborating intelligence engines.

Each engine has:

- Clear responsibility
- Clear inputs
- Clear outputs
- Clear boundaries

No engine should become responsible for everything. Specialization enables quality, while collaboration enables completeness.

---

# Architectural Layers

Although the workspace contains many collaborating engines, they naturally organize into conceptual layers.

The layers are conceptual, not technical. They describe responsibility boundaries rather than implementation tiers.

## Developer Interaction Layer

**Contains:** Workspace Core, AI Orchestrator

**Purpose:** Everything directly responsible for interacting with the developer and coordinating the workspace.

This layer manages the developer experience, session orchestration, and AI interaction coordination. It translates developer intent into subsystem actions and subsystem outputs into understandable guidance.

---

## Intelligence Layer

**Contains:** Project Intelligence, Intent Engine, Recommendation Engine, Workflow Engine, Engineering GPS, Project Health Engine

**Purpose:** Transforms information into engineering understanding and guidance.

This layer performs the cognitive work of the workspace. It understands project state, interprets intent, produces recommendations, structures workflows, navigates progress, and assesses health. It turns data into decisions.

---

## Knowledge Layer

**Contains:** Context Intelligence, Engineering Memory, Knowledge Engine

**Purpose:** Preserves, selects, and evolves engineering knowledge.

This layer ensures the workspace becomes smarter over time. It selects relevant context, preserves engineering reasoning, and transforms experience into reusable knowledge. It connects past decisions to future guidance.

---

## Foundation Layer

**Contains:** Observation Engine

**Purpose:** Provides objective facts that every higher layer depends upon.

This layer watches without interpreting. It detects changes, records facts, and produces signals. Every other layer builds on the factual foundation this layer provides.

**Information flow:** Information generally flows upward through the layers, from observations to intelligence to guidance. Guidance flows downward, from recommendations to developer decisions to project evolution. This creates a continuous improvement cycle where every interaction makes the workspace more capable.

---

# Major Subsystems

## 1. Workspace Core

**Purpose:** Acts as the central coordinator for all workspace activity.

**Responsibilities:**
- Project lifecycle coordination
- Subsystem communication
- Workspace state management
- Session coordination
- Overall orchestration

**Inputs:** Developer actions, subsystem status updates, project state changes.

**Outputs:** Coordination signals, state transitions, subsystem routing instructions.

**Collaborates With:** All subsystems. The Workspace Core routes information and coordinates timing but does not perform engineering reasoning itself.

**Design Philosophy:** The Workspace Core is the conductor, not the musician. It ensures subsystems work together harmoniously without becoming the source of engineering intelligence.

---

## 2. Project Intelligence

**Purpose:** Understands the project as a living engineering system.

**Responsibilities:**
- Project state assessment
- Engineering state tracking
- Focus determination
- Goal management
- Milestone tracking
- Project maturity evaluation

**Inputs:** Project artifacts, decisions, conversations, observations, engineering memory.

**Outputs:** Current project understanding, focus recommendations, maturity assessments.

**Collaborates With:** Engineering GPS, Project Health, Context Intelligence, Engineering Memory.

**Design Philosophy:** Project Intelligence maintains the workspace's understanding of what the project is, where it stands, and what matters most right now. It transforms raw project data into actionable understanding.

---

## 3. Context Intelligence

**Purpose:** Selects, maintains, and refreshes the relevant context for every engineering decision.

**Responsibilities:**
- Selecting relevant context for current tasks
- Preventing context overload
- Preventing context rot
- Refreshing stale information
- Prioritizing context by relevance
- Routing context to other subsystems

**Inputs:** Intent, project state, conversations, engineering memory, recent observations.

**Outputs:** Curated context packages for recommendations, decisions, and guidance.

**Collaborates With:** All subsystems that require context for reasoning.

**Design Philosophy:** Intelligent context selection is central to good engineering guidance. More context is not always better. The right context at the right time prevents both information starvation and cognitive overload.

---

## 4. Observation Engine

**Purpose:** Notices changes in the project and developer behavior before any interpretation occurs.

**Responsibilities:**
- Detecting developer actions
- Tracking project evolution
- Monitoring conversations
- Watching engineering artifacts
- Generating raw observations
- Producing signals from observations

**Inputs:** Developer activity, file changes, conversation content, project modifications, time-based events.

**Outputs:** Observations (raw facts), Signals (interpreted meaning).

**Collaborates With:** Intent Engine, Context Intelligence, Engineering Memory.

**Design Philosophy:** The workspace observes before it interprets. Observations remain factual and free of assumptions. Signals represent the workspace's interpretation of what observations might mean.

---

## 5. Intent Engine

**Purpose:** Transforms signals into a continuously refined understanding of what the developer is trying to accomplish.

**Responsibilities:**
- Maintaining intent hypothesis
- Tracking confidence levels
- Continuously updating understanding
- Resolving ambiguous intent
- Detecting intent shifts

**Inputs:** Signals, conversations, project state, recent decisions, modified files, engineering history.

**Outputs:** Current intent hypothesis, current focus, confidence level.

**Collaborates With:** Project Intelligence, Context Intelligence, Recommendation Engine.

**Design Philosophy:** Intent is continuously refined rather than guessed once. The workspace maintains a dynamic hypothesis that evolves with new evidence. When uncertainty exists, the workspace verifies through natural conversation rather than assuming.

---

## 6. Engineering Memory

**Purpose:** Preserves engineering knowledge across the lifetime of a project.

**Responsibilities:**
- Decision memory
- Rationale preservation
- Knowledge retrieval
- Summarization
- Prioritization
- Historical evolution tracking

**Inputs:** Decisions, conversations, artifacts, recommendations, outcomes, project evolution.

**Outputs:** Historical context, decision rationale, lessons learned, precedent references.

**Collaborates With:** All subsystems. Engineering Memory informs every engineering activity with accumulated knowledge.

**Design Philosophy:** Engineering Memory is fundamentally different from chat history. It preserves why decisions were made, not just what was decided. It is useful only if it supports retrieval, prioritization, and summarization. Storage alone is not sufficient.

---

## 7. Knowledge Engine

**Purpose:** Transforms accumulated engineering memory into reusable knowledge that improves future decisions.

**Responsibilities:**
- Extracting lessons from experience
- Validating knowledge against research
- Connecting similar situations
- Improving future recommendations
- Identifying patterns across projects

**Inputs:** Engineering Memory, research, proven solutions, accepted recommendations.

**Outputs:** Validated knowledge, pattern matches, improvement suggestions.

**Collaborates With:** Recommendation Engine, Workflow Engine, Engineering Memory.

**Design Philosophy:** Knowledge differs from memory. Memory preserves what happened. Knowledge extracts what can be learned from what happened. The Knowledge Engine turns experience into wisdom.

---

## 8. Recommendation Engine

**Purpose:** Produces engineering recommendations that guide developers toward better decisions.

**Responsibilities:**
- Trade-off analysis
- Alternative generation
- Confidence estimation
- Recommendation lifecycle management
- Reasoning generation

**Inputs:** Intent, context, knowledge, engineering memory, project health, constraints.

**Outputs:** Recommendations with reasoning, alternatives, trade-offs, and confidence levels.

**Collaborates With:** Context Intelligence, Knowledge Engine, Engineering GPS, Project Health.

**Design Philosophy:** Recommendations remain recommendations rather than commands. They include reasoning and alternatives, allowing developers to understand trade-offs. Every recommendation moves through a lifecycle that contributes to engineering memory.

---

## 9. Workflow Engine

**Purpose:** Provides structured engineering processes that reduce decision fatigue and ensure best practices.

**Responsibilities:**
- Playbook management
- Engineering workflow execution
- Workflow progression tracking
- Engineering checklist generation
- Workflow adaptation to project state

**Inputs:** Project state, engineering state, goals, constraints, proven workflows.

**Outputs:** Structured workflows, checklists, step-by-step guidance, progress tracking.

**Collaborates With:** Recommendation Engine, Project Intelligence, Knowledge Engine.

**Design Philosophy:** Workflows reduce decision fatigue by encoding best practices into repeatable processes. They are repeatable while conversations are not. A workflow may be partially completed and resumed later.

---

## 10. Project Health Engine

**Purpose:** Continuously assesses project quality across essential engineering dimensions.

**Responsibilities:**
- Monitoring planning quality
- Assessing architecture consistency
- Tracking documentation health
- Evaluating security posture
- Measuring testing coverage
- Assessing deployment readiness
- Tracking maintainability
- Identifying technical debt

**Inputs:** Project artifacts, decisions, observations, engineering memory, project state.

**Outputs:** Health insights, dimension-specific assessments, priority recommendations.

**Collaborates With:** Engineering GPS, Recommendation Engine, Project Intelligence.

**Design Philosophy:** Project Health produces insights rather than simple scores. Low health in a dimension triggers specific guidance rather than generic warnings. Health drives action rather than merely displaying metrics.

---

## 11. Engineering GPS

**Purpose:** Provides continuous navigation that helps developers understand where they are and what to focus on next.

**Responsibilities:**
- Determining current project position
- Identifying destination based on goals
- Recommending next steps
- Explaining why steps matter
- Tracking progress toward objectives

**Inputs:** Project Health, Engineering Memory, Goals, Workspace State, Engineering State.

**Outputs:** Current position assessment, recommended next step, reasoning for recommendations.

**Collaborates With:** Project Intelligence, Recommendation Engine, Project Health.

**Design Philosophy:** Engineering GPS is guidance, not task management. It helps developers decide rather than tells them what to do. It continuously updates as project state changes.

---

## 12. AI Orchestrator

**Purpose:** Coordinates all AI interactions while maintaining consistency, context, and appropriate behavior.

**Responsibilities:**
- Selecting collaboration mode
- Coordinating specialized reasoning
- Prompt construction
- Maintaining conversational consistency
- Balancing proactive and reactive behavior
- Managing model interactions

**Inputs:** Intent, context, project state, developer preferences, trust level.

**Outputs:** Coordinated AI responses, conversation management, mode selection.

**Collaborates With:** All subsystems that require AI interaction.

**Design Philosophy:** The AI Orchestrator coordinates intelligence rather than owning engineering knowledge. It ensures the right capability engages at the right time with the right context. It remains model-agnostic and adaptable.

---

# Cross-Cutting Capabilities

These capabilities influence every subsystem and are not owned by any single engine.

## Trust

Confidence earned through consistently accurate, transparent, and explainable guidance. Trust influences how proactively every subsystem intervenes and how personally it tailors recommendations.

## Explainability

The ability to explain reasoning behind every recommendation, decision, and assessment. Explainability ensures developers understand why guidance is given, not just what is suggested.

## Cognitive Load Reduction

The primary quality metric for every subsystem. Every capability should ask: does this make engineering thinking easier or harder?

## Proactivity

The ability to initiate guidance without being asked. Proactivity is earned through demonstrated understanding and calibrated by the interrupt budget.

## Adaptability

The ability to adjust communication style, recommendation depth, and guidance approach based on developer preferences, project maturity, and engineering phase.

## Privacy

The commitment to keep project data local and under developer control. Privacy influences how data flows between subsystems and how much information leaves the workspace.

## Local-First Philosophy

Project data, decisions, and memory reside locally by default. Cloud capabilities may enhance but never replace local functionality. This philosophy ensures data ownership and offline capability.

---

# Information Flow

Information flows through the workspace in a continuous cycle rather than a linear pipeline.

**Typical flow:**

Developer Activity → Observation Engine → Signals → Intent Engine → Context Intelligence → Engineering Memory → Knowledge Engine → Recommendation Engine → Engineering GPS → Developer → Decisions → Engineering Memory

This flow is continuous rather than linear. Subsystems collaborate through feedback loops:

- Recommendations influence decisions, which update engineering memory, which improves future recommendations.
- Observations trigger signals, which refine intent, which changes focus, which alters recommendations.
- Project health assessments update engineering GPS, which changes navigation, which affects project state.

Information flows intentionally. Not every observation reaches every subsystem. Context Intelligence ensures only relevant information routes to appropriate engines.

---

# Lifecycle of an Engineering Decision

Every engineering decision follows a conceptual lifecycle that connects observation to lasting knowledge.

**Observation:** The Observation Engine detects a raw fact in the project or developer activity. A file was created, a configuration changed, a test failed, or a conversation touched on architecture.

**Signal:** The Observation Engine interprets the observation into a signal. The developer modified Docker Compose becomes the developer may be preparing deployment. The signal connects an objective fact to a possible meaning.

**Intent Hypothesis:** The Intent Engine receives the signal and refines its understanding of what the developer is actually trying to accomplish. Confidence levels are maintained and adjusted as new evidence arrives.

**Context Selection:** Context Intelligence selects the minimum relevant information required to provide good guidance. It pulls from engineering memory, project artifacts, recent decisions, and current constraints. Irrelevant information is excluded.

**Knowledge Retrieval:** The Knowledge Engine retrieves validated knowledge relevant to the current situation. It connects current signals to past decisions, proven solutions, and documented lessons.

**Recommendation:** The Recommendation Engine produces context-aware guidance with reasoning, alternatives, and trade-offs. The recommendation is presented to the developer but remains a suggestion, not a command.

**Developer Decision:** The developer accepts, rejects, defers, or replaces the recommendation. This is the moment of engineering judgment that the workspace supports but does not make.

**Engineering Memory:** The outcome is recorded in Engineering Memory with full context. The decision, its rationale, and its consequences become part of the project's permanent knowledge.

**Knowledge Evolution:** The Knowledge Engine extracts lessons from the completed decision. Patterns emerge. Future recommendations improve because this decision exists.

**Future Recommendations:** The cycle repeats with accumulated wisdom. Every completed decision makes the workspace more capable of providing good guidance in similar situations.

This lifecycle emphasizes that every engineering decision strengthens future engineering guidance. The workspace becomes smarter not because it guesses better, but because it remembers more accurately.

---

# Architectural Boundaries

Clear boundaries prevent subsystem overreach and maintain conceptual clarity.

**Context Intelligence should not generate recommendations.** Its role is to select and route information, not to interpret it.

**Engineering Memory should not decide priorities.** It preserves knowledge; Project Intelligence and Engineering GPS determine what matters most.

**Observation Engine should not infer intent.** It produces raw facts and signals; the Intent Engine interprets meaning.

**Recommendation Engine should not own project state.** It produces guidance; Project Intelligence maintains understanding.

**Workspace Core should not perform engineering reasoning.** It coordinates; specialized engines think.

**Knowledge Engine should not replace Engineering Memory.** It extracts lessons from memory; it does not become the source of truth.

**Engineering GPS should not manage tasks.** It guides decisions; it does not become a project management tool.

**AI Orchestrator should not own engineering knowledge.** It coordinates AI interactions; specialized engines provide domain expertise.

Keeping boundaries clear improves maintainability, testability, and conceptual clarity. When subsystems respect their boundaries, the system remains understandable and adaptable.

---

# Conceptual Dependencies

Each subsystem depends on other subsystems for inputs it cannot produce alone. These are conceptual dependencies rather than implementation dependencies.

**Workspace Core** depends on:
- All subsystems for status and coordination
- Project Intelligence for project state
- Engineering Memory for session continuity

**Project Intelligence** depends on:
- Observation Engine for project change signals
- Engineering Memory for historical context
- Context Intelligence for relevant project information
- Project Health Engine for quality assessments

**Context Intelligence** depends on:
- Intent Engine for current focus
- Engineering Memory for historical context
- Observation Engine for recent signals
- Project Intelligence for project state

**Observation Engine** depends on:
- Engineering Memory for baseline comparisons
- Context Intelligence for determining what to observe

**Intent Engine** depends on:
- Observation Engine for signals
- Context Intelligence for relevant context
- Engineering Memory for historical patterns
- Project Intelligence for project state

**Engineering Memory** depends on:
- Observation Engine for raw facts
- Recommendation Engine for decision outcomes
- Context Intelligence for retrieval queries

**Knowledge Engine** depends on:
- Engineering Memory as its primary source
- Project Intelligence for project-specific patterns
- Recommendation Engine for accepted guidance outcomes

**Recommendation Engine** depends on:
- Context Intelligence for curated context
- Engineering Memory for precedent
- Knowledge Engine for validated patterns
- Project Intelligence for project understanding
- Project Health Engine for quality insights

**Workflow Engine** depends on:
- Knowledge Engine for proven workflow patterns
- Project Intelligence for current project state
- Recommendation Engine for step-level guidance

**Project Health Engine** depends on:
- Project Intelligence for project maturity
- Engineering Memory for historical trends
- Observation Engine for recent changes
- Context Intelligence for relevant artifacts

**Engineering GPS** depends on:
- Project Intelligence for current position
- Project Health Engine for quality assessment
- Engineering Memory for historical decisions
- Goals for destination definition

**AI Orchestrator** depends on:
- Intent Engine for current intent
- Context Intelligence for conversation context
- Workspace Core for session state
- Trust level for proactivity calibration

Understanding these dependencies ensures subsystems collaborate without creating circular reasoning or hidden coupling.

---

# Architectural Invariants

These are architectural rules that should never be violated. They preserve long-term architectural integrity.

**Engineering Memory is the authoritative source of engineering reasoning.** Every decision, rationale, and alternative flows through memory before becoming knowledge.

**Knowledge is derived from Engineering Memory.** Knowledge never replaces memory. It extracts lessons from what memory preserves.

**Observations remain factual and immutable.** An observation records what happened, not what it means. Interpretation belongs to signals.

**Recommendations never bypass Context Intelligence.** Every recommendation receives relevant context before being formulated. Context is never assumed.

**Workspace Core never performs engineering reasoning.** It coordinates. Specialized engines think.

**AI Orchestrator never owns project knowledge.** It manages AI interactions. Specialized engines provide domain expertise.

**Every recommendation should remain explainable.** If the workspace cannot explain why it made a suggestion, it should not make the suggestion.

**Every important decision should be recoverable.** Decisions belong to Engineering Memory. They can be retrieved, reviewed, and understood indefinitely.

**Context is selected rather than broadcast.** Relevant information reaches the right engine. Irrelevant information stays out.

**Engines communicate through defined responsibilities rather than shared assumptions.** Subsystems trust each other's outputs because they understand each other's responsibilities.

These invariants ensure the architecture remains coherent as it evolves. Violating them creates hidden coupling, unpredictable behavior, and conceptual confusion.

---

# Design Principles

**Single responsibility for every subsystem.** Each engine exists for one primary purpose.

**Collaboration over duplication.** Engines work together rather than replicating each other's capabilities.

**Knowledge compounds over time.** Every interaction should make the workspace smarter for future interactions.

**Minimize coupling.** Subsystems communicate through clear interfaces rather than depending on internal implementation.

**Maximize explainability.** Every output should include reasoning that can be understood by developers.

**Context before reasoning.** Relevant information must reach the right engine before interpretation occurs.

**Memory before repetition.** Stored knowledge should prevent repeated questions and discussions.

**Guidance before automation.** The workspace guides decisions; developers make choices.

---

# Future Expansion

New subsystems may be introduced in future versions as engineering needs evolve.

**Potential future engines:**

- Research Engine: Systematic investigation of tools, solutions, and best practices
- Simulation Engine: Modeling potential outcomes of architectural or technical decisions
- Cost Intelligence: Tracking and optimizing infrastructure, tool, and operational costs
- Team Collaboration Intelligence: Supporting multi-developer projects with shared context
- Learning Intelligence: Personalized engineering education based on project patterns and mistakes

Future engines should integrate through existing architectural responsibilities rather than bypassing them. They should consume existing inputs and produce outputs that fit the established information flow.

---

## Architectural Evolution

Architecture should evolve through refinement rather than replacement.

New engines should appear only when responsibilities genuinely require separation. Existing engines should avoid accumulating unrelated capabilities. Responsibilities evolve before engines are added. The architecture should become clearer over time, not merely larger.

Simplicity should be preserved even as capability grows. Every new engine must justify its existence by providing capabilities that existing engines cannot provide without violating their responsibilities.

Evolution respects the existing dependency structure. New engines integrate through established interfaces rather than creating shortcuts or bypassing layers.

---

# Failure Philosophy

The architecture should degrade gracefully when capabilities are limited or uncertain.

**If Context Intelligence has insufficient context:** The workspace asks for clarification rather than guessing. Uncertainty is preferable to incorrect confidence.

**If Knowledge Engine lacks confidence:** The workspace explains uncertainty transparently. It presents alternatives and admits what it does not know.

**If Engineering Memory cannot retrieve information:** The workspace reconstructs understanding through conversation. It asks the developer rather than fabricating history.

**If Observation Engine misses events:** Future observations naturally refine understanding. The workspace does not pretend to know what it did not observe.

**If Recommendation Engine cannot confidently recommend:** Present alternatives instead of pretending certainty. Multiple options with honest trade-offs are more valuable than one confident guess.

**If Trust is low:** The workspace becomes more cautious. It explains reasoning more thoroughly, asks more clarifying questions, and reduces proactivity until confidence grows.

**If Intent is ambiguous:** The workspace verifies through natural conversation. It states its hypothesis and asks whether it is correct.

Uncertainty is preferable to incorrect confidence. The workspace should always prefer admitting limitations over fabricating certainty. When the workspace fails, it should fail transparently and recover collaboratively.

---

# Closing Principle

The architecture exists to coordinate engineering intelligence rather than software components.

The strength of the workspace comes not from any individual subsystem but from how specialized capabilities collaborate to help developers make consistently better engineering decisions.

When the architecture succeeds, developers experience a workspace that feels intelligent, responsive, and deeply aware of their project—not because any single engine is powerful, but because the whole system works together to reduce cognitive load, preserve knowledge, and guide engineering judgment.

---

**Version:** 1.1

**Last Updated:** July 2026