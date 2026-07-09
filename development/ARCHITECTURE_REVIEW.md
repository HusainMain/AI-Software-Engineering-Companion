# Architectural Review

**Version:** 1.0  
**Status:** Approved Specification  
**Author:** Lead Software Architect  
**Date:** July 2026  

---

# Executive Summary

This document presents a critical architectural review of the AI Software Engineering Workspace design specifications. The purpose of this review is to validate the conceptual integrity of the system before coding begins, ensuring that boundaries are clean, dependencies are manageable, and core concepts have clear ownership.

Following a thorough evaluation of the 17 system specification documents, we have resolved several key inconsistencies, mapped circular dependencies into valid runtime feedback loops, defined the role of the Reasoning Engine, clarified the mapping of Tool Intelligence, and established a Concept Ownership Matrix. 

The architecture is assessed as **Ready for Implementation** under the scope of a single-project local-first MVP (Minimal Viable Intelligence v0.1).

---

# 1. Critical Evaluation of Key Architectural Areas

## 1.1 The Reasoning Engine
The specification contains a detailed document ([REASONING_ENGINE.md](REASONING_ENGINE.md)), but the Reasoning Engine is omitted from the 12 primary subsystems of [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md).

*   **Architectural Decision**: The Reasoning Engine is **not** a physical, standalone subsystem. It is a **conceptual cognitive model and design framework** implemented internally by specialized intelligence subsystems (Project Intelligence, Intent Engine, Recommendation Engine, Project Health Engine, and Engineering GPS) and coordinated by the AI Orchestrator.
*   **Reasoning**:
    1.  *Cohesion*: Combining all reasoning logic into a single physical subsystem would create a bloated monolith containing mixed domain logic (e.g., mixing security checks, intent modeling, and code complexity reasoning).
    2.  *Statelessness*: Reasoning is active cognitive processing. It belongs inside the specific subsystems that own the state they are reasoning about.
    3.  *Orchestration*: The AI Orchestrator is responsible for "coordinating specialized reasoning" across these engines. The Orchestrator uses the stages (Information → Knowledge → Understanding → Judgment) as a template for structuring reasoning workflows.

## 1.2 Circular Dependencies
We reviewed the conceptual dependencies in [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) and classified/resolved them as follows:

1.  **Project Intelligence <--> Context Intelligence**:
    *   *Classification*: **Acceptable Feedback Loop**.
    *   *Justification*: Project Intelligence maintains the long-term project state (goals, phases). Context Intelligence queries this project state (read-only) to select relevant information. There is no circular structural dependency: Context Intelligence behaves as a stateless query filter, and Project Intelligence does not depend on Context Intelligence to exist or initialize.
2.  **Context Intelligence <--> Observation Engine**:
    *   *Classification*: **Problematic Dependency (Redesigned)**.
    *   *Redesign*: The Observation Engine must be completely independent. It monitors all events passively and records them without filtering. It does *not* query Context Intelligence to determine what to observe. Context Intelligence queries raw observations from Engineering Memory and filters them. The dependency from Observation Engine to Context Intelligence is **rejected**.
3.  **Observation Engine <--> Engineering Memory**:
    *   *Classification*: **Problematic Dependency (Redesigned)**.
    *   *Redesign*: The Observation Engine must never query Engineering Memory. It emits raw, uninterpreted facts. The comparison of these facts against historical baselines is performed by `Project Intelligence` or the `Intent Engine` during their reasoning cycles. The dependency from Observation Engine to Engineering Memory is **rejected**.
4.  **Knowledge Engine <--> Recommendation Engine**:
    *   *Classification*: **Acceptable Asynchronous Loop**.
    *   *Justification*: The Recommendation Engine synchronously queries validated patterns from the Knowledge Engine. Separately, the Knowledge Engine asynchronously analyzes decision outcomes (stored in Engineering Memory) to update its patterns. This is a standard observer/producer feedback loop, not a synchronous dependency.

## 1.3 Tool Intelligence
The product blueprint defines Tool Intelligence as a core product pillar, but it does not exist in the system architecture.
*   **Architectural Decision**: Tool Intelligence is **not** a standalone subsystem. Its capabilities are distributed between the **Knowledge Engine** and the **Recommendation Engine**.
*   **Reasoning**:
    *   The **Knowledge Engine** owns the repository of tool characteristics, security history, compatibility patterns, and community standards.
    *   The **Recommendation Engine** owns the active evaluation, alternative generation, and trade-off analysis of tools for the current project context.
    *   This prevents code duplication and ensures that tool selection leverages the general recommendation framework.

## 1.4 Engineering Memory
The blueprint places Engineering Memory under Project Intelligence, while the system architecture promotes it to a standalone subsystem.
*   **Architectural Decision**: The promotion is a **genuine architectural refinement**.
*   **Reasoning**:
    *   Project Intelligence is dynamic and mutable, tracking the *present* state (goals, active focus, current health).
    *   Engineering Memory is archival and immutable, preserving the *past* (decisions, conversation histories, rejected alternatives).
    *   Separating them prevents a bloated Project Intelligence subsystem and ensures that long-term storage is decoupled from active project understanding.

## 1.5 Trust and Interrupt Budget Ownership
We evaluated where Trust and Interrupt Budget should live.
*   **Architectural Decision**: The **AI Orchestrator** is the singular owner of Trust, Interrupt Budget, Proactivity calibration, and Interaction policies.
*   **Reasoning**:
    *   The AI Orchestrator is responsible for coordinating conversation flow, selecting the collaboration mode, and balancing proactive/reactive behavior.
    *   Trust and Interrupt Budgets are user-interaction states that directly dictate when and how the AI interacts with the developer.
    *   Placing them in the AI Orchestrator ensures interaction policies are unified. Workspace Core remains a simple conductor, managing subsystem routing and session lifecycle without owning user-interaction logic.

---

# 2. Concept Ownership Matrix

To prevent conceptual duplication and ensure that every key idea has exactly one authoritative owner, we establish the following ownership matrix:

| Concept | Authoritative Subsystem Owner | Description |
| :--- | :--- | :--- |
| **Observation** | Observation Engine | Raw, factual record of an event or action. |
| **Signal** | Intent Engine | Lightweight interpretation of observations suggesting potential direction. |
| **Intent** | Intent Engine | Confidence-rated hypothesis of what the developer is trying to accomplish. |
| **Focus** | Project Intelligence | The singular engineering concern that deserves attention now. |
| **Context** | Context Intelligence | Curated selection of relevant facts prepared for a specific reasoning task. |
| **Engineering Memory** | Engineering Memory | Historical archive of decisions, rationale, and evolution. |
| **Knowledge** | Knowledge Engine | Validated, generalized principles, patterns, and lessons. |
| **Recommendation** | Recommendation Engine | Actionable guidance with trade-offs and alternatives. |
| **Project Health** | Project Health Engine | Assessment of engineering quality dimensions. |
| **Engineering GPS** | Engineering GPS | Navigation pathways and trajectory tracking toward goals. |
| **Workflow** | Workflow Engine | Repeatable engineering processes and playbooks. |
| **Trust** | AI Orchestrator | Developer trust level, which calibrates assistant proactivity. |
| **Project State** | Project Intelligence | Comprehensive model of goals, phase, and current state. |
| **Workspace State** | Workspace Core | Session status, subsystem status, and routing metadata. |

---

# 3. Implementation Invariants

These rules must never be violated during code implementation and serve as long-term contracts for future contributors:

1.  **Observations remain factual**: The Observation Engine must only record objective, timestamped facts. It must never contain assumptions, judgments, or recommendations.
2.  **Intent remains a hypothesis**: Intent must always have an associated confidence level. The system must never treat an inferred intent as an absolute certainty.
3.  **Engineering Memory is the authoritative historical source**: No subsystem may store its own historical decision records. All history, rationale, and alternatives must flow through and be retrieved from Engineering Memory.
4.  **Context selects rather than stores**: Context Intelligence is a stateless query-and-filter engine. It must never persist project data.
5.  **Knowledge must always be validated**: The Knowledge Engine must validate extracted lessons and patterns before exposing them as active knowledge. Unvalidated patterns remain classified as hypotheses.
6.  **Recommendations never bypass reasoning**: The Recommendation Engine must never output a recommendation without generating its accompanying reasoning, alternatives, and trade-offs.
7.  **GPS provides navigation, not task management**: Engineering GPS calculates routes and trajectories toward goals. It must never manage developer TODO lists or track developer task completion.
8.  **Stateless Workspace Core**: The Workspace Core coordinates subsystem routing and session lifecycles. It must never perform engineering reasoning or contain domain-specific intelligence.
