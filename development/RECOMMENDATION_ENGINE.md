# Recommendation Engine

**Version:** 1.0

**Status:** Living Document

---

# Purpose

This document defines the conceptual Recommendation Engine of the AI Software Engineering Workspace.

The Recommendation Engine is responsible for transforming understanding into actionable engineering guidance. It is the primary visible intelligence of the workspace—the capability through which developers experience the workspace's value.

This is not an implementation document. It does not discuss LLMs, prompt engineering, APIs, embeddings, machine learning, ranking algorithms, databases, programming languages, vector search, neural networks, technical architecture, or implementation.

Instead, it defines what a recommendation means in the context of software engineering, how recommendations are formed, how they differ from answers and commands, how they adapt to context, and how they serve the developer's engineering judgment.

Recommendations exist to improve engineering judgment rather than replace it. They exist to reduce cognitive load by providing relevant, timely, evidence-based guidance without removing the developer's agency. Good recommendations make developers more capable, not more dependent.

---

# Recommendation Domains

The Recommendation Engine synthesizes engineering guidance across a defined set of domains. Each domain represents a distinct engineering concern. Each domain is served by a corresponding knowledge category in the Knowledge Engine.

The Recommendation Engine does not own the knowledge patterns for any domain. It requests patterns from the Knowledge Engine at reasoning time and synthesizes them with current project context to produce domain-specific recommendations.

## Active Domains — MVI v0.1

| Domain | v0.1 Status | Output Description | Knowledge Engine Category |
|:---|:---:|:---|:---|
| Architecture | Active | Technology selection, structural patterns, dependency organization, scalability guidance | Architecture patterns |
| Security | Active | Authentication guidance, secret management, vulnerability remediation, input validation | Security patterns |
| Cost Optimization | Active | Free-tier recommendations, build vs. buy analysis, hosting cost comparison, resource efficiency | Cost patterns |
| Tool Selection | Active | Library evaluation, third-party service comparison, framework guidance, ecosystem trade-offs | Tool patterns |
| Deployment | Active | Hosting recommendations, environment validation guidance, production readiness, CI/CD structure | Deployment patterns |
| Documentation | Active (limited) | Documentation completeness observations, ADR format recommendations. Does NOT generate documentation content in v0.1 | Documentation patterns |

## Planned Domains — Post v0.1

| Domain | Status | Output Description | Knowledge Engine Category |
|:---|:---:|:---|:---|
| Design Intelligence | Post-v0.1 | UI/UX critique, accessibility review, animation guidance, icon and visual identity recommendations | Design patterns (planned) |

Design Intelligence is a validated product capability (Research Log, Master Problem Database P-045 through P-054) explicitly deferred to post-MVI. When activated, it will be delivered as a domain within this engine following the same domain pattern. No new subsystem is required.

## Domain Output Structure (Invariant)

Every active domain must produce output conforming to the following structure. Partial outputs are not permitted (INV-07):

- **Recommendation:** The specific guidance for this domain
- **Reasoning:** The explicit chain of logic connecting project context to the recommendation
- **Alternatives considered:** Other viable options evaluated and why they were not selected
- **Trade-offs:** What is gained and what is sacrificed with the recommended approach
- **Confidence level:** High / Medium / Low / Unknown, with explanation
- **Domain:** Which domain produced this output
- **Knowledge source:** Which Knowledge Engine category supplied the patterns

An output that omits any of these fields is architecturally incomplete and must not be delivered to the AI Orchestrator.

## Domain Boundary

The Recommendation Engine does not perform health assessment (owned by Project Health Engine) and does not own knowledge patterns (owned by Knowledge Engine). A domain without a corresponding Knowledge Engine category is incomplete and must not be activated. Activating a domain without a knowledge source produces guidance grounded in generic heuristics rather than validated patterns — this violates INV-05.

---

# Recommendation Philosophy

Recommend. Never command.

The Recommendation Engine provides guidance, not orders. Every recommendation is a suggestion that the developer may accept, reject, modify, or defer. The developer retains full authority over all engineering decisions.

Guide. Never control.

The workspace guides the engineering process. It does not control it. Guidance illuminates paths. Control restricts them. The Recommendation Engine illuminates.

Explain. Never dictate.

Every recommendation includes reasoning. The developer understands why the suggestion is made, what alternatives exist, and what trade-offs are involved. Dictation eliminates understanding. Explanation builds it.

Collaborate. Never replace.

The Recommendation Engine collaborates with the developer's judgment. It does not replace that judgment. Collaboration respects the developer's expertise, context, and authority. Replacement would diminish both the developer's capability and the recommendation's value.

The philosophy of the Recommendation Engine is service. It serves the developer's engineering judgment by providing informed, relevant, timely guidance that makes better decisions easier to make.

---

# What The Recommendation Engine Does

The Recommendation Engine performs several fundamental activities:

**Generate recommendations:** It produces engineering guidance based on current understanding, project context, validated knowledge, and reasoning. Recommendations are generated only when they can add value.

**Prioritize recommendations:** It determines which recommendations are most important and when they should be presented. Not all recommendations are equally urgent. Prioritization ensures that critical guidance reaches the developer first.

**Compare alternatives:** It evaluates multiple possible approaches and presents them with their trade-offs. Alternatives ensure that the developer understands the decision landscape, not just a single path.

**Explain reasoning:** Every recommendation includes the reasoning behind it. The developer understands why the suggestion is made, not just what is suggested.

**Present trade-offs:** Every recommendation includes the trade-offs involved. No engineering choice is without sacrifice. Trade-off analysis makes those sacrifices explicit.

**Estimate confidence:** It communicates how certain the workspace is about the recommendation. Confidence helps the developer calibrate reliance on the guidance.

**Adapt recommendations:** It adjusts recommendations based on developer experience, project maturity, constraints, current focus, trust level, and workspace state. Adaptation ensures that recommendations are appropriate for the specific situation.

**Track outcomes:** It monitors which recommendations are accepted, rejected, deferred, or replaced. Outcome tracking provides the feedback loop for improvement.

**Learn from outcomes:** It analyzes recommendation outcomes to improve future recommendations. Accepted recommendations validate knowledge. Rejected recommendations reveal preferences and constraints.

**Support workflows:** It provides recommendations at each stage of workflow execution. Workflow recommendations guide progression, validation, and decision-making within structured processes.

**Support Engineering GPS:** It produces navigation recommendations that guide the project toward its goals. Engineering GPS recommendations are about direction, not just specific technical choices.

The Recommendation Engine is the workspace's primary voice. Everything it does is in service of helping the developer make better engineering decisions.

---

# What Is A Recommendation

A recommendation is context-aware engineering guidance that suggests a course of action based on project state, validated knowledge, and current intent.

A recommendation is not:
- An **answer**: Answers assume questions have single correct responses. Engineering rarely has single correct answers. Recommendations acknowledge multiple valid paths.
- An **instruction**: Instructions command action without explanation. Recommendations explain and invite choice.
- A **command**: Commands eliminate agency. Recommendations preserve it.
- An **opinion**: Opinions are personal preferences without evidence. Recommendations are grounded in project context and validated knowledge.
- A **task**: Tasks are work items to be completed. Recommendations are guidance about how to approach work.
- A **roadmap**: Roadmaps define what to build and when. Recommendations suggest how to build it well.
- A **workflow**: Workflows structure processes. Recommendations guide decisions within those processes.

A recommendation is:
- **Suggestive**: It proposes rather than prescribes
- **Contextual**: It is grounded in the specific project situation
- **Reasoned**: It includes the thinking behind the suggestion
- **Comparative**: It presents alternatives when they exist
- **Transparent**: It communicates confidence and uncertainty
- **Actionable**: It provides concrete next steps
- **Educational**: It helps the developer understand engineering principles

Recommendations are the primary output of the workspace's intelligence. They are how the workspace's understanding becomes useful to the developer.

---

# Recommendation Hierarchy

Recommendations are built from a hierarchy of understanding.

**Observation** provides raw facts. A file was modified. A test failed. A decision was made. Observations are the foundation.

**Intent** interprets observations into understanding of what the developer is trying to accomplish. Intent gives observations purpose and direction.

**Context** selects relevant information for the current reasoning task. Context ensures that recommendations are grounded in the right project understanding.

**Memory** provides historical understanding. Past decisions, lessons learned, and project evolution inform current recommendations.

**Knowledge** provides validated engineering understanding. Patterns, principles, and proven approaches shape recommendation quality.

**Reasoning** applies engineering judgment to evaluate alternatives, assess trade-offs, and form conclusions. Reasoning transforms understanding into guidance.

**Recommendation** is the output of this hierarchy. It synthesizes observation, intent, context, memory, knowledge, and reasoning into actionable guidance.

**Decision** is the developer's response to the recommendation. The developer accepts, rejects, modifies, or defers the suggestion.

**Outcome** is the result of the decision. Outcomes provide evidence that feeds back into memory and knowledge.

**Learning** is the improvement that comes from outcomes. Learning makes future recommendations better.

Each level depends on the previous one. A recommendation without observation is speculation. A recommendation without intent is generic. A recommendation without context is uninformed. A recommendation without knowledge is unvalidated. A recommendation without reasoning is unexamined.

The Recommendation Engine ensures that every recommendation is built on the full hierarchy of understanding.

---

# Recommendation Lifecycle

Recommendations pass through a lifecycle from creation to archival.

**Created:** The recommendation is formulated based on current context, intent, knowledge, and reasoning. Creation synthesizes multiple perspectives into coherent guidance.

**Validated:** The recommendation is checked for consistency with project goals, constraints, and past decisions. Validation ensures that the recommendation is appropriate for the project.

**Presented:** The recommendation is shared with the developer with reasoning, alternatives, and confidence level. Presentation is the moment the developer receives the guidance.

**Accepted:** The developer acts on the recommendation. Acceptance transforms the recommendation into a decision. The outcome is recorded for future learning.

**Rejected:** The developer declines the recommendation. Rejection is recorded with any provided reasoning. Rejection teaches the workspace about preferences and constraints.

**Deferred:** The recommendation is relevant but not acted on now. Deferral is recorded with conditions for future relevance. Deferred recommendations remain alive.

**Modified:** The developer accepts part of the recommendation or adapts it to their needs. Modification is recorded with the changes and reasoning. Modification teaches the workspace about developer preferences.

**Replaced:** A newer recommendation supersedes the current one. Both are preserved to document the evolution of thinking. Replacement is recorded with the rationale for the change.

**Expired:** The recommendation is no longer relevant due to project changes or resolved issues. Expiration is recorded. Expired recommendations are preserved in memory for retrospective learning.

**Archived:** The recommendation is moved to long-term storage. It remains available for historical reference but no longer influences active reasoning. Archival preserves the narrative of project evolution.

The lifecycle is not always linear. Recommendations may be presented multiple times in modified form. They may be revived after expiration if conditions change. They may be rejected and later accepted when context shifts.

The Recommendation Engine tracks the full lifecycle of every recommendation. The lifecycle provides the data for learning, improvement, and knowledge extraction.

---

# Recommendation Confidence

Confidence reflects how certain the Recommendation Engine is that the recommendation is appropriate, accurate, and valuable for the current situation.

**High confidence:** Multiple signals align. Project context is clear. Knowledge is validated. Reasoning is sound. The recommendation is well-supported. High confidence enables firm, specific recommendations.

**Medium confidence:** Signals generally support the recommendation but some ambiguity remains. Context is mostly complete. Knowledge is applicable but may have boundary conditions. Reasoning is sound but with some uncertainty. Medium confidence enables recommendations with appropriate caveats.

**Low confidence:** Signals are ambiguous or conflicting. Context has gaps. Knowledge is emerging or incomplete. Reasoning is tentative. Low confidence produces suggestions with explicit acknowledgment of uncertainty and multiple alternatives.

**Unknown:** Insufficient information to form a confident recommendation. The workspace acknowledges the gap and either requests more information or provides general guidance that spans possible scenarios.

Confidence is not about the quality of the Recommendation Engine. It is about the quality of available evidence and understanding. Even a perfect engine cannot achieve high confidence from incomplete context or insufficient knowledge.

Confidence guides presentation. High-confidence recommendations are presented firmly. Low-confidence recommendations are presented tentatively. Unknown situations trigger exploration rather than recommendation.

Confidence is communicated transparently. The developer understands how certain the workspace is and why. Transparency about confidence builds trust.

---

# Recommendation Quality

Recommendations have quality dimensions that determine their value.

**Relevant:** The recommendation addresses the developer's actual intent and current project needs. It is not generic advice disconnected from the project.

**Actionable:** The recommendation provides concrete next steps that the developer can act on. It does not merely observe or analyze without suggesting action.

**Timely:** The recommendation arrives at the right moment. It is not too early to be premature and not too late to be obsolete.

**Explainable:** The recommendation includes reasoning that the developer can understand. The developer knows why the suggestion is made.

**Evidence-based:** The recommendation is grounded in project context, validated knowledge, and sound reasoning. It is not based on speculation or assumption.

**Context-aware:** The recommendation reflects the specific project situation, not generic patterns. It considers current phase, recent decisions, active constraints, and project history.

**Constraint-aware:** The recommendation respects known constraints—budget, timeline, technology, team, experience. It does not suggest approaches that violate real boundaries.

**Risk-aware:** The recommendation considers potential negative consequences. It identifies risks and proposes mitigation when appropriate.

**Goal-aware:** The recommendation aligns with project goals. It does not advance objectives that have been superseded or that conflict with established direction.

**Trustworthy:** The recommendation is consistent with previous guidance. It does not contradict established decisions without explanation. It builds trust through reliability.

Quality is not automatic. The Recommendation Engine continuously monitors and improves recommendation quality through outcome tracking, learning, and adaptation.

---

# Recommendation Types

Recommendations take many forms depending on the engineering need.

**Strategic:** Guidance about project direction, goal setting, and long-term planning. Strategic recommendations answer: what should we build and why?

**Architectural:** Guidance about technical structure, design patterns, and system organization. Architectural recommendations answer: how should the system be structured?

**Implementation:** Guidance about coding approaches, feature development, and technical execution. Implementation recommendations answer: how should we build this?

**Debugging:** Guidance about issue investigation, root cause analysis, and problem resolution. Debugging recommendations answer: what is wrong and how do we fix it?

**Security:** Guidance about vulnerabilities, protection mechanisms, and security practices. Security recommendations answer: how do we protect the system and its users?

**Performance:** Guidance about optimization, efficiency, and scalability. Performance recommendations answer: how do we make this faster or more efficient?

**Documentation:** Guidance about what to document, how to document it, and when documentation is needed. Documentation recommendations answer: what should be recorded and why?

**Testing:** Guidance about test strategy, coverage, validation approaches, and quality assurance. Testing recommendations answer: how do we ensure this works correctly?

**Deployment:** Guidance about release preparation, environment configuration, and production readiness. Deployment recommendations answer: how do we ship this safely?

**Workflow:** Guidance about engineering process, stage progression, and workflow adaptation. Workflow recommendations answer: what should we do next in this process?

**Learning:** Guidance about skill development, knowledge gaps, and educational resources. Learning recommendations answer: what should the developer learn to be more effective?

**Research:** Guidance about tool evaluation, technology selection, and build-versus-buy decisions. Research recommendations answer: what options exist and which are best?

**Opportunity:** Guidance about improvements, optimizations, and positive enhancements. Opportunity recommendations answer: how could this be better?

**Risk:** Guidance about threats, vulnerabilities, and potential problems. Risk recommendations answer: what could go wrong and how do we prepare?

Each type requires different emphasis, different evidence, and different presentation. The Recommendation Engine adapts its approach to the recommendation type while maintaining consistent quality standards.

---

# Recommendation Timing

Timing determines whether a recommendation is helpful or disruptive.

**Immediate:** The recommendation addresses an urgent issue that cannot wait. Security vulnerabilities, production incidents, and deployment blockers require immediate attention.

**Soon:** The recommendation addresses an important issue that should be addressed in the near term. Architecture concerns, technical debt, and planning gaps deserve attention but do not require interrupting current flow.

**Later:** The recommendation addresses a valuable improvement that can wait until current work is complete. Optimization opportunities, documentation improvements, and refactoring suggestions are presented at appropriate moments.

**Future:** The recommendation anticipates needs that have not yet emerged. Future recommendations prepare the developer for upcoming challenges without creating anxiety about distant possibilities.

Timing philosophy: Never interrupt unnecessarily.

The Recommendation Engine respects the developer's flow. It does not surface recommendations that would disrupt productive work unless the cost of waiting exceeds the cost of interruption.

Timing is guided by:
- The interrupt budget defined in WORKSPACE_BEHAVIOR.md
- The developer's current focus and engagement
- The severity and urgency of the issue
- The project phase and current state
- The trust level and developer receptivity

Well-timed recommendations feel like helpful guidance. Poorly-timed recommendations feel like annoying interruptions. The Recommendation Engine prioritizes timing as a core quality dimension.

---

# Recommendation Priority

Not all recommendations are equally important.

**Critical:** The recommendation addresses an issue that must be resolved immediately. Security vulnerabilities, data loss risks, and system failures are critical. Critical recommendations override all other considerations.

**High:** The recommendation addresses an important issue that significantly affects project quality or trajectory. High-priority recommendations receive prominent presentation and clear explanation.

**Medium:** The recommendations address valuable improvements that enhance quality, maintainability, or efficiency. Medium-priority recommendations are presented clearly but do not dominate the conversation.

**Low:** The recommendations address minor improvements or optimizations. Low-priority recommendations are presented gently and may be queued for natural conversation moments rather than immediate presentation.

**Informational:** The recommendations provide knowledge without requiring action. Informational recommendations help the developer understand without demanding change.

Priority is not about the importance of the underlying issue alone. It is about the importance of the issue relative to the developer's current context. A security issue that is well-understood and already scheduled for remediation may be lower priority than a deployment blocker that blocks immediate progress.

The Recommendation Engine continuously re-evaluates priority as project state, intent, and context evolve. Priority is dynamic, not static.

---

# Recommendation Adaptation

Recommendations adapt to the specific situation, developer, and project.

**Developer experience:** Recommendations for novice developers include more explanation, more context, and more validation. Recommendations for experienced developers are more concise and assume greater familiarity. Adaptation respects the developer's current capability while preserving growth opportunity.

**Project maturity:** Recommendations for early-stage projects emphasize exploration, validation, and flexibility. Recommendations for mature projects emphasize refinement, stability, and maintainability. Adaptation matches the project's lifecycle stage.

**Constraints:** Recommendations adapt to known constraints. A tight budget shifts recommendations toward cost-effective solutions. A tight timeline shifts recommendations toward essential features. A limited team shifts recommendations toward automation and simplicity.

**Current focus:** Recommendations align with what the developer is currently working on. Recommendations that serve the current focus are prioritized. Recommendations that serve other goals are deferred or queued.

**Trust level:** High trust enables more proactive, personalized recommendations. Low trust requires more verification, more explanation, and more alternatives. Adaptation calibrates boldness to trust.

**Workspace state:** Active workspace state enables continuous guidance. Passive workspace state reduces intervention. Adaptation respects the workspace's current operating mode.

**Engineering state:** Planning state produces recommendations about scope, goals, and roadmap. Implementation state produces recommendations about code quality and architecture consistency. Testing state produces recommendations about coverage and edge cases. Deployment state produces recommendations about readiness and operational concerns. Adaptation matches recommendations to the engineering phase.

Adaptation ensures that recommendations are appropriate, not just correct. A technically correct recommendation that ignores the developer's experience level, project constraints, or current focus is not valuable. Adaptation makes recommendations genuinely useful.

---

# Recommendation Alternatives

Every engineering decision has alternatives. The Recommendation Engine presents them.

**Why alternatives matter:** Alternatives reveal the decision landscape. They show what was considered and why one path was preferred. They enable the developer to make informed choices rather than accepting a single suggestion.

**How trade-offs should always be visible:** Every alternative involves trade-offs. The Recommendation Engine makes these trade-offs explicit. The developer understands what is gained and what is sacrificed with each option.

**Why there is rarely only one correct engineering decision:** Engineering operates under constraints. Multiple valid approaches often exist within those constraints. The "best" choice depends on priorities that the developer must weigh.

Alternatives are not presented to confuse. They are presented to inform. The developer does not need to evaluate every alternative in depth. But the developer should know that alternatives exist and understand the high-level trade-offs.

When the Recommendation Engine has high confidence in a particular approach, it presents that approach prominently while still acknowledging alternatives. When confidence is lower, it presents multiple alternatives with their relative merits.

Alternatives respect developer judgment. They say: here are the options, here is what we know about them, here is what we recommend and why. The developer decides.

---

# Trade-Off Analysis

Engineering is the discipline of making trade-offs under constraints. Every recommendation involves trade-offs.

**Cost:** What financial resources are required? What is the ongoing expense? How does this choice affect the budget?

**Time:** How long will this take? What is the opportunity cost? How does this affect the timeline?

**Complexity:** How complicated is this approach? Does it introduce new dependencies, new concepts, or new coordination requirements?

**Maintainability:** How easy is this to maintain over time? Does it create technical debt? Does it simplify or complicate future changes?

**Scalability:** How well does this handle growth? Does it enable future expansion or does it create bottlenecks?

**Performance:** How fast is this? How efficient? What are the resource requirements?

**Security:** How secure is this approach? What vulnerabilities does it introduce or mitigate?

**Learning value:** What does the developer learn from this approach? Does it build capability or create dependency?

**Developer experience:** How does this affect the developer's workflow, satisfaction, and effectiveness? Does it reduce friction or create it?

**Business value:** How does this serve the project's goals? Does it deliver user value? Does it align with business priorities?

Trade-off analysis is not about finding the perfect solution. It is about making the sacrifices explicit so that the developer can make informed choices.

The Recommendation Engine does not make trade-offs for the developer. It surfaces them. It explains what is gained and what is lost with each option. The developer weighs the trade-offs based on their priorities.

---

# Recommendation Relationships

Recommendations connect to every major concept in the workspace.

**Recommendations and Observation:** Observations provide the raw facts that trigger recommendations. A test failure, a file change, a risk indicator—all may generate recommendations.

**Recommendations and Intent:** Recommendations are aligned with developer intent. A recommendation that serves the developer's actual goal is valuable. A recommendation that misses intent is noise.

**Recommendations and Context:** Recommendations are grounded in context. Context Intelligence ensures that recommendations are based on relevant project understanding rather than generic patterns.

**Recommendations and Engineering Memory:** Recommendations reference past decisions and lessons learned. Memory ensures that recommendations build on previous understanding rather than repeating past discussions.

**Recommendations and Knowledge:** Recommendations draw on validated knowledge. Knowledge makes recommendations reliable rather than speculative.

**Recommendations and Reasoning:** Recommendations are the output of reasoning. Reasoning evaluates alternatives, assesses trade-offs, and forms conclusions that become recommendations.

**Recommendations and Workflow:** Recommendations guide workflow progression. At each workflow stage, the Recommendation Engine provides guidance on how to proceed.

**Recommendations and Project Intelligence:** Project Intelligence provides project understanding that informs recommendations. Recommendations are project-specific because they are grounded in project intelligence.

**Recommendations and Project Health:** Project Health assessments inform recommendations. Low health in a dimension triggers targeted recommendations for improvement.

**Recommendations and Engineering GPS:** Engineering GPS produces navigation recommendations that guide the project toward its goals. GPS recommendations are about direction and next steps.

**Recommendations and Trust:** Trust influences how recommendations are received and how proactively they are offered. High trust enables bolder recommendations. Low trust requires more verification and explanation.

These relationships mean that recommendations are not isolated outputs. They are the synthesis of the entire workspace's understanding. Every engine contributes to the quality and relevance of recommendations.

---

# Recommendation During Long Projects

Projects that span weeks, months, or years require continuous recommendation adaptation.

**Weeks:** Recommendations accumulate across the week. Patterns emerge. The workspace learns what guidance the developer finds valuable and what is premature or misaligned.

**Months:** Recommendations evolve as the project matures. Early recommendations focus on exploration and validation. Later recommendations focus on refinement and optimization. The Recommendation Engine adapts its emphasis based on project phase.

**Years:** Recommendations become highly personalized and deeply contextual. The workspace understands the project's evolution, the developer's preferences, and the accumulated lessons. Recommendations reflect years of shared understanding.

Long projects allow the Recommendation Engine to learn deeply about the project and developer. Recommendation quality improves over time as the engine accumulates outcome data and refines its approach.

Long projects also face recommendation continuity challenges. The developer may return after extended inactivity. The Recommendation Engine uses Engineering Memory and Project Intelligence to provide continuity—recommendations that acknowledge what has changed and what remains relevant.

Recommendations during long projects respect the project's history. They do not repeat resolved issues. They build on established decisions. They acknowledge evolution and adapt to current reality.

---

# Recommendation and Cognitive Load

Recommendations reduce cognitive load by making good decisions easier.

The developer does not need to:
- Research every decision from first principles
- Remember every past lesson and apply it correctly
- Evaluate every alternative in depth
- Track every constraint and ensure recommendations respect them
- Monitor every risk and propose mitigation
- Validate every assumption before proceeding

Recommendations handle this cognitive work. The developer receives guidance that has already considered alternatives, evaluated trade-offs, checked constraints, and assessed risks. The developer's cognitive load shifts from research and analysis to evaluation and choice.

Good recommendations reduce thinking without replacing thinking. The developer still makes decisions. The developer still applies judgment. But the developer thinks at a higher level—evaluating recommendations rather than deriving them from scratch.

Recommendations also reduce decision fatigue. When the workspace provides well-reasoned suggestions, the developer does not need to make every micro-decision. The developer can focus decision energy on the choices that matter most.

The Recommendation Engine measures its success not by how many recommendations it produces, but by how much easier it makes the developer's engineering thinking.

---

# Recommendation Integrity

Recommendations must maintain high integrity to be trustworthy.

**Evidence:** Recommendations are grounded in actual project context, validated knowledge, and sound reasoning. They are not based on speculation, assumption, or generic heuristics.

**Reasoning:** Every recommendation includes the reasoning behind it. The developer can understand why the suggestion is made. Reasoning is explicit, not hidden.

**Transparency:** Recommendations communicate confidence levels, acknowledge uncertainty, and present alternatives. Transparency builds trust and enables informed choice.

**Alternatives:** Recommendations present other viable options when they exist. Alternatives show that the workspace considered multiple paths rather than jumping to a single conclusion.

**Traceability:** Every recommendation can be traced to its inputs—observations, context, knowledge, and reasoning. Traceability enables verification and builds confidence.

**Confidence:** Recommendations communicate how certain the workspace is. Confidence helps the developer calibrate reliance on the guidance.

Recommendation integrity is essential because recommendations are the developer's primary interaction with workspace intelligence. If recommendations cannot be trusted, the workspace loses its value.

The Recommendation Engine guards integrity by ensuring that every recommendation is built on the full hierarchy of understanding, includes explicit reasoning, acknowledges uncertainty, and presents alternatives when they exist.

---

# Recommendation Mistakes

The Recommendation Engine can fail in several ways.

**Poor timing:** The recommendation arrives too early or too late. Too early, and it is premature or ignored. Too late, and it is obsolete. Poor timing reduces value and creates frustration.

**Poor context:** The recommendation is based on incomplete, outdated, or irrelevant context. Poor context produces recommendations that are technically correct but practically useless.

**Overconfidence:** The recommendation is presented with excessive certainty. Overconfidence eliminates the developer's ability to evaluate and reduces trust when the recommendation proves incorrect.

**False certainty:** The recommendation presents speculation as fact. False certainty misleads the developer and erodes trust when the speculation proves wrong.

**Generic advice:** The recommendation could apply to any project. It is not grounded in the specific project context. Generic advice is not valuable because it does not account for the project's unique situation.

**Recommendation overload:** Too many recommendations are presented at once. Overload creates decision fatigue and reduces the developer's ability to act on any of them.

**Tunnel vision:** The recommendation focuses on a single approach without considering alternatives. Tunnel vision limits the developer's options and may miss better solutions.

The Recommendation Engine guards against these failures through:
- Timing calibration based on interrupt budget and developer state
- Context validation before recommendation generation
- Confidence calibration based on evidence quality
- Transparency about uncertainty
- Project-specific context assembly
- Prioritization and sequencing of recommendations
- Alternative generation for significant decisions

Recommendation mistakes are inevitable in any system that provides guidance. The goal is not perfection. The goal is continuous improvement through outcome tracking and learning.

---

# Recommendation Conflicts

Recommendations may conflict with each other or with other project elements.

**Competing recommendations:** Two recommendations suggest different actions. Competition arises when different perspectives or priorities suggest different paths. Resolution considers project phase, constraint urgency, risk severity, and goal alignment. The Recommendation Engine may present both perspectives with reasoning rather than arbitrarily choosing one.

**Short-term vs long-term:** A recommendation that serves immediate needs may conflict with one that serves long-term goals. Resolution considers the project's current phase and the relative cost of delay. The Recommendation Engine explains the trade-off.

**Developer preference vs engineering best practice:** The developer may prefer an approach that differs from validated best practice. Resolution respects the developer's authority while explaining the trade-offs. The Recommendation Engine informs, it does not override.

**Project constraints vs ideal architecture:** The ideal architectural approach may violate project constraints. Resolution respects constraints as hard boundaries while explaining the implications. The Recommendation Engine adapts recommendations to work within constraints rather than ignoring them.

**Past decisions vs new evidence:** A new recommendation may contradict a past decision. Resolution acknowledges the evolution of understanding. The Recommendation Engine explains why the new recommendation differs and invites conscious reconsideration rather than silently overriding history.

Conflict resolution never sacrifices transparency. When recommendations conflict, the developer understands the disagreement and the reasoning behind the resolution. Transparency about internal complexity builds trust.

---

# Recommendation Lifecycle Learning

Every recommendation outcome provides learning that improves future recommendations.

**Accepted recommendations:** Validate the knowledge and reasoning that produced them. Accepted recommendations strengthen patterns and confirm approaches. They become precedent for future similar situations.

**Rejected recommendations:** Reveal preferences, constraints, or context that the Recommendation Engine did not fully account for. Rejection teaches what not to recommend or how to adapt recommendations for this developer or project.

**Deferred recommendations:** Inform timing and sequencing. Deferred recommendations indicate that the guidance was sound but the timing was wrong. The Recommendation Engine learns when to present similar recommendations.

**Modified recommendations:** Reveal how the developer adapts guidance to their needs. Modification teaches preferences and reveals gaps in the original recommendation. Modified recommendations inform future recommendation refinement.

**Expired recommendations:** Indicate that the project evolved away from the recommendation's relevance. Expiration teaches how project evolution affects recommendation validity.

Outcome tracking is continuous. The Recommendation Engine does not just generate recommendations. It learns from every outcome to improve future recommendations.

Learning is not just about individual recommendations. It is about patterns across many recommendations. The Recommendation Engine analyzes outcome patterns to refine its approach, improve context selection, and strengthen knowledge application.

---

# Recommendation Boundaries

The Recommendation Engine has clear boundaries. It should never:

**Own project state.** Project Intelligence owns project understanding. The Recommendation Engine uses that understanding to produce guidance. Using understanding is not owning it.

**Replace reasoning.** The Reasoning Engine applies engineering judgment. The Recommendation Engine presents the output of that judgment. Presenting output is not applying judgment.

**Replace developer judgment.** The developer makes engineering decisions. The Recommendation Engine informs those decisions. Informing is not replacing.

**Ignore context.** Context Intelligence selects relevant information. The Recommendation Engine uses that context to produce relevant recommendations. Using context is not selecting it.

**Ignore constraints.** Project Intelligence and Context Intelligence provide constraint awareness. The Recommendation Engine respects those constraints. Respecting constraints is not defining them.

**Ignore uncertainty.** The Reasoning Engine and Context Intelligence assess confidence. The Recommendation Engine communicates that confidence. Communicating uncertainty is not ignoring it.

**Invent evidence.** The Recommendation Engine draws on observations, memory, knowledge, and reasoning. It does not fabricate evidence to support recommendations.

**Hide trade-offs.** Every recommendation involves trade-offs. The Recommendation Engine makes them explicit. Hiding trade-offs would mislead the developer.

**Present opinions as facts.** Recommendations are suggestions based on evidence and reasoning. They are not objective truths. The Recommendation Engine distinguishes between validated knowledge and interpretation.

**Force decisions.** The developer decides. The Recommendation Engine recommends. Forcing decisions would violate developer agency.

**Operate without understanding.** The Recommendation Engine depends on Project Intelligence, Context Intelligence, and Reasoning Engine for understanding. It does not generate recommendations in isolation.

**Guarantee outcomes.** Recommendations improve the probability of good outcomes. They do not ensure them. The Recommendation Engine does not promise results that depend on execution, context, and circumstances beyond its control.

**Replace workflows.** The Workflow Engine structures engineering processes. The Recommendation Engine provides guidance within those processes. Replacing workflows would eliminate valuable structure.

**Ignore project history.** Engineering Memory provides historical understanding. The Recommendation Engine references that history to maintain consistency and learn from past decisions.

**Become a task manager.** The Recommendation Engine suggests what to consider. It does not track tasks, assign work, or manage execution.

**Operate without transparency.** Every recommendation includes reasoning, alternatives, and confidence. The Recommendation Engine does not present black-box guidance.

The Recommendation Engine exists to inform engineering judgment. Everything outside informing is outside its responsibility.

---

# Collaboration With Other Engines

The Recommendation Engine collaborates with every other engine in the workspace. It is the primary consumer of workspace intelligence and the primary producer of visible guidance.

**Workspace Core:** The Recommendation Engine informs Workspace Core about recommendation state, priority, and confidence. Workspace Core uses this information to coordinate timing, communication style, and proactivity.

**Observation Engine:** Observations provide the raw facts that may trigger recommendations. The Recommendation Engine receives observations that indicate opportunities, risks, or issues requiring guidance.

**Intent Engine:** Intent understanding ensures that recommendations align with what the developer is actually trying to accomplish. The Recommendation Engine requests intent hypotheses to tailor guidance.

**Project Intelligence:** Project Intelligence provides the project understanding that makes recommendations relevant. The Recommendation Engine requests project state, goals, constraints, and history.

**Context Intelligence:** Context Intelligence provides the relevant information needed for recommendation generation. The Recommendation Engine requests context packages assembled for specific reasoning tasks.

**Engineering Memory:** Engineering Memory provides historical understanding, past decisions, and lessons learned. The Recommendation Engine references memory to maintain consistency and avoid repeating past discussions.

**Knowledge Engine:** The Knowledge Engine provides validated patterns, principles, and lessons. The Recommendation Engine draws on knowledge to make recommendations reliable rather than speculative.

**Reasoning Engine:** The Reasoning Engine applies engineering judgment to evaluate alternatives and form conclusions. The Recommendation Engine receives reasoned conclusions and transforms them into actionable guidance.

**Workflow Engine:** The Workflow Engine requests recommendations at each stage of workflow execution. The Recommendation Engine provides stage-specific guidance that supports workflow progression.

**Project Health:** Project Health assessments identify areas requiring attention. The Recommendation Engine transforms health insights into actionable recommendations for improvement.

**Engineering GPS:** Engineering GPS provides navigation direction and next-step recommendations. The Recommendation Engine collaborates with GPS to ensure that recommendations align with project trajectory.

**AI Orchestrator:** The AI Orchestrator coordinates the timing, tone, and presentation of recommendations. The Recommendation Engine provides the content. The AI Orchestrator ensures appropriate delivery.

Collaboration is continuous. The Recommendation Engine does not operate in isolation. It receives understanding from every engine and transforms that understanding into guidance that serves the developer.

---

# Recommendation Principles

These principles govern Recommendation Engine behavior.

**Recommend, never command.** Every recommendation preserves developer agency. The developer decides. The workspace suggests.

**Explain every recommendation.** Reasoning is never hidden. The developer understands why guidance is given.

**Present alternatives.** Multiple valid paths usually exist. Alternatives enable informed choice.

**Communicate confidence.** Uncertainty is acknowledged openly. Confidence levels help the developer calibrate reliance.

**Ground in project context.** Recommendations are project-specific, not generic. They reflect the actual project situation.

**Respect constraints.** Recommendations operate within real boundaries. Constraints are not ignored to produce idealized guidance.

**Serve intent.** Recommendations align with what the developer is actually trying to accomplish. Intent-mismatched recommendations are noise.

**Support goals.** Recommendations advance project objectives. They do not serve goals that have been superseded.

**Reduce cognitive load.** Recommendations make good decisions easier. They do not create new cognitive burdens.

**Preserve agency.** The developer remains in control. Recommendations inform. They do not decide.

**Learn from outcomes.** Every recommendation outcome improves future recommendations. The engine continuously improves.

**Adapt to context.** Recommendations adjust to developer experience, project maturity, and current focus. One size never fits all.

**Be timely.** Recommendations arrive when they are most valuable. Timing is as important as content.

**Be transparent.** The developer can verify recommendation reasoning. Black-box guidance is not acceptable.

**Acknowledge uncertainty.** The workspace does not pretend certainty it does not have. Uncertainty is communicated clearly.

**Respect trust.** High trust enables proactive guidance. Low trust requires more verification and explanation. Trust calibrates behavior.

**Coordinate with workflows.** Recommendations guide workflow progression without replacing structured processes.

**Support navigation.** Recommendations align with Engineering GPS direction. They move the project toward its goals.

**Preserve history.** Recommendations reference past decisions and lessons. They build on understanding rather than repeating it.

**Measure value.** Recommendations are measured by their outcomes, not their quantity. Value comes from improvement, not volume.

**Evolve continuously.** Recommendations improve through learning. The engine never finalizes its approach.

---

# Non Goals

The Recommendation Engine does not:

**Own project state.** Project Intelligence owns project understanding. The Recommendation Engine uses that understanding.

**Replace reasoning.** The Reasoning Engine applies engineering judgment. The Recommendation Engine presents the output.

**Replace developer judgment.** The developer makes decisions. The Recommendation Engine informs them.

**Ignore context.** Context Intelligence selects relevant information. The Recommendation Engine uses it.

**Ignore constraints.** Constraints are provided by Project Intelligence and Context Intelligence. The Recommendation Engine respects them.

**Ignore uncertainty.** Confidence is provided by Reasoning and Context Intelligence. The Recommendation Engine communicates it.

**Invent evidence.** Evidence comes from Observation, Memory, and Knowledge. The Recommendation Engine does not fabricate it.

**Hide trade-offs.** Every recommendation involves trade-offs. The Recommendation Engine makes them explicit.

**Present opinions as facts.** Recommendations are suggestions based on evidence. They are not objective truths.

**Force decisions.** The developer decides. The Recommendation Engine recommends.

**Operate without understanding.** The Recommendation Engine depends on other engines for understanding. It does not generate guidance in isolation.

**Guarantee outcomes.** Recommendations improve probability. They do not ensure results.

**Replace workflows.** Workflows structure processes. Recommendations guide decisions within them.

**Ignore project history.** Engineering Memory provides historical understanding. The Recommendation Engine references it.

**Become a task manager.** The Recommendation Engine suggests what to consider. It does not track execution.

**Operate without transparency.** Every recommendation includes reasoning and confidence. The Recommendation Engine does not present black-box guidance.

**Maximize recommendation count.** Value comes from quality, not quantity. The Recommendation Engine does not flood the developer with suggestions.

**Disrupt flow.** Recommendations respect the developer's current engagement. They are timed to minimize disruption.

**Override developer preference.** Preferences are respected even when they differ from best practice. The Recommendation Engine informs; it does not override.

**Ignore learning.** Outcomes inform future recommendations. The Recommendation Engine continuously improves.

**Stop evolving.** Recommendation quality improves through continuous learning. The Recommendation Engine never finalizes its approach.

The Recommendation Engine exists to inform engineering judgment. Everything outside informing is outside its responsibility.

---

# Closing Philosophy

Every recommendation is the visible expression of everything the workspace has observed, understood, remembered, learned, and reasoned about.

Recommendations are not the intelligence. They are the conversation through which intelligence becomes useful.

The workspace observes reality. It understands project context. It remembers past decisions. It learns from experience. It reasons about alternatives. And then it recommends.

The recommendation is the moment when all that intelligence becomes actionable. When the developer receives a recommendation, they are receiving the distilled output of the entire workspace's understanding.

The Recommendation Engine exists so developers consistently make better engineering decisions while always remaining in control.

Better decisions come from:
- Understanding the project context
- Knowing what has been tried before
- Considering alternatives and trade-offs
- Applying validated knowledge
- Reasoning through consequences
- Maintaining agency and judgment

The Recommendation Engine makes this process easier without making it unnecessary. It reduces the cognitive load of good decision-making while preserving the judgment that makes engineering a human craft.

When the Recommendation Engine succeeds, the developer experiences a workspace that seems wise. Recommendations feel relevant, timely, and well-reasoned. The developer does not feel commanded or controlled. The developer feels informed and supported.

That experience is the result of the entire intelligence network working together. The Recommendation Engine is the visible tip of a vast submerged structure. What the developer sees is a suggestion. What the developer receives is the accumulated understanding of the workspace.

The Recommendation Engine is the workspace's voice. It speaks with the authority of observation, the understanding of project intelligence, the memory of engineering experience, the wisdom of validated knowledge, and the judgment of reasoning.

But it speaks as a partner, not an authority. It suggests. It explains. It collaborates. It respects.

That is the purpose of the Recommendation Engine. To transform understanding into guidance. To make engineering intelligence accessible. To help developers make better decisions while remaining in control.

When recommendations guide well, engineering improves. When engineering improves, software improves. When software improves, the world incrementally improves.

The Recommendation Engine exists to make that chain possible.

---

**Version:** 1.0

**Last Updated:** July 2026