# Intent Engine

**Version:** 1.0

**Status:** Living Document

---

# Purpose

This document defines the conceptual Intent Engine of the AI Software Engineering Workspace.

The Intent Engine is responsible for continuously understanding what the developer is actually trying to accomplish. It transforms signals, observations, and conversation into a coherent understanding of developer intent that guides every other intelligence capability in the workspace.

This is not an implementation document. It does not discuss LLMs, prompt engineering, embeddings, classifiers, NLP techniques, APIs, machine learning models, vector search, neural networks, programming languages, databases, or technical implementation.

Instead, it defines what intent means in the context of software engineering, how intent is discovered and refined, how intent differs from goals and prompts, and how intent understanding makes every recommendation, workflow, and guidance moment more relevant and valuable.

Every engineering recommendation begins with understanding what success means to the developer. Without understanding intent, intelligence becomes sophisticated guessing. The Intent Engine ensures that guessing is replaced by understanding.

---

# Intent Philosophy

Intent is discovered, not guessed. Not assumed. Not extracted from one message.

Understanding intent is a process of continuous discovery. It requires evidence, refinement, and sometimes correction. It cannot be extracted from a single prompt or a single conversation turn. It emerges from the accumulation of signals over time.

Intent continuously evolves. The developer's immediate objective may shift as the project evolves, as new information emerges, as obstacles appear, and as understanding deepens. The Intent Engine maintains a dynamic hypothesis that evolves with new evidence.

Understanding is earned. The Intent Engine does not claim certainty it has not earned. It builds confidence through evidence accumulation. It verifies when uncertainty remains. It corrects when evidence contradicts its understanding.

Intent is not static. It is not a label assigned once and maintained forever. It is a living hypothesis that the workspace continuously refines as it learns more about what the developer is actually trying to achieve.

The philosophy of the Intent Engine is humility. It understands that intent is internal to the developer and can only be inferred from external signals. It treats its understanding as a hypothesis to be validated, not a fact to be asserted.

---

# What The Intent Engine Does

The Intent Engine performs several fundamental activities:

**Interpret signals:** It receives observations and lightweight signals from the Observation Engine and interprets them as potential indicators of developer intent. A developer opening a deployment configuration may signal preparation for production. A developer modifying test files may signal debugging or quality improvement.

**Build hypotheses:** It constructs working hypotheses about what the developer is trying to accomplish. Hypotheses are not guesses. They are evidence-based interpretations that are continuously tested and refined.

**Maintain current understanding:** It maintains the workspace's current best understanding of developer intent. This understanding is continuously updated as new evidence arrives. It is never final. It is always the best current interpretation.

**Track confidence:** It maintains confidence levels alongside intent hypotheses. Confidence reflects how certain the workspace is that its intent understanding is accurate. Confidence guides how boldly the workspace acts on its understanding.

**Detect changing intent:** It recognizes when intent shifts. A developer who was planning a feature may pivot to debugging. A developer who was exploring options may commit to an approach. The Intent Engine detects these shifts and updates its understanding.

**Recognize conflicting intent:** It identifies when signals suggest different intents. A developer may say they are implementing a feature while their actions suggest they are debugging. The Intent Engine recognizes the conflict and seeks clarification rather than choosing arbitrarily.

**Recognize hidden intent:** It identifies when stated intent may not reflect actual intent. A developer may ask about architecture while actually preparing to make a structural change. The Intent Engine notices discrepancies between stated and indicated intent.

**Verify uncertainty:** When confidence is low or intent is ambiguous, the Intent Engine signals the need for verification. It prepares clarifying questions that help resolve uncertainty without disrupting the developer's flow.

**Support recommendations:** It provides intent understanding to the Recommendation Engine. Recommendations are produced with awareness of what the developer is actually trying to accomplish. Intent makes recommendations relevant rather than generic.

**Support context selection:** It provides intent understanding to Context Intelligence. Context is selected based on what matters for the current intent. Different intents require different context.

---

# What Is Intent

Intent is the outcome the developer is actually trying to accomplish.

Intent is not what the developer says. It is not the words they use. It is not the prompt they type. It is the underlying outcome they are working toward.

Intent answers: what does the developer want to be true when this work is complete?

Examples:
- A developer types "how do I implement authentication" — the prompt is about implementation, but the intent may be securing the application before deployment
- A developer opens a performance profiling tool — the action is opening a tool, but the intent may be understanding bottlenecks before optimization
- A developer asks about database options — the question is about databases, but the intent may be choosing storage that supports expected growth

Intent is the "why" behind the "what." It is the outcome that would make the developer satisfied, the problem that would be solved, the goal that would be achieved.

Understanding intent is essential because the same action can serve different intents. Implementing authentication could serve security, compliance, user trust, or investor confidence. Each intent requires different recommendations, different context, and different emphasis.

The Intent Engine exists to understand the "why" so that every other engine can serve the developer's actual goal rather than their immediate words.

---

# Prompt vs Intent

Prompts and intent are fundamentally different.

A **prompt** is what the developer types or says. It is the surface-level request. It may be clear or unclear, specific or vague, complete or incomplete.

A **question** is a request for information. Questions are prompts that seek answers. They reveal what the developer does not know or wants to confirm.

A **task** is an action the developer wants to perform. Tasks are prompts that request execution or guidance for execution.

A **request** is a statement of what the developer wants. Requests are prompts that may be explicit or implicit.

**Intent** is what the developer is actually trying to accomplish. It is the underlying outcome that motivated the prompt. It may be stated explicitly or may need to be inferred.

The differences matter because:
- A prompt may describe a solution without revealing the problem
- A question may ask about implementation while the intent is architectural
- A task may request a specific action while the intent is a broader goal
- A request may seem straightforward while hiding deeper needs

The Intent Engine looks past the prompt to understand the intent. It does not take prompts at face value. It interprets them in context, with evidence, and with awareness that what is said may not be what is meant.

---

# Intent vs Goal

Intent and goal are related but distinct concepts.

**Intent** is immediate and specific. It reflects what the developer is trying to accomplish right now, in this moment, with this action. Intent changes frequently as work progresses.

**Goal** is persistent and broader. It reflects what the project is trying to achieve over time. Goals persist across sessions, phases, and conversations.

The distinction matters because:
- A developer may have a long-term goal of building a secure application but immediate intent of debugging a login issue
- A project may have a goal of reaching production but immediate intent of understanding a test failure
- A developer's intent may shift within a single conversation while the project goal remains constant

The Intent Engine maintains both understanding. It knows the project's goals and the developer's current intent. It ensures that intent serves goal progression rather than diverging from it.

Intent without goal awareness is directionless. Goal without intent awareness is abstract. The Intent Engine connects the immediate to the strategic, ensuring that current actions align with long-term objectives.

---

# Intent Hypothesis

Intent is always a hypothesis. It is never a certainty.

The Intent Engine cannot read the developer's mind. It can only infer intent from signals—observations, conversations, project state, and behavior. These signals provide evidence, but evidence is not certainty.

A hypothesis is the workspace's best current understanding of intent, supported by available evidence. It is not a guess. It is an evidence-based interpretation that is continuously tested and refined.

Confidence grows as evidence accumulates. A single observation may produce low confidence. Multiple consistent observations produce higher confidence. Direct statements from the developer produce the highest confidence.

Hypotheses evolve as new evidence arrives. A hypothesis that seemed strong may weaken when contradictory evidence emerges. A hypothesis that seemed weak may strengthen when supporting evidence accumulates. The Intent Engine updates its understanding continuously.

The Intent Engine never finalizes a hypothesis. It always remains open to revision. This humility prevents the workspace from acting on false certainty. It ensures that the workspace remains corrigible—capable of being corrected when its understanding is wrong.

---

# Intent Confidence

Intent confidence reflects how certain the workspace is that its understanding matches the developer's actual intent.

**High confidence:** Multiple signals consistently point to the same interpretation. The developer has confirmed the understanding directly. Project state aligns with the hypothesis. High confidence enables bold, specific recommendations.

**Medium confidence:** Signals generally support the hypothesis but some ambiguity remains. The understanding is likely correct but not certain. Medium confidence enables recommendations with appropriate caveats and alternatives.

**Low confidence:** Signals are ambiguous, conflicting, or insufficient. Multiple interpretations are possible. Low confidence produces tentative suggestions, explicit acknowledgment of uncertainty, and clarifying questions.

**Unknown:** There is insufficient evidence to form a hypothesis. The workspace has no reliable understanding of intent. Unknown intent triggers exploration questions rather than recommendations.

Confidence is not about the quality of the Intent Engine. It is about the quality of available evidence. Even a perfect Intent Engine cannot achieve high confidence from insufficient signals.

Confidence guides behavior. High confidence enables proactive guidance. Low confidence requires verification before action. Unknown intent requires exploration before recommendation.

The Intent Engine communicates confidence to other engines so that they can calibrate their outputs appropriately.

---

# Evidence For Intent

Intent understanding is built from multiple evidence sources.

**Signals:** Interpreted observations that suggest possible meanings. Signals are the primary evidence for intent. A developer modifying deployment configuration signals preparation for release.

**Project state:** Current project condition provides context for intent. A project in the testing phase suggests intent related to quality verification. A project in the architecture phase suggests intent related to structural decisions.

**Conversation:** Current and recent conversations reveal what the developer is discussing, what questions they are asking, what decisions they are considering. Conversation is rich intent evidence.

**Workflow:** Active workflows indicate what the developer is trying to accomplish. A deployment workflow signals intent to ship. A refactoring workflow signals intent to improve code quality.

**History:** Past behavior reveals patterns. A developer who consistently reviews security before deployment likely has intent related to security even when not explicitly stated.

**Engineering Memory:** Recorded decisions and their rationale provide context for current intent. A recent decision to use microservices suggests intent aligned with that architecture.

**Constraints:** Active constraints shape intent. A tight deadline suggests intent focused on essential features. A limited budget suggests intent focused on cost-effective solutions.

**Focus:** Current project focus indicates what matters most. If the project is focused on deployment readiness, developer intent likely relates to deployment preparation.

No single source is sufficient. The Intent Engine combines multiple evidence sources to build robust understanding. When sources conflict, the Intent Engine recognizes the conflict and seeks clarification.

---

# Intent Evolution

Intent is not static. It evolves throughout the development process.

**Natural evolution:** Intent changes as understanding deepens. A developer may start with intent to "add authentication" and evolve to intent to "implement OAuth with social login" as requirements clarify. Natural evolution is expected and healthy.

**Sudden change:** Intent may shift abruptly when new information emerges. A developer preparing for deployment may pivot to debugging when a critical issue is discovered. Sudden changes are detected and understood rather than treated as disruptions.

**Refinement:** Intent becomes more specific over time. Early intent may be vague: "build something useful." Later intent becomes precise: "implement rate limiting for the API." Refinement is normal progression.

**Abandonment:** Intent may be abandoned when goals change, when better alternatives emerge, or when the intent proves misguided. Abandoned intent is recorded and understood, not treated as failure.

**Completion:** Intent is completed when the desired outcome is achieved. The developer's intent to fix a bug is complete when the bug is fixed. Completed intent is recognized and recorded.

**Replacement:** Intent may be replaced by new intent. A developer may abandon intent to build a custom solution when a superior third-party option is discovered. Replaced intent is preserved in history.

The Intent Engine tracks all forms of intent evolution. It maintains a record of how intent changed and why. This record becomes part of engineering memory and informs future intent understanding.

Intent evolution is not a problem. It is natural in creative work. The Intent Engine's job is to track evolution transparently, not to prevent it.

---

# Hidden Intent

Developers do not always state their true intent.

A developer may say they are "just exploring" while actually preparing to make a significant architectural change. A developer may ask "what do you think about this code" while actually seeking validation for a refactoring they have already planned. A developer may request documentation while actually preparing to hand off the project.

Hidden intent is not deception. It is the gap between immediate words and underlying goals. Developers may not articulate their full intent because they are exploring, because they are uncertain, because they are testing ideas, or because they do not yet fully understand their own goals.

The Intent Engine recognizes hidden intent by:
- Comparing stated intent with observed behavior
- Identifying patterns that suggest different underlying goals
- Noticing when actions contradict stated intentions
- Recognizing when project signals suggest different directions

When hidden intent is suspected, the Intent Engine does not confront. It inquires. It asks open questions that allow the developer to reveal their true intent without pressure. "I notice you've been looking at deployment configurations. Are you preparing to ship, or just reviewing options?"

Hidden intent is handled with respect. The developer is not accused of being indirect. The workspace simply offers an interpretation and invites correction. "It seems like you might be thinking about scaling. Is that right?"

Respecting hidden intent preserves trust while improving understanding. The developer feels seen, not scrutinized.

---

# Multiple Intent

Developers often have multiple intents simultaneously.

**Primary intent** is the dominant current objective. It is what the developer is primarily trying to accomplish right now. Primary intent guides immediate recommendations and context selection.

**Secondary intent** is a concurrent objective that is important but not dominant. A developer may have primary intent to debug a login issue and secondary intent to understand the authentication architecture. Secondary intent influences recommendations but does not dominate them.

**Background intent** is a long-term objective that persists in the background. A developer may have background intent to eventually refactor the entire authentication system while working on immediate debugging. Background intent informs strategic recommendations but does not disrupt immediate work.

**Future intent** is an anticipated objective that has not yet become active. A developer may know that after deployment they will need to set up monitoring. Future intent prepares the workspace to provide relevant guidance when the time comes.

**Dormant intent** is an objective that is paused but not abandoned. A developer may have paused work on a feature to address a critical bug. Dormant intent remains in memory and may be resumed later.

**Competing intent** occurs when two or more intents conflict. A developer may want both rapid deployment and thorough testing. Competing intent requires trade-offs and conscious choice. The Intent Engine identifies competing intents and surfaces them for the developer's consideration.

Multiple intent is normal. The Intent Engine manages the hierarchy without forcing false simplicity. It acknowledges that developers are complex and their objectives are multifaceted.

---

# Intent Drift

Intent drift occurs when the developer's actual intent gradually shifts without explicit acknowledgment.

Drift happens when:
- The developer's focus shifts incrementally through small decisions
- New information gradually changes the objective
- The developer explores tangents that become new directions
- The project evolves in ways that redirect attention

Drift is different from intentional pivot. Drift is unconscious. The developer may not realize their intent has shifted. They may think they are still pursuing the original objective while their actions suggest otherwise.

The Intent Engine detects drift by:
- Comparing recent signals against the established intent hypothesis
- Identifying when actions no longer align with stated intent
- Noticing when project focus has shifted without explicit goal updates
- Recognizing when conversation topics have wandered from original intent

When drift is detected, the Intent Engine surfaces it gently. "I notice we've moved from planning the API to discussing database schema. Is the database design now the focus, or are we still planning the API?"

Drift detection is not criticism. It is clarification. The developer may confirm the shift—intent has legitimately changed. Or the developer may recognize that drift occurred unconsciously and choose to return to the original intent.

Intent drift is natural in complex work. The Intent Engine's role is to make drift visible, not to prevent it.

---

# Intent Verification

The Intent Engine verifies its understanding when confidence is low or when significant decisions depend on intent accuracy.

**When to ask:**
- When confidence is low and the recommendation would be significantly different based on intent
- When signals are ambiguous or conflicting
- When a major decision depends on intent understanding
- When the developer's actions contradict their stated intent
- When the project phase changes and intent may have shifted
- When returning after a long absence and intent is uncertain

**When not to ask:**
- When confidence is high and the recommendation is minor
- When asking would disrupt productive flow
- When the developer is clearly focused and engaged
- When the intent is obvious from context
- When the recommendation is robust to intent variations

Verification should feel conversational, not interrogative. The Intent Engine does not present a form to be filled out. It asks natural questions that fit the conversation flow.

"I want to make sure I understand. Are you preparing to deploy this week, or just reviewing the setup?"

"Before I suggest an approach, is your priority speed of implementation or long-term maintainability?"

Verification respects the developer's time and attention. It asks only when the answer meaningfully changes guidance. It disappears into the conversation rather than demanding explicit focus.

---

# Intent Relationships

Intent connects to every major concept in the workspace.

**Intent and Observation:** Observations provide the raw signals that inform intent. Developer behavior, project changes, and conversation patterns all contribute evidence.

**Intent and Signals:** Signals are interpreted observations that indicate potential intent. The Intent Engine synthesizes signals into coherent intent understanding.

**Intent and Context:** Context is selected based on intent. Different intents require different context. The Intent Engine informs Context Intelligence about what is relevant for current intent.

**Intent and Engineering Memory:** Past intent patterns inform current intent understanding. The Intent Engine references historical behavior to refine current hypotheses.

**Intent and Knowledge:** Validated knowledge about typical intent patterns informs intent understanding. The Intent Engine uses knowledge to interpret ambiguous signals.

**Intent and Recommendations:** Recommendations are produced with awareness of intent. Intent-aligned recommendations are relevant and valuable. Intent-mismatched recommendations are generic or distracting.

**Intent and Workflow:** Workflows adapt to intent. Different intents may require different workflow stages or progression. The Intent Engine informs workflow adaptation.

**Intent and Project Intelligence:** Project Intelligence provides project understanding that informs intent interpretation. Intent is understood within project context.

**Intent and Project Health:** Project Health signals may affect intent. A project with critical health issues may have intent focused on remediation rather than new features.

**Intent and Engineering GPS:** Engineering GPS uses intent to determine navigation. The destination depends on what the developer is trying to achieve.

**Intent and Reasoning:** Reasoning produces recommendations based on intent understanding. The Reasoning Engine uses intent as a key input to its evaluation process.

These relationships make intent central to workspace intelligence. Intent understanding flows through every capability, ensuring that everything the workspace does is aligned with what the developer actually wants to achieve.

---

# Intent During Long Projects

Projects that span weeks, months, or years present unique intent challenges.

**Weeks:** Intent must survive week-long gaps. Returning to a project after a weekend should not require re-establishing intent. The Intent Engine preserves intent understanding across short absences.

**Months:** Intent may evolve significantly over months. A project that started as a prototype may now be intended for production. The Intent Engine tracks this evolution and updates its understanding accordingly.

**Years:** Intent may shift dramatically over years. A project may change markets, users, or purposes. The Intent Engine maintains long-term intent history while tracking current understanding.

Long projects also face intent rediscovery. After months of working on one aspect, the developer may return to a previous area with different intent. The Intent Engine recognizes returning areas and updates intent understanding based on new context.

Intent continuity across long projects means the workspace never needs to ask "what are you trying to do?" from scratch. It knows the project's history, the developer's patterns, and the current direction. It may ask for clarification on specifics, but it never starts from zero.

---

# Intent and Cognitive Load

Understanding intent should reduce cognitive load, not increase it.

The developer should not need to repeatedly state their intent. The workspace should understand from context, signals, and history. When the workspace understands intent correctly, the developer can focus on engineering rather than explaining themselves.

Intent understanding reduces questions. A workspace that understands intent does not need to ask "what are you trying to do?" at every turn. It knows. It asks only when understanding is uncertain or when a significant decision requires explicit confirmation.

Intent understanding reduces rework. When the workspace understands intent correctly, recommendations are relevant the first time. The developer does not need to correct misunderstood suggestions or redirect misguided guidance.

Intent understanding reduces mental overhead. The developer does not need to maintain a mental model of what the workspace knows. The workspace maintains its own understanding and acts accordingly.

The Intent Engine contributes to cognitive load reduction by making the workspace feel aware of the developer's goals without requiring constant explanation.

---

# Intent Mistakes

Intent understanding can fail in several ways.

**False assumptions:** The Intent Engine assumes an intent that is incorrect. False assumptions lead to recommendations that miss the mark, context that is irrelevant, and guidance that feels disconnected.

**Premature conclusions:** The Intent Engine forms a hypothesis too quickly, before sufficient evidence is available. Premature conclusions lock the workspace into an understanding that may be wrong and difficult to correct.

**Overconfidence:** The Intent Engine expresses high confidence in an intent understanding that is actually uncertain. Overconfidence leads to bold recommendations that are based on shaky foundations.

**Ignoring evidence:** The Intent Engine discounts signals that contradict its current hypothesis. Ignoring evidence prevents hypothesis revision and leads to persistent misunderstanding.

**Confirmation bias:** The Intent Engine favors signals that confirm its current hypothesis and discounts signals that contradict it. Confirmation bias creates a false sense of certainty.

These mistakes are dangerous because they propagate through every other engine. A wrong intent understanding produces wrong context selection, wrong recommendations, wrong workflow adaptation, and wrong project navigation. The error compounds.

The Intent Engine guards against these failures through:
- Continuous hypothesis testing against new evidence
- Transparency about confidence levels
- Willingness to revise understanding
- Active search for contradictory evidence
- Verification when confidence is insufficient

Intent mistakes are inevitable. The Intent Engine's goal is to detect and correct them quickly rather than letting them compound.

---

# Contradictory Intent

Developers sometimes exhibit contradictory intent.

A developer may say they want to refactor a module while simultaneously adding new features to it. A developer may express interest in microservices while continuing to add to a monolith. A developer may state a goal of reducing technical debt while accepting shortcuts to meet deadlines.

Contradictory intent is not hypocrisy. It is the natural result of competing priorities, evolving understanding, and complex goals. Developers hold multiple objectives simultaneously, and these objectives sometimes conflict.

The Intent Engine handles contradictory intent by:
- Acknowledging the conflict rather than resolving it arbitrarily
- Surfacing the contradiction for the developer's awareness
- Maintaining multiple intent hypotheses with appropriate confidence levels
- Adapting recommendations to address the conflict transparently
- Inviting the developer to clarify or prioritize

Contradictory intent is preserved, not suppressed. The workspace does not force false consistency. It recognizes that real projects involve real trade-offs and that developers navigate these trade-offs consciously.

When contradictory intent is detected, the Intent Engine may ask: "I'm noticing two different directions here. On one hand you're interested in refactoring, and on the other you're adding new features. Which should take priority right now?"

This question respects the developer's agency while making the conflict visible. The developer may choose one direction, pursue both sequentially, or find a third path. The Intent Engine supports whatever choice is made.

---

# Missing Intent

Sometimes intent cannot be determined.

Missing intent occurs when:
- Evidence is insufficient to form a hypothesis
- Signals are too ambiguous to interpret
- The developer is silent or uncommunicative
- The project is brand new with no history
- The developer has returned after a long absence with changed objectives

The Intent Engine handles missing intent by:
- Acknowledging the gap transparently
- Avoiding guesses to fill the void
- Asking exploratory questions when appropriate
- Continuing with general guidance when specific intent is unknown
- Monitoring for signals that clarify intent

Missing intent is not a failure. It is an honest representation of uncertainty. The workspace is better served by acknowledging what it does not know than by fabricating certainty.

When intent is missing, the Intent Engine shifts to exploration mode. It asks open-ended questions that help the developer clarify their objectives. It provides general guidance that is useful across possible intents. It remains ready to specialize as intent becomes clear.

Missing intent is temporary. As the developer engages, as signals accumulate, as context develops, intent understanding emerges. The Intent Engine is patient. It does not force premature conclusions.

---

# Intent Lifecycle

Intent passes through a lifecycle from first signals to retirement.

**Observation:** Signals from the Observation Engine provide raw evidence of possible intent. Developer actions, project changes, and conversation patterns all contribute.

**Signal:** Observations are interpreted as lightweight signals. Signals indicate potential meanings without committing to conclusions.

**Hypothesis:** The Intent Engine forms a working hypothesis about intent. The hypothesis is evidence-based but provisional. It is the best current understanding.

**Evidence:** Additional signals accumulate. Evidence supports or contradicts the hypothesis. Evidence strengthens, weakens, or redirects understanding.

**Verification:** When confidence is sufficient, the hypothesis is verified through direct questions or indirect confirmation. Verification converts hypothesis into understanding.

**Confidence:** The Intent Engine maintains confidence levels alongside understanding. Confidence reflects evidence strength and guides action boldness.

**Recommendation:** Intent understanding informs recommendations. Recommendations are produced with awareness of what the developer is actually trying to accomplish.

**Decision:** The developer's response to recommendations provides further evidence. Accepted, rejected, or modified responses refine intent understanding.

**Evolution:** Intent understanding evolves as new evidence arrives. Evolution is continuous and adaptive.

**Retirement:** Intent is retired when it is completed, abandoned, or replaced. Retired intent is preserved in history and informs future intent patterns.

The lifecycle is continuous. As one intent is resolved, another emerges. The Intent Engine maintains a continuous stream of intent understanding without gaps or restart.

---

# Intent Boundaries

The Intent Engine has clear boundaries. It should never:

**Reason.** The Reasoning Engine reasons. The Intent Engine understands what is being reasoned about. Understanding is not reasoning.

**Recommend.** The Recommendation Engine recommends. The Intent Engine informs what should be recommended. Informing is not recommending.

**Judge.** The developer judges. The Reasoning Engine evaluates. The Intent Engine understands. Understanding is not judging.

**Store memory.** Engineering Memory preserves knowledge. The Intent Engine uses memory to inform understanding. Using memory is not storing it.

**Replace context.** Context Intelligence selects relevant information. The Intent Engine informs what context is needed. Informing is not selecting.

**Replace Project Intelligence.** Project Intelligence understands the project. The Intent Engine understands the developer's immediate objective within the project. Developer understanding is not project understanding.

**Own project state.** Project Intelligence owns project understanding. The Intent Engine owns intent understanding. Intent is a perspective on the project, not the project itself.

**Ignore uncertainty.** The Intent Engine always communicates confidence. It never presents uncertain understanding as certain.

**Assume silently.** When intent is ambiguous, the Intent Engine seeks verification. It does not guess and act.

**Operate without signals.** Intent understanding requires evidence. The Intent Engine does not form hypotheses without signal support.

**Replace developer self-awareness.** The developer knows their own intent. The Intent Engine interprets signals. Interpretation does not replace self-knowledge.

**Guarantee accuracy.** Intent is internal and can only be inferred. The Intent Engine strives for accuracy but acknowledges limitations.

**Force consistency.** Intent may be contradictory. The Intent Engine acknowledges contradiction rather than forcing false consistency.

**Operate in isolation.** The Intent Engine collaborates with every other engine. It does not hoard intent understanding.

**Disrupt flow.** Intent verification happens at appropriate moments. The Intent Engine does not interrupt to ask about intent when it would be disruptive.

The Intent Engine exists to understand. Everything outside understanding is outside its responsibility.

---

# Collaboration With Other Engines

The Intent Engine collaborates with every other engine in the workspace. It is both a consumer and a producer in the intelligence network.

**Workspace Core:** The Intent Engine informs Workspace Core about current intent and confidence. Workspace Core uses this understanding to coordinate session management, proactivity calibration, and communication style.

**Observation Engine:** The Intent Engine receives signals from the Observation Engine. Signals are the raw evidence from which intent understanding is built.

**Project Intelligence:** The Intent Engine collaborates with Project Intelligence to align intent with project goals. Intent that diverges from project goals is flagged for clarification.

**Context Intelligence:** The Intent Engine provides intent understanding to Context Intelligence. Context is selected based on what matters for current intent. Intent determines context relevance.

**Engineering Memory:** The Intent Engine retrieves historical intent patterns from Engineering Memory. Past behavior informs current understanding.

**Knowledge Engine:** The Intent Engine requests knowledge about typical intent patterns. Knowledge helps interpret ambiguous signals.

**Reasoning Engine:** The Intent Engine provides intent understanding to the Reasoning Engine. Reasoning is conducted with awareness of what the developer is trying to accomplish.

**Recommendation Engine:** The Intent Engine is a primary input to the Recommendation Engine. Recommendations are produced with full intent awareness.

**Workflow Engine:** The Intent Engine informs the Workflow Engine about current intent. Workflows adapt to serve current objectives.

**Project Health:** Project Health signals may affect intent. A project with critical health issues may shift intent toward remediation.

**Engineering GPS:** Engineering GPS uses intent to determine navigation. The destination depends on what the developer is trying to achieve.

**AI Orchestrator:** The Intent Engine provides intent understanding to the AI Orchestrator. Orchestration uses intent to manage conversation flow, communication style, and intervention timing.

Collaboration is bidirectional. The Intent Engine receives signals from other engines and provides understanding to them. It is the workspace's shared awareness of what the developer is trying to accomplish.

---

# Intent Principles

These principles govern Intent Engine behavior.

**Intent is discovered, not extracted.** Understanding emerges from evidence accumulation, not from single prompts or messages.

**Intent is always a hypothesis.** The Intent Engine never claims certainty it has not earned. It maintains confidence alongside understanding.

**Intent evolves continuously.** Understanding is never final. It is continuously refined as new evidence arrives.

**Intent serves goals.** Immediate intent aligns with project goals. Divergence is flagged and clarified.

**Intent is private.** The developer's true intent is internal. The Intent Engine interprets signals respectfully without demanding explicit disclosure.

**Intent informs context.** Context is selected based on what matters for current intent. Intent determines relevance.

**Intent guides recommendations.** Recommendations are produced with intent awareness. Intent-aligned recommendations are valuable. Intent-mismatched recommendations are noise.

**Intent verification is conversational.** Clarification happens through natural conversation, not interrogation.

**Intent mistakes are corrected quickly.** The Intent Engine actively searches for contradictory evidence and revises understanding when needed.

**Intent continuity persists.** Understanding survives sessions, inactivity, and interruptions. The workspace never needs to start from scratch.

**Intent drift is surfaced.** Gradual shifts are made visible so the developer can confirm or correct.

**Multiple intent is acknowledged.** The workspace recognizes that developers have complex, multifaceted objectives.

**Hidden intent is respected.** The workspace inquires rather than accuses. It offers interpretations and invites correction.

**Intent confidence is transparent.** The developer can understand how certain the workspace is and why.

**Intent serves the developer.** Intent understanding reduces cognitive load, enables better recommendations, and makes the workspace feel aware. It does not constrain or control.

---

# Non Goals

The Intent Engine does not:

**Reason.** The Reasoning Engine reasons. The Intent Engine understands what is being reasoned about.

**Recommend.** The Recommendation Engine recommends. The Intent Engine informs what should be recommended.

**Judge.** Judgment belongs to the developer and Reasoning Engine. The Intent Engine understands.

**Store memory.** Engineering Memory preserves knowledge. The Intent Engine uses memory to inform understanding.

**Replace context.** Context Intelligence selects relevant information. The Intent Engine informs what is relevant.

**Replace Project Intelligence.** Project Intelligence understands the project. The Intent Engine understands the developer's immediate objective.

**Own project state.** Project Intelligence owns project understanding. The Intent Engine owns intent understanding within that project.

**Ignore uncertainty.** The Intent Engine always communicates confidence. It never pretends certainty.

**Assume silently.** Ambiguity triggers verification, not guessing.

**Operate without evidence.** Intent understanding requires signals. The Intent Engine does not hypothesize without support.

**Replace developer self-awareness.** The developer knows their own intent. The Intent Engine interprets external signals.

**Guarantee accuracy.** Intent is internal and inferential. The Intent Engine strives for accuracy but acknowledges limits.

**Force consistency.** Contradictory intent is acknowledged, not suppressed.

**Operate in isolation.** The Intent Engine collaborates with every other engine.

**Disrupt flow.** Verification happens at appropriate moments. The Intent Engine respects productive engagement.

**Control the developer.** Intent understanding serves the developer. It does not direct, constrain, or manipulate.

The Intent Engine exists to understand. Everything outside understanding is outside its responsibility.

---

# Closing Philosophy

Every engineering recommendation begins with understanding what success means to the developer.

Without understanding intent, intelligence becomes sophisticated guessing. Recommendations may be technically sound but practically irrelevant. Context may be complete but misaligned. Workflows may be well-structured but serving the wrong objective. The workspace may do everything right while still failing to help.

The Intent Engine is the compass of the workspace.

It does not decide where the developer should go. It discovers where they are already trying to go.

It does not set goals. It understands the goals the developer is pursuing.

It does not direct the journey. It ensures that every form of guidance—every recommendation, every workflow stage, every context selection—aligns with the developer's actual destination.

When the Intent Engine succeeds, the workspace feels aware. Recommendations feel relevant. Context feels appropriate. Guidance feels personalized. The developer does not need to repeatedly explain their objectives. The workspace understands.

That understanding is not magic. It is the result of continuous signal interpretation, evidence accumulation, hypothesis refinement, and honest acknowledgment of uncertainty. It is the result of the Intent Engine doing its work invisibly in the background.

The developer may never think about the Intent Engine. The developer may never be aware of the intent hypotheses being formed and refined. But the developer experiences the result: a workspace that seems to know what they are trying to accomplish and helps them get there.

That is the purpose of the Intent Engine. To be the compass that points toward the developer's actual destination. To ensure that every act of workspace intelligence serves the developer's true intent. To make the workspace not just intelligent, but relevant.

When the workspace understands intent, everything else becomes valuable. When intent is misunderstood, everything else becomes noise.

The Intent Engine exists to ensure understanding, not noise.

---

**Version:** 1.0

**Last Updated:** July 2026