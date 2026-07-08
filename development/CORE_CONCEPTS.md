# Core Concepts

**Version:** 1.2

**Status:** Living Document

---

# Purpose

This document establishes the shared language used throughout the AI Software Engineering Workspace product.

Every important term receives one precise definition to eliminate ambiguity in discussions, specifications, and implementations.

Future documentation should reference these definitions rather than redefine concepts. When terms are used, they carry the meaning established here.

---

# Design Principles

Each core concept is defined by its purpose rather than its implementation.

Concepts remain clear and stable over time. They are technology-independent and designed to remain valuable for many years.

Definitions focus on what something enables rather than how it works. This ensures consistency across architecture, data models, UI designs, and implementation approaches.

---

# Core Concepts

## Workspace

**Definition:** The persistent engineering environment where software development decisions are made and recorded.

**Purpose:** To provide a cohesive environment where developers can plan, decide, build, and maintain software projects with continuous guidance and preserved context.

**Relationships:** The workspace contains zero or more projects, each with its own engineering memory, decisions, and health. The workspace transcends individual AI sessions and conversations, providing continuity across weeks and months of development.

**Design Notes:** A workspace is not a project, nor is it a conversation. It is the container and coordinator for all engineering activity.

---

## Project

**Definition:** The primary unit of work representing a cohesive software development effort.

**Purpose:** To organize all engineering activity around a shared goal, allowing the workspace to understand context, history, and health across time.

**Relationships:** Each project belongs to exactly one workspace. A project contains conversations, decisions, documentation, architecture, roadmaps, health assessments, and engineering memory. Projects persist beyond individual sessions.

**Components:**
- Conversations: Interaction records between developer and workspace
- Decisions: Engineering choices with rationale and context
- Documentation: Knowledge artifacts that explain the project
- Architecture: Technical structure and design philosophy
- Roadmaps: Planned progression and priorities
- Health: Multidimensional assessment of project quality
- Workflows: Structured engineering processes
- Engineering Memory: Persistent knowledge of all choices
- Goals: Long-term objectives driving the project
- History: Evolution of the project over time

**Design Notes:** A project is not merely a folder of files. It is the engineering narrative of software development.

---

## Session

**Definition:** A continuous period of interaction between a developer and the workspace.

**Purpose:** To provide bounded interaction windows for focused engineering work while maintaining connection to persistent project context.

**Relationships:** Sessions belong to projects. Each session may contain multiple conversations. Sessions end when the workspace is closed or after extended inactivity. Projects continue beyond session boundaries.

**Design Notes:** A session is a practical boundary for resource management and context continuity, not a limitation of project understanding.

---

## Conversation

**Definition:** One interaction channel inside a project, representing a sequence of exchanges between developer and workspace.

**Purpose:** To capture a focused engineering discussion that contributes to project knowledge and decisions.

**Relationships:** Conversations belong to projects and occur within sessions. Conversations generate knowledge but are distinct from the knowledge itself. Multiple conversations may address the same topic across different sessions.

**Design Notes:** Conversations are input to engineering memory. They are not the final product of engineering work.

---

## Intent

**Definition:** What the developer is actually trying to accomplish in a given moment, regardless of the specific words they use.

**Purpose:** To understand the underlying goal behind a prompt or action, enabling relevant and timely guidance.

**Relationships:** Intent is derived from conversation, project state, and developer behavior. It guides the workspace's proactive responses and recommendation focus.

**Examples:**
- "I want to ship this to production" (when developer asks about adding a feature)
- "I'm trying to debug a login issue" (when developer is exploring error messages)
- "I'm validating whether this idea works" (when developer is testing MVP scope)
- "I need to understand this codebase" (when developer opens an existing project)

**Design Notes:** Intent differs from both prompts and goals. It is the workspace's interpretation of immediate developer needs.

---

## Goal

**Definition:** A persistent objective that drives project direction and decision-making over time.

**Purpose:** To establish long-term direction and provide context for engineering choices.

**Relationships:** Goals belong to projects and inform decisions, priorities, and roadmap planning. They are referenced continuously throughout a project's lifecycle.

**Design Notes:** Goals persist across sessions and phases. They may evolve but maintain continuity, unlike intent which changes frequently based on immediate needs.

---

## Context

**Definition:** The minimum relevant information required to make a good engineering decision for a specific situation.

**Purpose:** To ensure decisions are based on actual project state rather than incomplete or outdated information.

**Relationships:** Context connects to conversations, decisions, project state, and intent. It is selected and maintained by Context Intelligence.

**Design Notes:** More context is not always better. Context quality matters more than context quantity. Irrelevant context can obscure important details and create confusion.

---

## Context Window

**Definition:** The boundary of available and useful information for making a specific decision.

**Purpose:** To acknowledge that unlimited information access does not guarantee effective decision-making.

**Relationships:** Context windows are managed by Context Intelligence. They relate to intent, decisions, and recommendations.

**Design Notes:** Available information differs from useful information. Intelligent context selection prevents overload while preserving essential knowledge.

---

## Context Intelligence

**Definition:** The capability responsible for selecting, maintaining, and refreshing relevant context for engineering decisions.

**Purpose:** To ensure decisions are informed by appropriate information without overwhelming the workspace or developer.

**Relationships:** Context Intelligence operates across all projects and conversations. It prevents context overload by limiting information to what is immediately relevant. It prevents context rot by refreshing stale decisions and assumptions.

**Design Notes:** This is a workspace capability, not an AI personality. It works silently to improve the quality of all recommendations.

---

## Engineering Memory

**Definition:** Persistent knowledge of all engineering decisions, trade-offs, and rationale within a project.

**Purpose:** To preserve the reasoning behind choices so future decisions can build on past understanding.

**Relationships:** Engineering Memory is created from decisions, conversations, and artifacts. It informs recommendations, detects inconsistencies, and answers historical questions.

**Distinctions:**
- **Chat history:** Conversational transcripts that may contain irrelevant or outdated information
- **Documentation:** Intentionally curated knowledge, often incomplete during active development
- **Project files:** Code and configuration that represent outcomes, not reasoning

**Design Notes:** Engineering Memory focuses on why decisions were made, not just what was decided. It enables the workspace to explain choices months later. Engineering Memory is useful only if it supports retrieval, prioritization, and summarization. Storage alone is not sufficient.

---

## Observation

**Definition:** A raw fact detected by the workspace before any interpretation occurs.

**Purpose:** To provide an objective foundation for understanding project changes and developer behavior without imposing assumptions.

**Examples:**
- A new file was created
- README was modified
- Authentication was added
- CI failed
- Developer opened Docker configuration
- Project has not been opened for 12 days

**Relationships:** Observations produce Signals. They belong to projects and occur within sessions.

**Design Notes:** Observations should remain factual and should never contain assumptions or interpretations.

---

## Signal

**Definition:** An interpreted observation that may indicate developer intent or project change.

**Purpose:** To connect raw facts to meaningful engineering contexts without requiring the developer to explicitly state intentions.

**Examples:**
- Observation: Developer modified Docker Compose.
- Signal: The developer may be preparing deployment.
- Observation: Authentication files appeared.
- Signal: Security guidance may soon become relevant.
- Observation: Project inactive for several weeks.
- Signal: The developer may need a project summary before resuming work.

**Relationships:** Signals derive from Observations. They trigger Intent Hypothesis refinement and Recommendations.

**Signal Flow:** Observations → Signals → Intent Hypothesis → Recommendations

**Design Notes:** Signals represent interpretation, not certainty. They guide attention rather than dictate action.

---

## Focus

**Definition:** The single engineering concern that deserves the developer's attention right now.

**Purpose:** To prevent cognitive overload by directing attention to what matters most in the current moment, rather than presenting all available information.

**Relationships:** Focus is derived from current Engineering State, Project Health, Intent Hypothesis, and Trust level. It influences which Recommendations are presented and when.

**Distinctions:**
- **Goal:** Long-term direction that persists across the project
- **Intent:** What the developer is trying to accomplish in a given moment
- **Context:** Supporting information required for good decisions
- **Focus:** What deserves attention at this specific moment

**Examples:**
- During implementation: Focus on architectural consistency rather than planning gaps
- During testing: Focus on edge cases rather than new features
- During deployment: Focus on security review rather than refactoring
- When returning to a project: Focus on unfinished decisions rather than completed work

**Design Notes:** Focus is singular by definition. Multiple competing priorities create confusion rather than clarity.

---

## Knowledge

**Definition:** Validated engineering information that can improve future decisions and prevent repeated mistakes.

**Purpose:** To accumulate useful insights across projects and decisions, making each subsequent engineering effort more effective.

**Relationships:** Knowledge is derived from Engineering Memory, research, and proven solutions. It feeds recommendations, workflows, and guidance.

**Design Notes:** Knowledge differs from raw information. It must be validated through research or experience to be valuable.

---

## Decision

**Definition:** An engineering choice that affects project quality, maintainability, or future direction.

**Purpose:** To document the reasoning behind significant choices so they can inform future work and be understood in retrospect.

**Components:**
- **Choice:** The selected option or approach
- **Reasoning:** Why this choice was made given current context
- **Alternatives:** Other viable options considered
- **Assumptions:** Conditions believed to be true at decision time
- **Constraints:** Limitations that influenced the decision
- **Confidence:** How certain the decision-maker felt
- **Expected Impact:** Anticipated consequences of the choice

**Relationships:** Decisions belong to projects and contribute to Engineering Memory. They drive recommendations and guide future intent.

**Design Notes:** Decisions are first-class citizens because they represent the value of the workspace: helping developers reason about choices rather than guessing.

---

## Decision History

**Definition:** The evolution of decisions within a project over time, including superseded choices and their rationale.

**Purpose:** To understand why decisions changed and prevent confusion about project direction.

**Relationships:** Decision History is part of Engineering Memory. It connects to risk assessment and Architecture drift detection.

**Design Notes:** Superseded decisions remain valuable. They explain why current choices were made and prevent repeated discussions.

---

## Recommendation

**Definition:** Context-aware engineering guidance that suggests a course of action based on project state and validated knowledge.

**Purpose:** To help developers make informed choices without replacing their judgment.

**Components:**
- Suggested action
- Reasoning behind the suggestion
- Alternative options
- Trade-offs involved
- Confidence level

**Outcomes:** Recommendations move through a lifecycle:

**Created:** The recommendation is formulated based on current context and intent.

**Presented:** The recommendation is shared with the developer with reasoning and alternatives.

**Accepted:** The developer acts on the recommendation. It becomes a Decision and contributes to Engineering Memory.

**Rejected:** The developer declines the recommendation. The outcome is recorded to inform future guidance.

**Deferred:** The recommendation is relevant but not acted on now. The workspace monitors for conditions that would make it appropriate later.

**Replaced:** A newer recommendation supersedes the current one. Both are preserved to document the evolution of thinking.

**Expired:** The recommendation is no longer relevant due to project changes or resolved issues. It remains in Engineering Memory for retrospective learning.

**Relationships:** Recommendations draw from Knowledge and Engineering Memory. They create Decisions when accepted and inform future recommendations through their outcomes.

**Design Notes:** Recommendations are guidance, not instructions. Developers retain control over all choices.

---

## Constraint

**Definition:** A condition that limits possible decisions, representing hard boundaries rather than preferences.

**Purpose:** To ensure recommendations and decisions respect real-world limitations.

**Examples:**
- Budget: Available financial resources for tools and services
- Timeline: Deadlines and scheduling requirements
- Regulations: Compliance requirements that must be followed
- Technology: Existing choices or requirements that limit options
- Team Size: Available contributors to complete work
- Experience: Developer comfort level with specific technologies

**Relationships:** Constraints influence recommendations, decisions, and goal selection. They are referenced continuously during guidance.

**Design Notes:** Constraints differ from preferences. They represent absolute limits rather than preferred directions.

---

## Assumption

**Definition:** A condition believed to be true at the time of a decision or recommendation, but not verified.

**Purpose:** To make assumptions explicit so they can be validated or revisited when they prove incorrect.

**Relationships:** Assumptions connect to decisions, recommendations, and risk assessment. They inform future validation efforts.

**Design Notes:** Assumptions should be visible and periodically revisited. Hidden assumptions become risks.

---

## Risk

**Definition:** A potential problem that could negatively affect project quality, timeline, or maintainability.

**Purpose:** To identify and address potential issues before they become real problems.

**Types:**
- **Known Risks:** Identified threats with understood likelihood and impact
- **Unknown Risks:** Unanticipated problems that may emerge during development

**Relationships:** Risks arise from decisions, assumptions, and constraints. They drive proactive guidance.

**Design Notes:** Risks deserve attention even when they are not immediately apparent. The workspace should surface them appropriately.

---

## Opportunity

**Definition:** A situation where the project could become better, simpler, faster, cheaper, or safer without solving an existing problem.

**Purpose:** To improve projects through proactive enhancement rather than reactive problem-solving.

**Examples:**
- Better third-party solution available
- Architecture simplification possible
- Cost optimization achievable
- Performance improvement available
- Security enhancement worth considering

**Relationships:** Opportunities connect to Recommendations and Trust. They represent positive potential rather than negative threats.

**Design Notes:** Opportunities deserve attention even though they are not problems. They can prevent future issues while improving current state.

---

## Artifact

**Definition:** Any durable project asset that represents engineering work or knowledge.

**Purpose:** To organize and preserve important project outputs beyond code.

**Examples:**
- Roadmap: Planned progression and priorities
- Architecture: Technical structure and design philosophy
- Documentation: Explanations and knowledge records
- Decision Record: Documented choices with rationale
- Specification: Requirements and constraints
- Diagram: Visual representations of structure or flow
- Workflow: Structured engineering process

**Relationships:** Artifacts belong to projects. They contribute to Engineering Memory and Project Health.

**Design Notes:** Artifacts are not files. They are purposeful creations that advance engineering understanding.

---

## Workflow

**Definition:** A structured engineering process that guides developers through recurring tasks with best practices.

**Purpose:** To provide consistent, repeatable approaches to common engineering challenges.

**Relationships:** Workflows belong to projects and connect to Recommendations and Goals. They evolve through use and improve over time.

**Design Notes:** Workflows are repeatable while conversations are not. A workflow may be partially completed and resumed later.

---

## Engineering State

**Definition:** The current engineering activity or phase within a project.

**Purpose:** To provide appropriate guidance based on what kind of work is happening now.

**States:**
- Planning: Defining scope, goals, and roadmap
- Implementation: Writing code and building features
- Architecture: Making technical structure decisions
- Design: Creating user interface and experience
- Testing: Validating quality and reliability
- Deployment: Preparing for production release
- Maintenance: Monitoring health and making improvements

**Relationships:** Engineering State informs Intent Hypothesis and Recommendation focus. It changes frequently based on developer actions.

**Design Notes:** Engineering State is distinct from Workspace State. One describes what work is happening; the other describes how the workspace behaves.

---

## Workspace State

**Definition:** The overall operating behavior of the workspace, including proactivity level, interaction style, and guidance approach.

**Purpose:** To adapt workspace behavior based on project maturity and developer preferences.

**Relationships:** Workspace State is influenced by Trust Progression and Engineering Memory. It determines how actively the workspace intervenes.

**Design Notes:** Workspace State reflects the workspace's confidence and relationship with the developer, not the project's technical status.

---

## Identity vs State

Many workspace entities possess both identity and state, and distinguishing between them improves conceptual clarity.

**Identity** is stable and rarely changes. It represents what something fundamentally is.

**State** is dynamic and changes continuously. It represents what is true about something at a given moment.

**Examples:**

**Project**
- Identity: The same project throughout its existence
- State: Current phase, active contributors, health score, recent decisions

**Workflow**
- Identity: The same structured process definition
- State: Current step, completion progress, active participants

**Recommendation**
- Identity: The same suggestion throughout its lifecycle
- State: Created, presented, accepted, rejected, deferred, replaced, expired

**Decision**
- Identity: The same choice recorded in Engineering Memory
- State: Current, superseded, questioned, validated

Separating identity from state prevents confusion about what persists and what changes. A project's identity remains constant while its state evolves through implementation, testing, and maintenance. A recommendation's identity remains constant while its state moves from created to accepted or rejected.

This distinction improves clarity in discussions about persistence, history, and evolution.

---

## Project Lifecycle

**Definition:** The long-term progression of a project from inception through completion and ongoing maintenance.

**Purpose:** To understand where a project stands and what activities are most valuable.

**Phases:**
- Idea: Initial concept exploration
- Discovery: Research and validation
- Planning: Scope and roadmap definition
- Architecture: Technical direction
- Implementation: Code development
- Testing: Quality verification
- Deployment: Production release
- Maintenance: Ongoing health and growth

**Relationships:** Project Lifecycle connects all major concepts. Progress through phases may be non-linear.

**Design Notes:** Projects can move backwards between phases when necessary. Discovering missing planning during implementation is common.

---

## Evolution

Engineering knowledge changes over time. Projects evolve. Architecture evolves. Recommendations evolve. Risks evolve. Intent evolves.

Engineering Memory should preserve this evolution rather than only the latest state.

**Preserved Evolution:**
- Why decisions were made at the time
- What alternatives were considered and rejected
- How architecture changed and why
- Which recommendations were accepted, rejected, or replaced
- How risks emerged and were addressed
- How project understanding deepened

**Historical understanding is a first-class capability.** The workspace should be able to explain why the project is in its current state by referencing its evolution, not just its current snapshot.

Evolution differs from static history. It preserves the reasoning behind changes, allowing future engineers to understand not just what changed, but why.

---

## Engineering GPS

**Definition:** The capability that continuously determines: current position in the lifecycle, destination based on goals, recommended next step, and reasoning for that step.

**Purpose:** To provide continuous navigation that helps developers understand where they are and what to focus on next.

**Relationships:** Engineering GPS draws from Project Health, Engineering Memory, Goals, and Workspace State. It produces Recommendations.

**Design Notes:** Engineering GPS is guidance, not task management. It helps developers decide, not tells them what to do.

---

## Project Health

**Definition:** A multidimensional assessment of project quality across essential engineering dimensions.

**Purpose:** To measure project maturity and identify areas requiring attention.

**Dimensions:**
- Planning: Clear scope and realistic roadmap
- Architecture: Consistent structure and appropriate choices
- Documentation: Updated and accessible knowledge
- Security: Proper protection and vulnerability awareness
- Testing: Adequate coverage and validation
- Deployment: Operational readiness and monitoring
- Maintainability: Technical debt and code organization
- Technical Debt: Shortcuts and deferred improvements

**Relationships:** Project Health drives Engineering GPS and Recommendations. It is influenced by Decisions and Artifacts.

**Design Notes:** Project Health is assessment, not a score. Low health in a dimension triggers specific guidance.

---

## Persona

**Definition:** A behavioral communication mode that changes how the workspace interacts without changing engineering truth.

**Purpose:** To provide appropriate communication style for different situations and developer preferences.

**Examples:**
- Mentor: Focus on learning and guidance
- Senior Engineer: Direct technical recommendations
- CTO: Strategic architectural perspective
- Pair Programmer: Immediate implementation feedback
- Product Manager: User value and prioritization
- Startup Advisor: Speed and resource constraints
- Strict Reviewer: Risk identification and validation

**Relationships:** Personas modify Recommendation delivery and Conversation behavior. They do not change underlying Knowledge.

**Design Notes:** Personas are communication styles, not roles. All engineering truth remains consistent regardless of persona.

---

## Trust (Developer Confidence)

**Definition:** Confidence earned through consistently accurate, transparent, and explainable guidance.

**Purpose:** To ensure developers can rely on workspace recommendations without second-guessing.

**Components:**
- Accuracy: Recommendations align with reality
- Transparency: Reasoning is clearly explained
- Explainability: Decisions can be understood in retrospect
- Acknowledgment: Limitations and uncertainty are admitted

**Relationships:** Trust grows through positive interactions and informs Workspace State. Higher trust enables more proactive guidance.

**Design Notes:** Trust compounds over time. Early missteps have lasting impact on developer willingness to accept guidance. See also: Trust Level, which is the architectural mechanism that operationalizes developer trust as a proactivity-control parameter.

---

## Trust Level

**Definition:** The degree to which the workspace is permitted to initiate unsolicited guidance toward the developer. A parameter, not a feeling.

**Purpose:** To give developers explicit, adjustable control over AI proactivity without disabling any intelligence capability. A developer who prefers silence should receive the same quality of guidance on request as one who welcomes frequent suggestions.

**Components:**
- **Trust Level setting:** A developer-controlled parameter (e.g., Low / Medium / High) stored in Workspace Core
- **Interrupt Budget:** The maximum number of unsolicited guidance events permitted within a session before the workspace reduces proactivity. Derived from Trust Level.
- **Proactivity threshold:** The minimum signal confidence required for the AI Orchestrator to surface unsolicited guidance

**Relationships:** Trust Level is owned and enforced by the AI Orchestrator. The setting is stored by Workspace Core as part of developer preferences. Trust Level does not affect reasoning quality or recommendation accuracy — only delivery timing and frequency.

**Ownership:** AI Orchestrator (enforces); Workspace Core (stores setting).

**Design Notes:** Trust Level is distinct from Trust (Developer Confidence). One is a product outcome (the developer trusts the system). The other is an architectural control mechanism (the system respects developer attention preferences). Both concepts are necessary and must not be collapsed into one.

---

## Reasoning

**Definition:** The cognitive process by which an intelligence engine evaluates available information and produces a justified conclusion, recommendation, or health assessment.

**Purpose:** To ensure every output from an intelligence engine carries an explicit, auditable rationale — making the system's logic transparent, correctable, and trustworthy.

**Components of a complete reasoning output:**
- **Conclusion:** The specific finding, recommendation, or assessment reached
- **Evidence:** The information used to reach the conclusion (context, patterns, prior decisions)
- **Reasoning chain:** The logical steps connecting evidence to conclusion
- **Alternatives considered:** Other conclusions that were evaluated and why they were not selected
- **Confidence level:** How certain the engine is about the conclusion
- **Assumptions:** Conditions the reasoning depends on that were not directly verified

**Relationships:** Reasoning is performed within each specialized intelligence engine using context packages assembled by Context Intelligence. The Reasoning Engine (as a conceptual framework) defines the reasoning pattern that all specialized engines follow. The AI Orchestrator coordinates reasoning across engines but does not perform domain-specific reasoning itself.

**Ownership:** Each intelligence engine performs reasoning within its own domain. No central reasoning owner exists. The AI Orchestrator coordinates but does not reason.

**Design Notes:** Reasoning is a process, not a subsystem. An engine that produces output without an explicit reasoning chain violates INV-07 (recommendations never bypass reasoning). Reasoning quality — not just conclusion correctness — is a first-class quality metric for this system.

---

## Cognitive Load

**Definition:** The mental effort required to hold and process information during software development.

**Purpose:** To minimize unnecessary mental burden so developers can focus on important decisions.

**Sources:**
- Remembering past decisions and rationale
- Tracking multiple constraints and requirements
- Understanding complex architecture and relationships
- Managing project state and priorities
- Researching tools and best practices

**Relationships:** Cognitive Load connects to all concepts. The workspace exists primarily to reduce unnecessary load.

**Design Notes:** Reducing cognitive load is one of the workspace's primary goals. Every feature should ask: does this make thinking easier or harder?

---

# Relationships Between Concepts

The workspace concepts form an interconnected system where relationships define behavior as much as individual definitions do.

**Projects contain Conversations.** Each conversation contributes to Engineering Memory through documented Decisions.

**Conversations produce Observations.** Developer actions and project changes generate raw facts that the workspace detects.

**Observations produce Signals.** The workspace interprets observations to infer meaning and intent.

**Signals inform Intent Hypothesis.** Interpreted observations refine the workspace's understanding of what the developer is trying to accomplish.

**Decisions become part of Engineering Memory.** Every recorded choice preserves reasoning, alternatives, and context for future reference.

**Engineering Memory enables better Recommendations.** Historical knowledge informs current guidance by providing precedent and preventing repeated mistakes.

**Recommendations improve Project Health.** Guidance addresses risks, opportunities, and gaps, raising the quality of the project over time.

**Project Health informs Engineering GPS.** Current project status determines where the project is and where attention should focus.

**Engineering GPS generates Recommendations.** Continuous navigation produces suggested next steps based on current state and goals.

**Workspace State evolves through Trust Progression.** Growing confidence enables more proactive and personalized guidance.

**Context Intelligence manages Context.** It selects, maintains, and refreshes relevant information across all activities, preventing overload and rot.

**Knowledge feeds Workflows.** Validated engineering information structures repeatable processes that accelerate Engineering State progression.

**Workflows create structured Recommendations.** Repeatable processes deliver consistent guidance for common engineering challenges.

**Goals influence Decisions.** Long-term objectives shape which choices are appropriate and which trade-offs are acceptable.

**Focus influences Recommendations.** Current attention determines which guidance is presented and when.

**Constraints influence Recommendations and Decisions.** Hard boundaries ensure guidance respects real-world limitations.

**Assumptions connect to Risks.** Unverified conditions become potential threats if they prove incorrect.

**Opportunities trigger Recommendations.** Positive potential deserves proactive attention even without existing problems.

**Risks trigger Proactive Guidance.** Identified threats surface as recommendations before they become problems.

**Engineering State informs Intent Hypothesis.** Current work phase provides context for understanding developer needs.

**Trust influences Workspace State.** Confidence level determines how proactively the workspace intervenes.

**Personas modify Recommendation delivery.** Communication style adapts without changing underlying engineering truth.

**All concepts ultimately serve the goal of reducing Cognitive Load.** Every relationship exists to make engineering thinking easier and more effective.

---

# Concept Graph

The workspace concepts form a connected graph rather than a strict hierarchy. The following relationships describe how major concepts interact.

```
Workspace
   ↓ owns
Projects
   ↓ contains
Conversations
   ↓ produce
Observations
   ↓ produce
Signals
   ↓ inform
Intent
   ↓ influences
Focus
   ↓ produces
Recommendations
   ↓ create
Decisions
   ↓ contribute to
Engineering Memory
   ↓ enables
Knowledge
   ↓ informs
Engineering GPS
   ↓ depends on
Project Health
```

**Cross-cutting relationships:**

- Context Intelligence influences Recommendations
- Trust influences Workspace State
- Goals influence Decisions
- Focus influences Recommendations
- Constraints influence Recommendations and Decisions
- Engineering State informs Intent Hypothesis
- Project Lifecycle connects all phases
- Opportunities trigger Recommendations
- Risks trigger Proactive Guidance
- Workflows accelerate Engineering State progression
- Assumptions connect to Risks and Decisions
- Personas modify Recommendation delivery
- Sessions contain Conversations
- Artifacts contribute to Engineering Memory

This graph shows information flow and conceptual relationships rather than strict ownership.

---

# Evolution Principles

Concepts should evolve carefully. Adding new concepts is acceptable when they represent genuinely new ideas.

Changing the meaning of existing concepts should happen rarely. Many parts of the system depend on precise definitions.

Removing concepts is extremely rare. Concepts may be deprecated but should remain defined for historical clarity.

When concepts change, all dependent systems must be updated to maintain consistency.

---

# Closing Principle

Clear concepts lead to consistent architecture, consistent implementation, and consistent user experience.

The strength of the workspace depends on shared understanding before code is written. Every engineer, designer, and stakeholder should be able to read this document and reach the same conclusions about system behavior.

When concepts are precise, ambiguity disappears from implementation discussions and the focus shifts to solving real problems.

---

**Version:** 1.2

**Last Updated:** July 2026