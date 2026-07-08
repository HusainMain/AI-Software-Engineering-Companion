# Context Intelligence

**Version:** 1.0

**Status:** Living Document

---

# Purpose

This document defines the conceptual intelligence responsible for understanding, selecting, maintaining, evolving, and delivering context throughout the AI Software Engineering Workspace.

Context Intelligence is the lens through which every other intelligence engine views the project. It determines what information reaches reasoning, what reaches recommendations, what reaches workflows, and what reaches memory.

This is not an implementation document. It does not discuss programming languages, vector databases, embeddings, token windows, prompts, APIs, LLM context limits, databases, retrieval systems, or technical implementation.

Instead, it defines why context matters, how context differs from memory and knowledge, how context is selected and maintained, and how context quality determines the quality of every engineering insight the workspace produces.

Every recommendation, every reasoning step, every workflow stage, and every guidance moment depends on context. Context Intelligence ensures that dependency is well-served.

---

# Context Intelligence Philosophy

Context exists to reduce cognitive load.

The workspace knows far more about a project than any single reasoning moment needs. Without context selection, every engine would be overwhelmed by irrelevant information. Every recommendation would be buried in noise. Every reasoning step would be slowed by unnecessary data.

Only relevant information should participate in reasoning. Context Intelligence ensures that what reaches the reasoning process is precisely what improves it—nothing more, nothing less.

Context should be dynamic. It changes with the project, with the task, with the developer's intent, and with emerging information. Static context becomes stale context. Stale context produces stale reasoning.

Context should never become stale. It should continuously adapt to reflect current project reality. When decisions change, context updates. When goals shift, context refreshes. When new information emerges, context expands. When outdated assumptions linger, context expires them.

Context should make reasoning easier. It should reduce the mental effort required to make good decisions. It should surface the right information at the right time. It should hide information that is not relevant without losing it entirely.

Context Intelligence is not about knowing everything. It is about knowing what matters right now. It is the discipline of relevance in a universe of information.

---

# What Context Intelligence Actually Does

Context Intelligence performs several fundamental activities:

**Observe relevance:** It watches what information becomes important as the project evolves, as conversations unfold, and as decisions are made. Relevance is not static. It emerges from interaction.

**Select information:** It chooses which pieces of project knowledge should participate in current reasoning. Selection is the core activity. Everything else supports selection.

**Filter information:** It removes information that is not relevant to the current situation. Filtering prevents overload without losing knowledge. Filtered information is not deleted. It is simply not included in current context.

**Prioritize:** When more relevant information exists than can be used, it ranks information by importance, urgency, and connection to current intent. Prioritization ensures that the most critical information reaches reasoning first.

**Connect related knowledge:** It identifies relationships between pieces of information. A decision about architecture connects to constraints, previous decisions, project goals, and health implications. Context Intelligence surfaces these connections.

**Refresh:** It updates context as new information arrives or old information becomes outdated. Refresh prevents reasoning based on obsolete understanding.

**Expire obsolete context:** It removes context that is no longer valid. Expired assumptions, superseded decisions, and outdated plans are retired to prevent contamination of current reasoning.

**Maintain continuity:** It ensures that context persists across sessions, conversations, and workflow stages. The developer should not need to re-establish context every time they return to the project.

**Detect missing context:** It identifies when relevant information is absent. Missing context is signaled so that it can be gathered before reasoning proceeds.

**Prepare context for reasoning:** It assembles, formats, and delivers context to reasoning engines in a form that is useful and usable. Preparation ensures that context is not just selected but effectively communicated.

---

# What Is Context

Context is the minimum relevant information required to make a good engineering decision for a specific situation.

Context is not everything the workspace knows. It is not the entire project history. It is not all engineering memory. It is the specific subset of knowledge that is relevant right now.

Context is always relative. It depends on:
- What the developer is trying to accomplish
- What phase the project is in
- What decisions have already been made
- What constraints are active
- What risks are emerging
- What opportunities are appearing

The same project produces different contexts for different situations. Planning a new feature requires different context than debugging a production issue. Reviewing architecture requires different context than deploying to production. Evaluating security requires different context than optimizing performance.

Context is not a property of the project. It is a property of the relationship between the project and the current reasoning task. The project contains vast knowledge. Context is the slice of that knowledge that matters for this moment.

Context is perishable. It becomes stale when the project changes. It becomes irrelevant when the task changes. It becomes incomplete when new information emerges. Context Intelligence manages this perishability by continuously refreshing and adapting.

---

# Context Is Not Memory

Memory preserves. Context selects.

Memory grows continuously. Every decision, every conversation, every outcome adds to engineering memory. Memory is comprehensive. It seeks to preserve everything that might be valuable.

Context changes constantly. It is assembled for specific reasoning moments and discarded when no longer needed. Context is selective. It surfaces only what is relevant right now.

Memory is the workspace's long-term storage of engineering experience. Context is the workspace's short-term working set for engineering reasoning.

Both are required. Memory without context is an archive that no one accesses. Context without memory is a snapshot with no depth. Context Intelligence bridges them by selecting from memory the information that current reasoning requires.

Memory answers: what do we know about this project?

Context answers: what do we need to know right now to make this decision?

The distinction matters because confusing them leads to either information overload or information starvation. Context Intelligence ensures that memory serves context without overwhelming it.

---

# Context Is Not Knowledge

Knowledge is timeless. Context is situational.

Knowledge represents validated engineering understanding that applies across situations. It is the lesson learned from experience, the pattern recognized across projects, the principle extracted from practice. Knowledge persists because it remains useful across many contexts.

Context determines whether knowledge is relevant. Knowledge about microservice architecture may be highly relevant when designing a distributed system and completely irrelevant when debugging a simple script. The knowledge has not changed. Its relevance to the current situation has.

Knowledge may exist without being relevant. The workspace may know many things that do not apply to the current task. Context Intelligence filters these out.

Context determines relevance. It answers: of all the knowledge we possess, what applies right now?

Context Intelligence does not create knowledge. It selects knowledge. It determines which pieces of knowledge deserve participation in current reasoning.

---

# Context Hierarchy

Context exists in layers, from immediate to long-term.

**Immediate Context** is the developer's current message, question, or action. It is the trigger for reasoning. It is always relevant but often insufficient alone.

**Current Task Context** is information about the specific engineering task at hand. It includes recent decisions, current stage in a workflow, active risks, and immediate goals. It answers: what is the developer working on right now?

**Conversation Context** is the accumulated understanding from the current conversation. It includes what has been discussed, what decisions have been made, what questions have been asked, and what reasoning has occurred. It answers: what has led to this moment?

**Workflow Context** is the current state of any active workflows. It includes current stage, completion criteria, progress made, and branching decisions. It answers: what process are we following and where are we in it?

**Project Context** is the current understanding of the project as a whole. It includes goals, architecture, constraints, health, and current state. It answers: what is this project and where does it stand?

**Engineering Memory Context** is historical understanding retrieved from engineering memory. It includes past decisions, previous approaches, lessons learned, and precedent. It answers: what has happened before and what did we learn?

**Knowledge Context** is validated engineering knowledge relevant to the current situation. It includes patterns, best practices, proven solutions, and engineering principles. It answers: what do we know that applies here?

**Historical Context** is the project's evolution over time. It includes how the project changed, why decisions were made, how architecture evolved, and what mistakes were made. It answers: how did we get here?

**Long-term Context** is the project's ultimate direction and purpose. It includes long-term goals, strategic vision, and enduring constraints. It answers: where are we ultimately heading?

These layers exist simultaneously. Context Intelligence assembles the appropriate mix for each reasoning moment. Immediate context always participates. Long-term context participates when strategic decisions are being made. Intermediate layers participate based on relevance.

The hierarchy prevents context overload. The workspace does not load all nine layers for every question. It loads the layers that matter for the specific situation.

---

# Context Scope

Context varies in scope depending on the reasoning task.

**Small context** includes only the most immediately relevant information. It is used for simple questions, quick clarifications, and straightforward decisions. Small context reduces cognitive load by limiting information to what is essential.

**Focused context** includes immediate context, current task context, and relevant project context. It is used for standard engineering guidance, workflow stages, and routine recommendations. Focused context balances completeness with relevance.

**Broad context** includes project context, engineering memory, historical context, and relevant knowledge. It is used for complex decisions, architectural reviews, and strategic planning. Broad context ensures that reasoning considers the full project picture.

**Cross-project context** includes knowledge and patterns from multiple projects. It is used when the current project can benefit from lessons learned elsewhere. Cross-project context is the rarest and most carefully applied because it risks imposing external patterns on unique situations.

Context Intelligence selects scope based on:
- The complexity of the reasoning task
- The stability of the project's current state
- The availability of relevant information
- The developer's experience level
- The consequences of incorrect reasoning

Scope is not a setting. It is a dynamic determination made for each reasoning moment. The same project may use small context for a simple question and broad context for a major architectural decision.

---

# Context Freshness

Fresh context reflects current project reality. Stale context reflects past reality that may no longer hold.

**Fresh context** is:
- Based on current project state
- Reflecting recent decisions
- Incorporating latest changes
- Free of superseded assumptions
- Aligned with active goals
- Validated against current reality

**Stale context** is:
- Based on outdated project state
- Referencing superseded decisions
- Missing recent changes
- Containing expired assumptions
- Aligned with retired goals
- Unvalidated against current reality

Stale context creates poor recommendations because it reasons about a project that no longer exists. Recommendations based on stale context may contradict current decisions, ignore recent changes, or assume constraints that have been lifted.

Context Intelligence maintains freshness by:
- Monitoring project changes continuously
- Updating context when significant changes occur
- Flagging assumptions that may have become invalid
- Refreshing context before major reasoning moments
- Detecting contradictions between context and current reality

Freshness is not about recency alone. A decision from six months ago may still be fresh if it remains valid. A decision from yesterday may be stale if it has been superseded. Freshness is about validity, not age.

---

# Context Relevance

Relevance is the measure of how much a piece of information improves reasoning for the current situation.

Relevance is dynamic. What is highly relevant in one moment may be irrelevant in the next. A technology choice that is central to an architecture review may be irrelevant during a security assessment.

Relevance depends on:
- Current task and intent
- Project phase and maturity
- Recent decisions and their implications
- Active risks and opportunities
- Developer's current focus

Relevance is not a binary property. Information is not simply relevant or irrelevant. It exists on a spectrum from essential to peripheral.

Context Intelligence continuously re-evaluates relevance as the situation evolves. It does not assemble context once and use it indefinitely. It reassesses with each new piece of information, each new decision, each new conversation turn.

Relevance determines what participates in reasoning. The most relevant information reaches the reasoning engine first. Less relevant information may be available but not prominent. Irrelevant information is excluded entirely.

---

# Context Prioritization

When more relevant information exists than can be effectively used, Context Intelligence prioritizes.

Prioritization determines the order and prominence of information within context.

**Most important:** Information that is essential for the current decision. Without it, reasoning would be incomplete or incorrect.

**Most useful:** Information that significantly improves reasoning quality even if it is not strictly essential.

**Most recent:** Information that reflects the latest project state and recent decisions.

**Most connected:** Information that connects to many other pieces of relevant information, providing a hub of understanding.

**Most trustworthy:** Information that has been validated through experience, research, or consensus.

**Most actionable:** Information that directly informs what should be done next.

Prioritization is not arbitrary. It is based on the specific reasoning task, the project state, and the consequences of incorrect reasoning. A security assessment prioritizes security-related context. A performance review prioritizes performance-related context. A deployment preparation prioritizes operational context.

Context Intelligence ensures that the most critical information is prominent and accessible while less critical information remains available but not distracting.

---

# Context Evolution

Context evolves as the project progresses through its lifecycle.

**Idea phase:** Context focuses on problem definition, user needs, constraints, and feasibility. Technical context is minimal. Strategic context dominates.

**Planning phase:** Context expands to include scope, roadmap, architecture direction, technology options, and resource constraints. Context becomes more structured and detailed.

**Architecture phase:** Context emphasizes technical structure, design patterns, technology choices, scalability considerations, and integration requirements. Context becomes more technical and specific.

**Implementation phase:** Context focuses on current implementation state, recent changes, active tasks, and immediate technical concerns. Context is highly detailed and rapidly changing.

**Testing phase:** Context emphasizes quality criteria, test coverage, edge cases, validation requirements, and defect history. Context focuses on verification and validation.

**Deployment phase:** Context emphasizes operational readiness, environment configuration, monitoring, security, and rollback capabilities. Context focuses on production transition.

**Maintenance phase:** Context balances operational stability with evolutionary improvement. Context includes technical debt, user feedback, performance metrics, and long-term sustainability.

Each phase requires different context. Context Intelligence adapts the context mix to match the project's current needs.

Evolution is not just about adding information. It is about shifting emphasis. Implementation context de-emphasizes planning context. Deployment context de-emphasizes implementation detail. Context Intelligence manages these shifts transparently.

---

# Context Compression

Large engineering histories must become concise to be useful.

A project with months of conversation, hundreds of decisions, and thousands of changes cannot present all of that information to every reasoning moment. The cognitive load would be overwhelming.

Context Intelligence compresses through:

**Summarization:** It distills lengthy histories into concise summaries that preserve meaning while reducing detail. Summaries capture the narrative without recording every word.

**Abstraction:** It extracts principles and patterns from specific instances. Instead of presenting every past decision, it presents the pattern those decisions established.

**Prioritization:** It ranks information by relevance and importance. Essential information remains prominent. Peripheral information retreats.

**Pruning:** It removes information that is no longer relevant. Completed work, superseded decisions, and resolved issues are archived from active context while remaining available in memory.

Compression is not loss. The underlying information remains preserved in engineering memory. Compression ensures that only the appropriate slice participates in current reasoning.

Context Intelligence compresses without distorting. Summaries preserve meaning. Abstractions preserve principles. Prioritization preserves importance. Pruning preserves the option to retrieve later.

---

# Context Expansion

When summaries become insufficient, context expands to deeper knowledge.

Expansion occurs when:
- Current reasoning reveals gaps in understanding
- Deeper investigation is required
- Historical details become relevant
- Precedent must be examined closely
- Assumptions require validation

Context Intelligence expands context selectively. It does not load all historical detail by default. It expands only when the reasoning task requires deeper information.

Expansion is guided by:
- What the current reasoning reveals as missing
- What the developer explicitly requests
- What signals indicate that surface understanding is insufficient
- What contradictions require historical investigation

Expansion respects cognitive load. It does not dump expanded context on the developer. It presents deeper information in a structured, prioritized way that enables effective reasoning.

Context Intelligence manages the balance between compression and expansion. It keeps context concise by default but enables depth when depth is needed.

---

# Context Drift

Context drift occurs when outdated assumptions remain active in current reasoning.

Drift happens when:
- Decisions are made but context is not updated
- Project changes but context reflects old state
- Assumptions become invalid but remain unchallenged
- Goals shift but context still assumes old goals
- Architecture evolves but context describes previous architecture

Drift is dangerous because it produces reasoning based on a project that no longer exists. Recommendations based on drifted context may contradict current decisions, ignore recent changes, or assume conditions that have been resolved.

Context Intelligence detects drift by:
- Comparing context against current project signals
- Identifying contradictions between context and observed reality
- Noticing when assumptions in context are no longer validated
- Recognizing when context has not been refreshed despite significant changes

When drift is detected, Context Intelligence refreshes the affected portions of context. It updates assumptions, incorporates new decisions, and aligns context with current reality.

Drift prevention is continuous. Context Intelligence does not wait for drift to be reported. It monitors for drift continuously and corrects it proactively.

---

# Missing Context

Sometimes the information needed for good reasoning is not available.

Missing context occurs when:
- Decisions were made but not recorded
- Information exists but has not been integrated
- Assumptions are unvalidated
- Historical details are unavailable
- Project understanding has gaps

Context Intelligence detects missing context by:
- Recognizing when reasoning cannot proceed without additional information
- Identifying gaps between what is known and what is needed
- Noticing when assumptions are made without supporting evidence
- Comparing current context against the requirements of the reasoning task

When missing context is detected, the workspace has two options:

**Ask the developer:** When the missing information is known only to the developer, Context Intelligence signals the gap and requests clarification.

**Continue with acknowledged uncertainty:** When the missing information is not available but reasoning can proceed, Context Intelligence proceeds with explicit acknowledgment of the gap and its implications.

Context Intelligence never fabricates missing information. It never guesses to fill gaps. It acknowledges missing context and either requests it or reasons transparently without it.

---

# Context Confidence

Context has a confidence level that reflects how certain the workspace is that the context accurately represents project reality.

**High confidence:** Context is current, complete, validated, and aligned with project signals. Reasoning can proceed with strong assurance.

**Medium confidence:** Context is mostly current but may have minor gaps or unvalidated assumptions. Reasoning proceeds with appropriate caution.

**Low confidence:** Context has significant gaps, outdated information, or unvalidated assumptions. Reasoning produces tentative conclusions with explicit caveats.

**Unknown:** Context is insufficient for confident reasoning. The workspace acknowledges the gap and either requests more information or presents multiple possibilities.

Confidence influences how reasoning is conducted and how recommendations are presented. High-confidence context enables firm recommendations. Low-confidence context produces nuanced guidance with alternatives.

Context Intelligence maintains confidence assessments alongside context. It communicates confidence to reasoning engines so that they can calibrate their outputs appropriately.

Confidence is not about the quality of the reasoning engine. It is about the quality of the input. Good reasoning with poor context produces poor output. Context Intelligence ensures that confidence reflects input quality.

---

# Context Quality

Context has quality dimensions that determine its usefulness.

**Complete:** All relevant information is present. No critical gaps exist. The reasoning task has access to everything it needs.

**Incomplete:** Some relevant information is missing. The reasoning task proceeds with acknowledged gaps. Completeness is the goal; incompleteness is acknowledged transparently.

**Conflicting:** Context contains contradictory information from different sources or time periods. Conflicts are identified and resolved or explicitly flagged.

**Outdated:** Context contains information that no longer reflects project reality. Outdated context is identified and refreshed or retired.

**Ambiguous:** Context contains information that is unclear or open to multiple interpretations. Ambiguity is acknowledged and clarification is requested.

Context Intelligence monitors quality continuously. It does not assume that context is good simply because it was assembled. It validates context against project signals, detects quality issues, and takes corrective action.

Quality determines whether context serves reasoning or sabotages it. High-quality context enables excellent reasoning. Poor-quality context produces misleading conclusions even when reasoning is sound.

Context Intelligence is the guardian of context quality. It ensures that every engine receives context that is as complete, current, and clear as the project state allows.

---

# Context Relationships

Context connects to every major concept in the workspace.

**Context and Goals:** Context includes current goals and their priorities. Goals determine what information is relevant.

**Context and Constraints:** Context includes active constraints and their source. Constraints limit the scope of relevant information.

**Context and Architecture:** Context includes architectural understanding and its rationale. Architecture provides the structural framework for relevance.

**Context and Memory:** Context is selected from memory. Memory is the source; context is the selection.

**Context and Knowledge:** Context determines which knowledge applies. Knowledge is the pool; context is the current draw.

**Context and Recommendations:** Recommendations are produced from context. Context quality determines recommendation quality.

**Context and Workflows:** Workflows consume context at each stage. Context determines workflow progression and adaptation.

**Context and Health:** Project health assessments inform context selection. Unhealthy dimensions receive more context attention.

**Context and Focus:** Focus determines what context is most relevant. Context is assembled around current focus.

**Context and Intent:** Intent determines the reasoning task. Context is selected to serve that task.

These relationships mean that context is not isolated. It is the connective tissue that binds all workspace intelligence together. Context Intelligence manages these connections to ensure coherence.

---

# Context During Conversations

Conversations are the primary way the workspace learns about the project. Context Intelligence manages how conversation shapes context.

**Gradual building:** Context is built gradually through conversation. Each exchange adds information, refines understanding, and shifts relevance. Context Intelligence integrates each new piece into the evolving context.

**Continuous reshaping:** As conversations progress, context is continuously reshaped. What was relevant at the beginning may be less relevant as understanding deepens. New topics may emerge that require context expansion.

**No restarts:** Conversations should never require restarting context from scratch. Context Intelligence preserves understanding across conversation turns, sessions, and topics. The developer never needs to repeat information that has already been provided.

**Context threads:** Different conversation threads may have different contexts. A debugging conversation has different context than a planning conversation. Context Intelligence maintains separate context threads while preserving shared project understanding.

**Context inheritance:** New conversations inherit context from previous conversations. They do not start empty. They start with accumulated understanding and refine from there.

Conversations are not the only source of context, but they are the most dynamic. Context Intelligence ensures that conversation-driven context changes are integrated smoothly into the overall project understanding.

---

# Context During Long Projects

Projects that span weeks, months, or years present unique context challenges.

**Weeks:** Context must survive week-long gaps. Returning to a project after a weekend should feel seamless. Context Intelligence summarizes progress and preserves understanding during inactivity.

**Months:** Context must survive project evolution. Decisions made months ago may still be relevant or may have been superseded. Context Intelligence tracks evolution and updates context accordingly.

**Years:** Context must survive personnel changes, technology shifts, and architectural evolution. The project's original context may be largely irrelevant. Context Intelligence preserves historical understanding while maintaining current relevance.

Long projects accumulate vast amounts of context. Context Intelligence manages this accumulation by:
- Archiving context that is no longer active
- Summarizing context that is too detailed
- Preserving context that remains relevant
- Refreshing context that has become stale
- Connecting current context to historical understanding

The goal is continuity without overload. The developer should be able to return to a project after any period of inactivity and immediately understand where it stands. Context Intelligence makes this possible.

---

# Context Recovery

Context may need to be recovered after various disruptions.

**After inactivity:** When the developer returns after days or weeks away, Context Intelligence reconstructs current context from project signals, recent activity, and engineering memory. It presents a summary that brings the developer up to date without requiring manual review.

**After interruptions:** When a workflow or conversation is interrupted by an urgent issue, Context Intelligence preserves the interrupted context. When the developer returns to the interrupted work, context is restored.

**After misunderstandings:** When the workspace misunderstands the developer's intent, Context Intelligence reconstructs context through conversation. It asks clarifying questions and integrates the corrected understanding.

**After project pivots:** When the project changes direction significantly, Context Intelligence rebuilds context around the new direction. It archives old context that is no longer relevant while preserving understanding of why the pivot occurred.

Recovery is not about recreating context from scratch. It is about identifying what is still valid, what has changed, and what needs to be refreshed. Context Intelligence manages this reconstruction transparently.

Recovery preserves the developer's momentum. The developer should not need to rebuild understanding after every disruption. Context Intelligence ensures continuity.

---

# Context Boundaries

Context Intelligence has clear boundaries. It should never:

**Reason.** Context Intelligence selects information. The Reasoning Engine interprets it. Selection is not reasoning.

**Recommend.** Context Intelligence prepares context. The Recommendation Engine produces recommendations. Preparation is not recommendation.

**Decide.** Context Intelligence assembles information. The developer makes decisions. Assembly is not decision-making.

**Own knowledge.** Context Intelligence selects from knowledge. The Knowledge Engine owns and validates knowledge. Selection is not ownership.

**Replace memory.** Context Intelligence draws from memory. Engineering Memory preserves knowledge. Selection is not preservation.

**Operate without awareness of intent.** Context Intelligence always knows what the developer is trying to accomplish. Context without intent is just data.

**Ignore project state.** Context Intelligence always considers current project state. Context without project awareness is generic.

**Become a search engine.** Context Intelligence does not retrieve everything that matches a query. It selects what is relevant for the current reasoning task.

**Maximize information quantity.** Context Intelligence optimizes for relevance, not completeness. More context is not always better.

**Assume without verifying.** Context Intelligence validates context against project signals. Assumed context is dangerous context.

**Forget the developer's perspective.** Context Intelligence serves the developer's reasoning, not abstract optimization. Context should help the developer think, not replace their thinking.

**Operate in isolation.** Context Intelligence collaborates with every engine. It does not hoard context or fragment understanding.

**Ignore cognitive load.** Context Intelligence exists to reduce cognitive load. Any context selection that increases load is a failure.

**Prioritize speed over quality.** Context Intelligence takes the time needed to assemble good context. Rushed context produces poor reasoning.

**Replace developer judgment.** Context Intelligence informs reasoning. It does not make reasoning unnecessary.

Context Intelligence exists to serve. Its boundaries ensure that it serves well without overstepping.

---

# Collaboration With Other Engines

Context Intelligence collaborates with every engine in the workspace. It is both a consumer and a producer in the intelligence network.

**Workspace Core:** Context Intelligence informs Workspace Core about context state, gaps, and refresh needs. Workspace Core coordinates context lifecycle based on this information.

**Observation Engine:** Context Intelligence receives raw observations from the Observation Engine. It interprets observations as context signals—changes that may affect current understanding.

**Intent Engine:** Context Intelligence receives intent hypotheses from the Intent Engine. Intent determines what context is relevant. Context is assembled around current intent.

**Project Intelligence:** Context Intelligence is a primary consumer of Project Intelligence. Project understanding provides the foundation for context selection. Context Intelligence requests project-specific understanding as needed.

**Engineering Memory:** Context Intelligence retrieves historical understanding from Engineering Memory. Memory provides the raw material from which context is selected.

**Knowledge Engine:** Context Intelligence retrieves validated knowledge from the Knowledge Engine. Knowledge provides the principles and patterns that inform context.

**Reasoning Engine:** Context Intelligence delivers prepared context to the Reasoning Engine. Reasoning consumes context to produce understanding and judgment.

**Recommendation Engine:** Context Intelligence delivers prepared context to the Recommendation Engine. Recommendations are produced with full relevant context.

**Workflow Engine:** Context Intelligence provides context for each workflow stage. Workflow stages consume context to make decisions and produce outputs.

**Engineering GPS:** Context Intelligence provides current context to Engineering GPS. GPS uses context to determine current position and next steps.

**Project Health:** Context Intelligence provides project context to Project Health. Health assessments inform context selection by identifying areas requiring attention.

**AI Orchestrator:** Context Intelligence provides conversation context to the AI Orchestrator. Orchestration uses context to manage conversation flow and communication style.

Collaboration is bidirectional. Context Intelligence both receives from and provides to every engine. It is the connective tissue of the intelligence network.

---

# Context Lifecycle

Context passes through a lifecycle from creation to retirement.

**Observation:** Context needs are observed. The Reasoning Engine signals what information is required. The Intent Engine signals what is relevant. Project signals indicate what has changed.

**Selection:** Context Intelligence selects relevant information from engineering memory, project state, and knowledge. Selection is guided by intent, project phase, and reasoning requirements.

**Prioritization:** Selected information is prioritized by importance, relevance, and urgency. The most critical information is made prominent. Less critical information remains accessible but not intrusive.

**Preparation:** Context is assembled, formatted, and structured for consumption by reasoning engines. Preparation ensures that context is usable, not just available.

**Delivery:** Context is delivered to the reasoning engine that requested it. Delivery is timely and appropriate to the reasoning moment.

**Refresh:** Context is continuously updated as new information arrives. Refresh ensures that context remains current without requiring explicit requests.

**Evolution:** Context evolves as the project evolves, as intent shifts, and as reasoning reveals new information needs. Evolution is continuous and adaptive.

**Retirement:** Context is retired when it is no longer relevant. Retired context is preserved in memory but removed from active use. Retirement prevents stale context from contaminating reasoning.

The lifecycle is continuous. As one context is delivered, another is being assembled. As one context is refreshed, another is being retired. Context Intelligence manages this continuous flow without disrupting reasoning.

---

# Context Principles

These principles govern Context Intelligence behavior.

**Context reduces cognitive load.** Its primary purpose is to make reasoning easier, not to provide more information.

**Relevance over completeness.** The right information is better than all information. Context is curated, not exhaustive.

**Context is situational.** It depends on the task, the project state, and the developer's intent. There is no universal context.

**Context is perishable.** It becomes stale as the project evolves. Freshness must be maintained continuously.

**Context is selected, not broadcast.** Information reaches reasoning because it is relevant, not because it exists.

**Context serves reasoning.** It exists to improve reasoning quality. If context does not improve reasoning, it is not good context.

**Context quality determines output quality.** Every engine's output is only as good as its context. Context Intelligence is the foundation of workspace intelligence.

**Missing context is acknowledged, not fabricated.** Gaps are signaled and addressed. Assumptions are labeled as assumptions.

**Context compression preserves meaning.** Summaries and abstractions reduce detail without losing understanding.

**Context expansion is selective.** Deeper information is retrieved only when needed. Expansion is guided by reasoning needs.

**Context survives sessions.** Understanding persists across time and inactivity. Returning to a project feels like continuing, not starting.

**Context adapts to maturity.** Early projects need exploratory context. Mature projects need refinement context.

**Context connects the project.** It binds goals, architecture, decisions, and history into coherent understanding.

**Context respects cognitive limits.** It does not overload reasoning with information that exceeds human or machine processing capacity.

**Context is transparent.** The developer can understand what context is active and why. Context selection is explainable.

---

# Non Goals

Context Intelligence does not:

**Reason.** The Reasoning Engine reasons. Context Intelligence provides the information for reasoning.

**Recommend.** The Recommendation Engine recommends. Context Intelligence prepares the context for recommendations.

**Decide.** The developer decides. Context Intelligence informs decisions with relevant information.

**Own knowledge.** The Knowledge Engine owns validated knowledge. Context Intelligence selects from it.

**Replace memory.** Engineering Memory preserves knowledge. Context Intelligence selects from memory.

**Operate as a search engine.** Context Intelligence does not retrieve everything that matches. It selects what is relevant.

**Maximize information quantity.** Context Intelligence optimizes for relevance, not completeness.

**Guarantee completeness.** Context is always a selection. Some information is always excluded. Completeness is not the goal; relevance is.

**Eliminate the need for developer input.** Context Intelligence signals gaps. The developer fills them.

**Operate without intent.** Context without intent is just data. Intent gives context purpose.

**Ignore project state.** Context without project awareness is generic. Project awareness makes context specific.

**Replace developer judgment.** Context informs judgment. It does not make judgment unnecessary.

**Guarantee perfect recommendations.** Good context improves recommendations. It does not ensure perfect outcomes.

**Work without memory.** Context Intelligence depends on Engineering Memory as its source. Without memory, there is no context to select.

**Work without knowledge.** Context Intelligence depends on the Knowledge Engine for validated patterns. Without knowledge, context lacks depth.

**Become a bottleneck.** Context Intelligence operates continuously in the background. It does not block reasoning while assembling context.

Context Intelligence exists to serve. Everything outside serving is outside its responsibility.

---

# Closing Philosophy

Context Intelligence is the lens through which every other intelligence engine understands the project.

Without Context Intelligence, every engine becomes either overwhelmed by information or deprived of essential knowledge. Reasoning would be buried in irrelevant data or starved of critical understanding. Recommendations would be generic or uninformed. Workflows would be rigid or directionless. Memory would be inaccessible or overwhelming.

Context Intelligence ensures that the right information reaches the right reasoning at the right time.

Its purpose is not to know everything. Its purpose is to ensure that knowing everything does not become an obstacle to knowing what matters.

When Context Intelligence succeeds, the developer experiences a workspace that seems to understand exactly what is relevant. Recommendations feel informed. Reasoning feels grounded. Guidance feels project-specific. The developer does not experience information overload. The developer experiences clarity.

That clarity comes from Context Intelligence working invisibly. The developer does not see what information was selected or what was filtered out. The developer simply experiences focused, relevant, timely guidance.

Context Intelligence is the discipline of relevance in a universe of information. It is the art of knowing what matters, when it matters, and why.

When the workspace reasons well, when it recommends effectively, when it guides with precision, it is because Context Intelligence ensured that the right understanding reached the right process at the right time.

Context is not the product. Context is the foundation. And foundations are invisible when they work well.

That is the purpose of Context Intelligence. To be the invisible foundation upon which every visible act of engineering intelligence is built.

---

**Version:** 1.0

**Last Updated:** July 2026