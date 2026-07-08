# Architecture Change Plan

**Version:** 1.0  
**Status:** Pending Approval  
**Author:** Principal Software Architect  
**Date:** July 2026  
**Prerequisite:** `ARCHITECTURAL_TRACEABILITY_AUDIT.md` v2.0 (Approved)

---

# Purpose

This document is the official Architecture Change Proposal (ACP) derived from the Architectural Traceability Audit v2.0. It defines every documentation change required before implementation begins, in exact detail.

This document does not modify any file. It defines what must be modified, where, why, in what order, and at what risk. After this plan is approved, another engineer should be able to execute every change listed here without making any architectural decisions.

**Critical Constraints:**
- No new subsystems are introduced
- No architecture is redesigned
- All changes are documentation corrections, specification enhancements, or clarifications
- Every change references the audit finding that justifies it

---

# 1. Investigation 1 — Audit Recommendation Validation

The following table evaluates every recommendation from `ARCHITECTURAL_TRACEABILITY_AUDIT.md` v2.0.

| Ref | Recommendation | Valid? | Type | Reason |
|:---|:---|:---:|:---|:---|
| C1 | Declare the UI/UX Application Model | ✅ Yes | Architectural Decision Record | No document specifies the application shell model. Blocks Observation Engine and AI Orchestrator implementation. Not a documentation polish item. |
| C2 | Reconcile Glossary Definitions | ✅ Yes | Terminology Update | Two confirmed conflicts ("Context", "Project Memory") mislead implementers. Three undefined critical terms (Trust, Reasoning, Signal) used in 14+ specifications. |
| C3 | Declare Design Intelligence as Post-v0.1 | ✅ Yes | Scope Clarification | Design Intelligence appears in `07_Product_Features.md`, `README.md`, and `03_Research_Log.md` but is absent from the architecture without explanation. Two independent teams would reach different conclusions. |
| C4 | Name Recommendation Engine Domains Explicitly | ✅ Yes | Specification Enhancement | The Recommendation Engine synthesizes across Security, Architecture, Cost, Deployment, and Tool Selection. None are named as explicit domains in its specification. This creates ambiguity about what the engine produces. |
| C5 | Define the Persistence Layer | ✅ Yes | Implementation Decision | Engineering Memory and Knowledge Engine cannot be implemented without knowing the storage format. A single decision record suffices — no new document required. |
| C6 | Trace Engineering GPS to Problem IDs | ✅ Yes | Responsibility Clarification | ENGINEERING_GPS.md has no cross-reference to validated problems. A single sentence addition provides research traceability and prevents drift toward task management. |
| C7 | Define Emergency Bypass Protocol for Project Health Engine | ✅ Yes | Behavioral Specification | The information flow verification (Investigation 12) identified an undefined bypass: critical health findings escalating directly to the developer. The criteria for this bypass must be documented to protect INV-12 (Project Health Engine assesses, does not command). |
| C8 | Map Subsystems to MVI Activation States | ✅ Yes | Implementation Guidance | IMPLEMENTATION_ROADMAP.md defines build order but not which subsystems are user-facing in MVI v0.1. Without this, teams will build all 12 subsystems to completion before validating the product. |

**Summary: All 8 recommendations are valid. Zero are rejected.**

---

# 2. Investigation 2 — Document Change Mapping

For each valid recommendation, this section identifies every affected document, the specific section requiring modification, the type of change, and why the change is necessary.

---

## C1: Declare the UI/UX Application Model

**Change Type:** Architectural Decision Record (new section)

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/IMPLEMENTATION_ROADMAP.md` | New Section: "Application Shell Decision" | Architectural Decision Record | This is the most appropriate home for implementation-critical decisions. The roadmap already defines build strategy; adding the application model decision keeps implementation context in one place. |
| `development/SYSTEM_ARCHITECTURE.md` | Section: "Design Philosophy" or "Cross-Cutting Concerns" | Implementation Guidance | The system architecture should acknowledge that the application shell model (the hosting runtime) is a design constraint that affects the Observation Engine's file system integration and the AI Orchestrator's conversation rendering. A single paragraph suffices. |

**What the change must state:**
- The chosen application model (e.g., Electron, Tauri, web-based) or — if the decision is genuinely deferred — an explicit statement that the decision is deferred and what the blocker is
- Which subsystems are most affected by this decision (Observation Engine, AI Orchestrator)
- What interface assumptions are made about file system access (native APIs, Node.js fs, browser File System Access API)
- What interface assumptions are made about conversation rendering (native window, web component, chat interface)

**What the change must NOT do:**
- Must not select a specific framework version (implementation decision)
- Must not describe UI components or visual design
- Must not constrain future platform expansion

---

## C2: Reconcile Glossary Definitions

**Change Type:** Terminology Updates (multiple)

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `10_Glossary.md` | Entry: "Context" | Terminology Update | Current definition: "The information provided to an AI model so it can understand a project, task, or conversation." This is AI-tool-centric and contradicts the engineering-decision-centric definition in `CORE_CONCEPTS.md`. The glossary must adopt the Core Concepts definition as authoritative. |
| `10_Glossary.md` | Entry: "Project Memory" | Terminology Update | Current definition: "Structured knowledge maintained about a project across multiple AI sessions." This understates Engineering Memory's scope (permanent archive of decisions, rationale, alternatives, and history). The entry must be updated or renamed to acknowledge Engineering Memory as the primary persistent layer. |
| `10_Glossary.md` | New Entry: "Trust" | New Definition | Trust Level is central to the AI Orchestrator's behavioral model and is referenced in WORKSPACE_BEHAVIOR.md but defined nowhere in the shared glossary. |
| `10_Glossary.md` | New Entry: "Reasoning" | New Definition | "Reasoning" is used in 14+ development documents as the primary cognitive activity of intelligence engines. It is never defined. Without a definition, implementers will interpret it differently across subsystems, creating behavioral inconsistency. |
| `10_Glossary.md` | New Entry: "Signal" | New Definition | Signal is defined in CORE_CONCEPTS.md but not in the shared glossary. It is a critical concept in the information flow (Observation → Signal → Intent). |
| `10_Glossary.md` | New Entry: "Interrupt Budget" | New Definition | Interrupt Budget is used in WORKSPACE_BEHAVIOR.md as a behavioral control mechanism alongside Trust but is not defined anywhere in shared project vocabulary. |
| `10_Glossary.md` | New Entry: "Engineering GPS" | New Definition | Engineering GPS is defined in CORE_CONCEPTS.md and has a full specification, but is absent from the shared glossary. New contributors would encounter this term without access to its definition. |
| `10_Glossary.md` | New Entry: "Focus" | New Definition | Focus (the singular engineering concern that deserves attention now) is formally defined in CORE_CONCEPTS.md and owned by Project Intelligence. It is absent from the shared glossary. |
| `development/CORE_CONCEPTS.md` | No changes required | — | CORE_CONCEPTS.md is authoritative and correct. It requires no modifications from this recommendation. Glossary must align to it, not the reverse. |

**What each new glossary entry must state:**
- Single-sentence definition aligned with CORE_CONCEPTS.md
- The authoritative owner (which engine or document defines it in full)
- A cross-reference: "See also: `CORE_CONCEPTS.md`"

**What these changes must NOT do:**
- Must not redefine terms differently from CORE_CONCEPTS.md
- Must not add implementation details to glossary entries
- Must not remove any existing valid glossary entry

---

## C3: Declare Design Intelligence as Post-v0.1

**Change Type:** Scope Clarification (multiple documents)

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/PRODUCT_BLUEPRINT.md` | Section: "Product Pillars" — Pillar 6: Tool Intelligence | Scope Clarification | The Product Blueprint currently lists Tool Intelligence but does not mention Design Intelligence as a pillar. The blueprint is the highest-authority architecture document. It should acknowledge that Design Intelligence is a planned post-v0.1 domain. |
| `development/IMPLEMENTATION_ROADMAP.md` | Section: "MVI v0.1 Specification" table | Scope Update | The MVI table does not reference Design Intelligence at all. A row should be added: "Design Intelligence | Post-v0.1 | Planned as a Recommendation Engine domain. Research validated (Research Log Update 11). Deferred to post-MVI." |
| `07_Product_Features.md` | Section: "5. Design Intelligence" | Scope Clarification | This section currently presents Design Intelligence as a planned feature without any implementation timeline or architectural status. A single note should be added: "Architectural status: Post-v0.1. Will be delivered as a domain within the Recommendation Engine." |
| `08_MVP_Roadmap.md` | Section: "Out of Scope (MVP)" | Scope Update | Design Intelligence should be explicitly added to the Out of Scope list. Currently it is not mentioned. Its absence from the out-of-scope list, combined with its presence in the product features, creates ambiguity about whether MVP teams should build it. |

**What the change must state:**
- Design Intelligence is a valid, research-backed product capability
- It is architecturally housed as a future domain within the Recommendation Engine
- It is explicitly deferred to post-v0.1
- Its knowledge patterns will be contributed by the Knowledge Engine when the domain is activated
- No new subsystem is required to deliver it

**What the change must NOT do:**
- Must not remove Design Intelligence from the product vision
- Must not undermine its research validation
- Must not suggest it is cancelled or deprioritized beyond the v0.1 boundary

---

## C4: Name Recommendation Engine Domains Explicitly

**Change Type:** Specification Enhancement

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/RECOMMENDATION_ENGINE.md` | Section: "Scope" or "Recommendation Domains" (new subsection) | Specification Enhancement | The Recommendation Engine specification does not enumerate its reasoning domains. Without explicit domain names, implementers cannot determine what the engine produces or in what categories. |

**The new section must enumerate:**

| Domain | Status in v0.1 | Description |
|:---|:---:|:---|
| Architecture | Active | Guidance on project structure, technology selection, scalability, design patterns |
| Security | Active | Authentication, secret management, input validation, deployment security |
| Cost Optimization | Active | Free-tier recommendations, build vs. buy analysis, hosting cost comparison |
| Tool Selection | Active | Library recommendations, third-party service evaluation, framework comparison |
| Deployment | Active | Hosting recommendations, environment validation, production readiness guidance |
| Documentation | Active (limited) | ADR recommendations, README guidance, documentation completeness suggestions |
| Design Intelligence | Post-v0.1 | UI/UX critique, accessibility review, animation guidance — deferred domain |

**What the change must also state:**
- The Recommendation Engine does not own knowledge patterns — the Knowledge Engine does
- The Recommendation Engine does not own health assessments — the Project Health Engine does
- The Recommendation Engine synthesizes across all active domains in a single coherent recommendation output
- Each domain produces the same output structure: recommendation + reasoning + alternatives + trade-offs + confidence level

**What the change must NOT do:**
- Must not split the Recommendation Engine into domain-specific engines
- Must not assign separate ownership to individual domains
- Must not introduce new subsystems

---

## C5: Define the Persistence Layer

**Change Type:** Implementation Decision Record

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/IMPLEMENTATION_ROADMAP.md` | New Section: "Data Persistence Decision" | Implementation Decision Record | Engineering Memory requires persistent storage of engineering decisions, rationale, and history. Knowledge Engine requires persistent storage of validated patterns. Context Intelligence needs read access to both. None of these subsystems can be implemented without knowing the storage format. |

**What the section must state:**
- The chosen storage format (e.g., SQLite for structured records, JSON files for configuration and patterns, or a combination)
- Which subsystems read from it (all intelligence engines via Context Intelligence)
- Which subsystems write to it (Observation Engine writes observations; Engineering Memory writes decisions; Knowledge Engine writes validated patterns)
- The migration policy: how data schema changes will be managed without losing historical engineering memory
- The backup expectation: whether project data is human-readable (e.g., JSON) or binary (e.g., SQLite WAL)

**Architectural constraints the decision must respect:**
- INV-04: Engineering Memory is append-only. The persistence format must support immutable record creation.
- INV-03: Context Intelligence is stateless. It must not persist data — it only reads.
- Local-first principle from PRODUCT_BLUEPRINT.md: All project data must be stored on the developer's device by default.

**What the change must NOT do:**
- Must not prescribe a specific database library version
- Must not prescribe an ORM or query builder
- Must not change any subsystem's conceptual responsibilities

---

## C6: Trace Engineering GPS to Problem IDs

**Change Type:** Responsibility Clarification (cross-reference addition)

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/ENGINEERING_GPS.md` | Section: "Purpose" or "Design Philosophy" | Responsibility Clarification | ENGINEERING_GPS.md has no cross-reference to validated problems. The architecture invented the GPS subsystem to solve validated problems; that link must be made explicit to protect against drift toward task management during implementation. |

**What the addition must state:**
- Engineering GPS exists to solve the following validated problems from the Master Problem Database:
  - P-001 (Starting Without a Clear Project Plan): GPS maintains a structured goal model that anchors project direction
  - P-003 (Scope Creep): GPS detects trajectory drift from goals and surfaces it as a project health signal
  - P-006 (No Project Roadmap): GPS generates and maintains route maps from current state to project goals
- Engineering GPS does NOT solve: task tracking, developer time management, sprint planning, or team coordination (these violate INV-11)

**What the change must NOT do:**
- Must not alter the GPS subsystem's design
- Must not add new capabilities to the GPS specification
- Must not expand GPS scope beyond navigation

---

## C7: Define Emergency Bypass Protocol for Project Health Engine

**Change Type:** Behavioral Specification

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/PROJECT_HEALTH_ENGINE.md` | New Section: "Emergency Escalation Protocol" | Behavioral Specification | The information flow verification (Audit §14.3) identified an accepted bypass: critical health findings may escalate directly to the developer without a full recommendation cycle. The criteria for this bypass are undefined. Without definition, the Project Health Engine may gradually become a command system, violating INV-12. |
| `development/AI_ORCHESTRATION.md` | Section: "Input Sources" or "Proactivity Triggers" | Specification Enhancement | The AI Orchestrator must acknowledge that it can receive direct escalations from the Project Health Engine for critical findings. This creates a named input channel alongside the normal Recommendation Engine path. |

**What the PROJECT_HEALTH_ENGINE.md section must define:**

Escalation criteria — findings that qualify for direct escalation:
- Exposed secrets detected in committed files
- Critical security vulnerability in a direct dependency
- Data loss risk identified (e.g., missing database backup configuration before deployment)
- Deployment blocker detected (e.g., missing environment variables in production configuration)

Non-escalation criteria — findings that must NOT bypass the recommendation cycle:
- Documentation health below threshold
- Technical debt score increase
- Missing test coverage
- Architecture style inconsistencies

Escalation behavior:
- The escalation must still include: finding description + severity + recommended action
- The escalation must not issue commands or block developer workflow
- The developer retains full authority to dismiss the escalation

**What the change must NOT do:**
- Must not give the Project Health Engine authority to block or halt developer actions
- Must not create a command pathway from Project Health Engine to the developer
- Must respect INV-12 (Project Health Engine assesses; it does not command)

---

## C8: Map Subsystems to MVI Activation States

**Change Type:** Implementation Guidance

| Document | Section | Change Type | Reason |
|:---|:---|:---|:---|
| `development/IMPLEMENTATION_ROADMAP.md` | Section: "Minimal Viable Intelligence (MVI) v0.1 Specification" | Specification Enhancement | The current MVI table defines what is included vs. excluded per subsystem, but does not define the activation state of each subsystem from a user-facing perspective. A team could build all 12 subsystems to full production quality before validating that the product hypothesis is correct. |

**The new column or table must specify for each subsystem:**

| Subsystem | Build State | User-Facing in v0.1 | Notes |
|:---|:---|:---:|:---|
| Observation Engine | Full | No (background) | Passive event recorder; no developer interaction |
| Engineering Memory | Partial | No (background) | Stores decisions; queries available to other engines |
| Context Intelligence | Partial | No (background) | Assembles context packages on demand |
| Workspace Core | Full | Yes (session management) | Developer sees project list, session state |
| Project Intelligence | Partial | Yes (goal tracking) | Developer sets goals, sees project state |
| Project Health Engine | Partial | Yes (dashboard) | Developer sees health scores |
| Intent Engine | Minimal | No (background) | Basic heuristic matching only in v0.1 |
| Knowledge Engine | Minimal | No (background) | Static pattern library in v0.1; no cross-project learning |
| Engineering GPS | Partial | Yes (navigation) | Developer sees current position and recommended next step |
| Recommendation Engine | Partial | Yes (guidance) | Single-path recommendations with reasoning |
| Workflow Engine | Partial | Yes (playbooks) | Sequential playbook execution only |
| AI Orchestrator | Partial | Yes (conversation) | Reactive conversation; basic proactivity toggle |

**What the change must NOT do:**
- Must not reduce the conceptual scope of any subsystem
- Must not suggest any subsystem is cancelled
- Must not change the build order defined elsewhere in the roadmap

---

# 3. Investigation 3 — Ripple Effect Analysis

This section maps every proposed change to its downstream dependencies, identifying all documents that must remain consistent after each modification.

## Ripple from C1 (Application Model Declaration)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/OBSERVATION_ENGINE.md` | File system integration model depends on application shell | After C1 is decided, verify that the Observation Engine specification's event detection mechanisms are consistent with the chosen model. No edit required at plan time; verification required post-decision. |
| `development/AI_ORCHESTRATION.md` | Conversation interface model depends on application shell | After C1 is decided, verify that the AI Orchestrator's interaction channel assumptions match the chosen model. Verification only. |
| `development/WORKSPACE_BEHAVIOR.md` | "First Launch Experience" and "Returning User Experience" describe UI behaviors | These sections may require minor clarifications once the application model is decided. No edit required at plan time. |

**Cascading Risk:** Medium. The application model decision propagates into 3 engine specifications, but as verification checks — not as architectural changes to those specifications.

## Ripple from C2 (Glossary Reconciliation)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/CORE_CONCEPTS.md` | Is the authoritative source for all updated definitions | No changes required. CORE_CONCEPTS.md is the source of truth. Glossary aligns to it. |
| `development/ENGINEERING_MEMORY.md` | Defines "Engineering Memory" in detail | After Glossary is updated to acknowledge Engineering Memory as the persistent layer, verify that the Glossary entry cross-references ENGINEERING_MEMORY.md correctly. |
| `development/WORKSPACE_BEHAVIOR.md` | Uses "Trust" extensively | After "Trust" is added to the Glossary, verify cross-reference is accurate. No change to WORKSPACE_BEHAVIOR.md required. |
| `04_Master_Problem_Database/*` | Uses "context" frequently in problem descriptions | Problem database entries use "context" in the everyday sense (information available to AI). The updated Glossary definition (engineering-decision-centric) is compatible; no edits to problem database required. |
| `development/RECOMMENDATION_ENGINE.md` | Uses "reasoning" as a core operation | After "Reasoning" is defined in the Glossary, verify the Recommendation Engine's use of the term is consistent. Likely no edit needed. |

**Cascading Risk:** Low. Glossary changes propagate as verification-only checks. No other document needs to be edited as a result of C2.

## Ripple from C3 (Design Intelligence Deferral)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/KNOWLEDGE_ENGINE.md` | Will eventually own Design knowledge patterns | After C3 is documented, add a single note to the Knowledge Engine specification acknowledging a planned "Design Intelligence" pattern category. No structural change. |
| `development/RECOMMENDATION_ENGINE.md` | Will eventually host the Design Intelligence domain | The domain table added by C4 already includes Design Intelligence as Post-v0.1. No additional ripple. |
| `README.md` | Mentions Design as a capability in the product vision | After C3 changes are made to product documents, verify that README.md is consistent. README describes long-term vision; the deferral of v0.1 scope does not contradict the README. No edit likely needed. |
| `09_Competitor_Research.md` | Lists design as a differentiation area | No change required. Competitor research is an evergreen document. |

**Cascading Risk:** Low. The deferral declaration is a scope boundary clarification. It does not remove Design Intelligence from any high-level vision document.

## Ripple from C4 (Recommendation Engine Domain Naming)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/KNOWLEDGE_ENGINE.md` | Is the authoritative source of patterns for each Recommendation Engine domain | After C4 names the domains, verify that the Knowledge Engine specification acknowledges providing patterns to each active domain. A domain-to-knowledge-category mapping paragraph should be added if absent. |
| `development/PROJECT_HEALTH_ENGINE.md` | Shares Security and Deployment responsibility boundaries with the Recommendation Engine | After C4 names Security and Deployment as Recommendation Engine domains, verify that PROJECT_HEALTH_ENGINE.md clearly distinguishes its role (assessment) from the Recommendation Engine's role (guidance). No structural change expected. |
| `development/SYSTEM_ARCHITECTURE.md` | Describes the Recommendation Engine at a high level | After C4, verify that the system architecture's Recommendation Engine entry is consistent with the named domains. A one-line addition noting multi-domain synthesis may be appropriate. |
| `development/ARCHITECTURE_REVIEW.md` | Documents the concept ownership matrix | After C4, verify that the ownership table in ARCHITECTURE_REVIEW.md is consistent with the named domains, particularly for Security, Deployment, and Cost. |

**Cascading Risk:** Low-Medium. C4 adds specificity to one engine's specification. Three documents require consistency verification; at most one (KNOWLEDGE_ENGINE.md) may require a minor addition.

## Ripple from C5 (Persistence Layer Decision)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/ENGINEERING_MEMORY.md` | Must respect the persistence format chosen | After C5 is decided, verify that Engineering Memory's specification (append-only, immutable records, retrieval model) is consistent with the chosen format. If SQLite: verify that the append-only invariant maps to insert-only table design. If JSON files: verify that the file structure supports efficient retrieval. |
| `development/KNOWLEDGE_ENGINE.md` | Must read from and write to the persistence layer | After C5, verify that the Knowledge Engine's pattern storage model is consistent with the chosen format. |
| `development/CONTEXT_INTELLIGENCE.md` | Must read from the persistence layer without writing | After C5, verify that Context Intelligence's read-only contract is explicit in the implementation notes. INV-03 must be referenced. |

**Cascading Risk:** Medium. The persistence decision has direct implementation consequences for 3 subsystems. However, if the chosen format is consistent with the append-only and local-first constraints, no architectural changes are needed — only implementation notes are added.

## Ripple from C6 (Engineering GPS Problem ID Tracing)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `04_Master_Problem_Database/01_Planning.md` | Contains P-001, P-003, P-006 | No change required. The problem database is the source being referenced. The cross-reference flows from GPS to the database, not the reverse. |
| `development/ARCHITECTURE_REVIEW.md` | Contains implementation invariant INV-11 (GPS navigates; does not manage tasks) | After C6, verify that the problem ID tracing reinforces rather than contradicts INV-11. It should — GPS solving planning problems is consistent with navigation, not task management. |

**Cascading Risk:** Very Low. A cross-reference addition in one specification. No downstream edits required.

## Ripple from C7 (Emergency Bypass Protocol)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/AI_ORCHESTRATION.md` | Must acknowledge receiving direct escalations from Project Health Engine | After C7 defines escalation criteria in PROJECT_HEALTH_ENGINE.md, add a corresponding acknowledgment in AI_ORCHESTRATION.md: "The AI Orchestrator receives two categories of health input: normal health summary (via Recommendation Engine) and emergency escalations (direct from Project Health Engine for critical findings)." |
| `development/WORKSPACE_BEHAVIOR.md` | Section: "Proactive Guidance" lists triggers for AI initiative | After C7, verify that the emergency escalation criteria in PROJECT_HEALTH_ENGINE.md are consistent with the proactive guidance triggers listed in WORKSPACE_BEHAVIOR.md. Security concerns and deployment blockers appear in both; they must be consistent. |
| `development/ARCHITECTURE_REVIEW.md` | Invariants INV-12 and INV-15 govern the bypass | After C7 defines the emergency bypass, verify that the bypass definition does not violate INV-12 (Project Health Engine assesses, does not command) or INV-15 (all developer interruptions route through AI Orchestrator). The bypass routes through the AI Orchestrator — this is consistent. |

**Cascading Risk:** Low-Medium. Three documents require consistency verification; AI_ORCHESTRATION.md requires a minor addition to acknowledge the emergency input channel.

## Ripple from C8 (MVI Activation State Mapping)

| Downstream Document | Dependency | Required Action |
|:---|:---|:---|
| `development/SYSTEM_ARCHITECTURE.md` | May need to acknowledge activation states | No change required. The system architecture is implementation-independent. Activation states are an implementation concern. |
| `08_MVP_Roadmap.md` | Defines MVP modules from a product perspective | After C8, verify that the MVI activation state table in IMPLEMENTATION_ROADMAP.md is consistent with the MVP modules in 08_MVP_Roadmap.md. Every user-facing MVP module should have a corresponding Active v0.1 subsystem. |
| All individual engine specifications | Each specification should align with its activation state | No edits required to individual specs. Activation states are defined in IMPLEMENTATION_ROADMAP.md, not in engine specs. Engine specs define the full capability; roadmap defines the v0.1 slice. |

**Cascading Risk:** Low. The activation state table is additive. It does not change any engine specification.

---

# 4. Investigation 4 — Change Risk Assessment

| Ref | Change | Risk Level | Risk Category | Explanation |
|:---|:---|:---:|:---|:---|
| C1 | Declare application model | 🔴 High | Architecture + Implementation | This is a product decision, not a documentation change. The wrong choice (e.g., choosing a web-only model when the product requires native file system access) would require significant rework. The risk is in making the decision, not in documenting it. Once decided correctly, risk drops to Low. |
| C2 | Reconcile Glossary | 🟡 Low | Terminology | Both source definitions (CORE_CONCEPTS.md) are already written. The Glossary update simply aligns to them. Risk of introducing contradictions is Very Low if CORE_CONCEPTS.md is followed precisely. |
| C3 | Declare Design Intelligence scope | 🟢 Very Low | Product Scope | Declaring a capability as post-v0.1 is a scope management decision. It removes ambiguity without removing the capability. No architectural change. Risk: stakeholders who expected Design Intelligence in v0.1 must be informed. |
| C4 | Name Recommendation Engine domains | 🟡 Low | Specification | Adding specificity to an existing specification. Domains are already implied; naming makes them explicit. Risk: if a domain is named incorrectly, it could create false expectations about the engine's output. Mitigation: domain definitions are checked against Knowledge Engine patterns. |
| C5 | Define persistence layer | 🔴 High | Implementation | A wrong persistence choice (e.g., flat JSON for a system that requires efficient querying of 10,000+ engineering decisions) creates technical debt immediately. The decision must respect the append-only invariant, local-first principle, and performance requirements. |
| C6 | Trace GPS to problem IDs | 🟢 Very Low | Responsibility | Adding three cross-reference IDs to one specification. No risk of contradiction or architectural change. |
| C7 | Define emergency bypass protocol | 🟡 Low-Medium | Behavioral | Defining bypass criteria for the Project Health Engine. Risk: criteria that are too broad will allow the health engine to behave as a command system (violating INV-12). Criteria must be limited to genuine emergencies (secrets exposure, data loss risk). |
| C8 | Map MVI activation states | 🟢 Very Low | Implementation Guidance | Additive table entry in the roadmap. No engine specification changes. No architectural changes. Risk: if activation states are defined too conservatively, teams may under-build v0.1 and fail to validate the product hypothesis. |

**Highest-risk decisions requiring careful judgment:** C1 (application model) and C5 (persistence layer). Both are technology decisions, not documentation changes. They must be made by a Principal Architect or CTO, not executed mechanically.

---

# 5. Investigation 5 — Architecture Stability Check

For every proposed change, we verify that it preserves the five architectural pillars.

| Ref | Preserves Subsystem Responsibilities? | Preserves Ownership Boundaries? | Preserves Architectural Invariants? | Preserves Information Flow? | Preserves Product Philosophy? |
|:---|:---:|:---:|:---:|:---:|:---:|
| C1 | ✅ | ✅ | ✅ | ✅ | ✅ |
| C2 | ✅ | ✅ | ✅ | ✅ | ✅ |
| C3 | ✅ | ✅ | ✅ | ✅ | ✅ |
| C4 | ✅ | ✅ | ✅ | ✅ | ✅ |
| C5 | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| C6 | ✅ | ✅ | ✅ | ✅ | ✅ |
| C7 | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| C8 | ✅ | ✅ | ✅ | ✅ | ✅ |

**C5 Invariant Risk — Detailed:**
The persistence layer decision must respect INV-04 (Engineering Memory is append-only). If the chosen format permits record modification (e.g., mutable JSON files with no write protection), the append-only invariant cannot be enforced at the persistence level. The specification must explicitly document how INV-04 is enforced in the chosen format.

**C7 Invariant Risk — Detailed:**
The emergency bypass protocol must respect INV-12 (Project Health Engine assesses, does not command) and INV-15 (all developer interruptions route through the AI Orchestrator). The bypass must be defined as: Project Health Engine → AI Orchestrator → Developer. Not as: Project Health Engine → Developer directly. If defined as a direct channel, INV-15 is violated.

---

# 6. Investigation 6 — Contradiction Prevention

We verify that implementing all proposed changes will not introduce new contradictions with any existing document.

| Change | Against: 01_Project_Vision | Against: 02_Product_Principles | Against: PRODUCT_BLUEPRINT | Against: CORE_CONCEPTS | Against: SYSTEM_ARCHITECTURE | Against: Engine Specs | Against: ARCHITECTURE_REVIEW | Against: TRACEABILITY_AUDIT |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| C1 (App Model) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ⚠️ Verify | ✅ Safe | ✅ Safe |
| C2 (Glossary) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe (source) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe |
| C3 (Design scope) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe |
| C4 (RE domains) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ⚠️ Verify | ⚠️ Verify | ✅ Safe | ✅ Safe |
| C5 (Persistence) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ⚠️ Verify | ✅ Safe | ✅ Safe |
| C6 (GPS trace) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe |
| C7 (Bypass) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ⚠️ Verify | ⚠️ Verify | ✅ Safe |
| C8 (MVI states) | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe | ✅ Safe |

**Legend:** ✅ Safe = no contradiction possible. ⚠️ Verify = a consistency check is required after the change but no contradiction is expected.

**Identified Verification Checkpoints:**

1. **C1 + Engine Specs**: After the application model is decided, verify that Observation Engine and AI Orchestrator specifications do not contradict the chosen model's capabilities (e.g., if web-only, the Observation Engine cannot use native file system watchers).

2. **C4 + System Architecture**: After Recommendation Engine domains are named, verify that SYSTEM_ARCHITECTURE.md's description of the Recommendation Engine is consistent (it currently says "context-aware guidance with reasoning, alternatives, and trade-offs" — this is compatible but may benefit from a domain reference).

3. **C4 + Engine Specs**: After Recommendation Engine domains are named, verify that KNOWLEDGE_ENGINE.md acknowledges supplying patterns to those specific domains.

4. **C5 + Engine Specs**: After persistence is decided, verify that ENGINEERING_MEMORY.md, KNOWLEDGE_ENGINE.md, and CONTEXT_INTELLIGENCE.md are consistent with the chosen format.

5. **C7 + AI_ORCHESTRATION.md**: After the emergency bypass protocol is defined, verify that AI_ORCHESTRATION.md acknowledges the emergency input channel from Project Health Engine.

6. **C7 + ARCHITECTURE_REVIEW.md**: After the bypass is defined, verify that the invariants (INV-12, INV-15) in ARCHITECTURE_REVIEW.md are not contradicted by the bypass protocol definition.

---

# 7. Investigation 7 — Implementation Priority

## Phase A — Must Complete Before Any Coding

These changes block implementation. No code should be written until they are resolved.

| Ref | Change | Blocking Reason |
|:---|:---|:---|
| C1 | Declare application model | The Observation Engine's file system integration and the AI Orchestrator's conversation interface cannot be designed without knowing the application shell. These are Foundation Layer components required in Build Week 1. |
| C5 | Define persistence layer | Engineering Memory and Knowledge Engine cannot be implemented without a storage format. Engineering Memory is a Build Order Step 2 component. |
| C2 | Reconcile Glossary | Implementers will read the Glossary before reading CORE_CONCEPTS.md. Two confirmed definition conflicts will mislead the first developer who opens the repository. Glossary reconciliation is fast (hours) and eliminates a guaranteed confusion source. |

## Phase B — Should Complete Before MVI Implementation

These changes improve implementation quality and prevent costly rework during development.

| Ref | Change | Reason for Phase B |
|:---|:---|:---|
| C4 | Name Recommendation Engine domains | The Recommendation Engine is Build Order Step 10. Its domain names must be defined before implementation begins — but not before Foundation Layer work starts. |
| C7 | Define emergency bypass protocol | The Project Health Engine is Build Order Step 5. The bypass protocol must be defined before the health engine is implemented, to prevent INV-12 violations from being baked in. |
| C8 | Map MVI activation states | Teams building Foundation and Intelligence layers need to know which subsystems are user-facing in v0.1, to calibrate scope. Should be resolved before any subsystem reaches user-facing completion. |
| C3 | Declare Design Intelligence scope | Product clarity. Prevents a team member from reading 07_Product_Features.md and beginning Design Intelligence work. Should be resolved before the product team briefs the engineering team. |

## Phase C — Can Wait Until Post-MVI

These are documentation improvements that do not affect implementation quality.

| Ref | Change | Reason for Phase C |
|:---|:---|:---|
| C6 | Trace Engineering GPS to problem IDs | This is a documentation traceability note. It does not affect implementation. It improves auditability and prevents future drift but has zero impact on the v0.1 build. |

---

# 8. Investigation 8 — Editing Order

The following sequence minimizes cascading edits by ensuring foundational definitions are established before documents that depend on them are modified.

**Rationale for each step:**

```
Step 1: 10_Glossary.md
        ↓
        (Establishes shared vocabulary that all subsequent documents reference)

Step 2: development/IMPLEMENTATION_ROADMAP.md
        ↓
        (C1: Application model, C5: Persistence layer, C8: MVI activation states)
        (These three decisions are foundational and independent of each other)
        (Grouping them in one document edit reduces total edit count)

Step 3: development/RECOMMENDATION_ENGINE.md
        ↓
        (C4: Domain naming — depends on glossary being correct first)

Step 4: development/PROJECT_HEALTH_ENGINE.md
        ↓
        (C7: Emergency bypass protocol — depends on domain naming being established)

Step 5: development/AI_ORCHESTRATION.md
        ↓
        (C7 ripple: Acknowledge emergency input channel — depends on bypass being defined)

Step 6: development/ENGINEERING_GPS.md
        ↓
        (C6: Problem ID tracing — independent; ordered last among specs for least disruption)

Step 7: development/PRODUCT_BLUEPRINT.md
        ↓
        (C3: Design Intelligence post-v0.1 declaration — product-level document)

Step 8: 07_Product_Features.md
        ↓
        (C3 ripple: Add architectural status note to Design Intelligence section)

Step 9: 08_MVP_Roadmap.md
        ↓
        (C3 ripple: Add Design Intelligence to Out of Scope list)

Step 10: Post-change verification pass
         ↓
         (Verify C4 ripple: KNOWLEDGE_ENGINE.md and SYSTEM_ARCHITECTURE.md consistency)
         (Verify C5 ripple: ENGINEERING_MEMORY.md and CONTEXT_INTELLIGENCE.md consistency)
         (Verify C7 ripple: WORKSPACE_BEHAVIOR.md consistency)
         (No edits expected — verification only)
```

**Documents NOT requiring edits:**
The following documents were reviewed and require no modifications:

| Document | Reason No Change Required |
|:---|:---|
| `01_Project_Vision.md` | Correct and authoritative. No conflicts identified. |
| `02_Product_Principles.md` | All 12 principles reflected correctly in architecture. |
| `03_Research_Log.md` | Research log is archival. No changes appropriate. |
| `04_Master_Problem_Database/*` | Problem database is the source of truth for validated problems. No changes needed. |
| `05_Solution_Knowledge_Base.md` | Structural template; no content conflicts identified. |
| `06_Playbooks.md` | Playbooks align to Workflow Engine capability. No changes needed. |
| `09_Competitor_Research.md` | Context document; no conflicts. |
| `README.md` | High-level vision document. Design Intelligence deferral (C3) does not contradict the README's long-term vision. |
| `development/CORE_CONCEPTS.md` | Authoritative source for all concept definitions. No changes. |
| `development/SYSTEM_ARCHITECTURE.md` | Verify consistency after C4; no edits expected. |
| `development/WORKSPACE_BEHAVIOR.md` | Verify consistency after C7; no edits expected. |
| `development/OBSERVATION_ENGINE.md` | Verify after C1 is decided; no edits until then. |
| `development/INTENT_ENGINE.md` | No conflicts identified. No changes. |
| `development/CONTEXT_INTELLIGENCE.md` | Verify after C5 is decided; no edits until then. |
| `development/ENGINEERING_MEMORY.md` | Verify after C5 is decided; no edits until then. |
| `development/KNOWLEDGE_ENGINE.md` | Verify after C4 is done; minor addition may be needed. |
| `development/PROJECT_INTELLIGENCE.md` | No conflicts identified. No changes. |
| `development/WORKFLOW_ENGINE.md` | No conflicts identified. No changes. |
| `development/REASONING_ENGINE.md` | Conceptual model document. No changes. |
| `development/DOMAIN_MODEL.md` | Domain model; no conflicts. No changes. |
| `development/ARCHITECTURE_REVIEW.md` | Contains Implementation Invariants. Already correct. No changes. |
| `development/ARCHITECTURAL_TRACEABILITY_AUDIT.md` | This document is the source. No changes. |

---

# 9. Investigation 9 — Change Summary

## Volume Summary

| Category | Count |
|:---|:---|
| Documents requiring edits | 9 |
| Documents requiring verification only | 7 |
| Documents requiring no action | 19 |
| Total documents reviewed | 35 |

## Change Type Summary

| Change Type | Count | Documents |
|:---|:---|:---|
| Architectural Decision Record | 2 | IMPLEMENTATION_ROADMAP.md (C1, C5) |
| Terminology Updates | 8 | 10_Glossary.md (C2 — 8 entries) |
| Scope Clarifications | 4 | PRODUCT_BLUEPRINT.md, 07_Product_Features.md, 08_MVP_Roadmap.md, IMPLEMENTATION_ROADMAP.md (C3) |
| Specification Enhancements | 3 | RECOMMENDATION_ENGINE.md (C4), PROJECT_HEALTH_ENGINE.md (C7), IMPLEMENTATION_ROADMAP.md (C8) |
| Responsibility Clarifications | 1 | ENGINEERING_GPS.md (C6) |
| Behavioral Specifications | 2 | PROJECT_HEALTH_ENGINE.md, AI_ORCHESTRATION.md (C7 + ripple) |
| Rejected / No-Change Recommendations | 0 | All 8 audit recommendations validated |

## Phase Summary

| Phase | Changes | Blocking? |
|:---|:---|:---|
| Phase A (Before Any Coding) | C1, C2, C5 | ✅ Yes — blocks Foundation Layer implementation |
| Phase B (Before MVI Implementation) | C3, C4, C7, C8 | ✅ Yes — blocks Intelligence Layer implementation |
| Phase C (Post-MVI) | C6 | ❌ No — documentation improvement only |

## Estimated Document Edit Effort

| Document | Complexity | Notes |
|:---|:---|:---|
| `10_Glossary.md` | Low | 8 new/updated entries; each is 3–5 lines |
| `development/IMPLEMENTATION_ROADMAP.md` | Medium | 3 new sections (C1, C5, C8); each is 10–20 lines |
| `development/RECOMMENDATION_ENGINE.md` | Medium | New domain section; approximately 30–40 lines |
| `development/PROJECT_HEALTH_ENGINE.md` | Medium | New escalation protocol section; approximately 25–35 lines |
| `development/AI_ORCHESTRATION.md` | Low | 1 paragraph addition; 5–8 lines |
| `development/ENGINEERING_GPS.md` | Very Low | 3–4 lines of cross-reference |
| `development/PRODUCT_BLUEPRINT.md` | Low | 1 paragraph in Pillars section; 5–8 lines |
| `07_Product_Features.md` | Very Low | 1 sentence per Design Intelligence section; 2–3 lines |
| `08_MVP_Roadmap.md` | Very Low | 1 line addition to Out of Scope list |

---

# 10. Investigation 10 — Final Approval Assessment

## Will the repository become internally consistent?

**Yes — with one conditional.**

After all Phase A and Phase B changes are implemented, every document in the repository will be mutually consistent. The two terminology conflicts (Context, Project Memory) will be resolved. The two undefined critical terms (Trust, Reasoning) will be defined. The scope ambiguity around Design Intelligence will be resolved. The Recommendation Engine's multi-domain synthesis responsibility will be explicitly specified.

**Conditional:** Consistency depends on the correctness of the C1 (application model) and C5 (persistence layer) decisions. If either decision is made incorrectly, downstream specification mismatches may emerge. The decisions themselves require architectural judgment — not just documentation.

## Will every product capability have an architectural home?

**Yes.**

After the changes:
- Security → Recommendation Engine (security domain) + Project Health Engine (security dimension)
- Design Intelligence → Recommendation Engine (design domain — post-v0.1, declared)
- Documentation Generation → Workflow Engine playbooks + Knowledge Engine patterns
- Deployment Guidance → Project Health Engine (readiness) + Recommendation Engine (hosting domain)
- Cost Optimization → Recommendation Engine (cost domain — explicitly named)
- Tool Selection → Knowledge Engine (patterns) + Recommendation Engine (evaluation)

No product capability will remain architecturally orphaned.

## Will every architectural responsibility have a product justification?

**Yes.**

- Engineering GPS → justified by P-001, P-003, P-006 (after C6 is implemented)
- Trust / Interrupt Budget → justified by behavioral calibration requirement in validated behavioral model
- Reasoning Engine (as framework) → justified by cognitive coherence requirement
- Signal → justified by the need for a clean separation between raw observation and interpreted direction
- Focus → justified by the need to define the developer's current singular attention point

## Will every implementation document remain aligned?

**Yes — with the verification pass after each edit.**

The ripple analysis (Investigation 3) identified 7 documents requiring consistency verification after specific changes. None of those verifications are expected to require edits. The verification pass is a safety check, not an editing exercise.

## Will any ambiguity remain before implementation?

**Yes — two bounded ambiguities will remain.**

1. **Application model (C1)**: Until the product team makes this decision, the exact integration model between the Observation Engine and the file system remains implementation-undefined. This is appropriately deferred to a product decision, not an architectural one.

2. **Learning mode capability**: Principle P10 (Education Through Practice) is only partially served by the current architecture. The Recommendation Engine exposes reasoning; a dedicated "learning mode" or tutorial flow is not specified. This is a product UX concern, not an architectural gap. It does not block implementation.

## Are additional architecture documents required?

**No.**

All required information can be added to existing documents. No new specification documents are needed. The changes are additions and clarifications, not architectural expansions.

## Is the repository ready to be frozen for implementation?

**Yes — after Phase A changes (C1, C2, C5) are completed.**

The Foundation Layer (Observation Engine, Engineering Memory, Workspace Core) can begin after Phase A is resolved.

The Intelligence Layer (Project Intelligence, Project Health Engine, Intent Engine, Knowledge Engine, Engineering GPS) can begin after Phase B is resolved.

The Orchestration Layer (Recommendation Engine, Workflow Engine, AI Orchestrator) requires Phase B to be complete.

**Implementation freeze sequence:**

| Freeze Point | Prerequisites | Unblocks |
|:---|:---|:---|
| Foundation Layer Freeze | C1, C2, C5 complete | Observation Engine, Engineering Memory, Workspace Core implementation |
| Intelligence Layer Freeze | Phase B complete (C3, C4, C7, C8) | Project Intelligence, Project Health Engine, Intent Engine, Knowledge Engine, Engineering GPS implementation |
| Orchestration Layer Freeze | Intelligence Layer Freeze + validation | Recommendation Engine, Workflow Engine, AI Orchestrator implementation |

---

# Approval Checklist

Before authorizing any documentation edits, confirm:

- [ ] **C1 Decision**: Has the application model been decided by a Principal Architect or CTO?
- [ ] **C5 Decision**: Has the persistence layer format been decided?
- [ ] **Glossary author**: Has a single author been assigned to execute all 8 Glossary changes from CORE_CONCEPTS.md as the source of truth?
- [ ] **Edit sequence**: Will changes be applied in the order defined in Investigation 8?
- [ ] **Verification pass**: Will a consistency check be performed after each edit as specified in Investigation 6?
- [ ] **No additional engines**: Confirmed that no new subsystems will be introduced during documentation changes?
- [ ] **Invariants**: Are the 17 Architectural Invariants in ARCHITECTURE_REVIEW.md understood and accepted by the implementation team?

---

**Signed:** Principal Software Architect  
**Date:** July 2026  
**Status:** Pending Approval — Ready for Review
