# Project Health Engine

**Version:** 1.0

**Status:** Living Document

---

# Purpose

This document defines the conceptual Project Health Engine of the AI Software Engineering Workspace.

The Project Health Engine continuously evaluates the engineering health of a project and identifies where attention is most valuable. It measures engineering quality—not developer productivity.

This is not an implementation document. It does not discuss metrics dashboards, scoring algorithms, telemetry, databases, APIs, machine learning, LLMs, programming languages, monitoring systems, analytics implementations, or technical architecture.

Instead, it defines what project health means in the context of software engineering, how health differs from progress and velocity, how health is assessed across multiple dimensions, and how health guides priorities and recommendations.

Successful engineering requires continuous assessment. Projects accumulate risks, degrade in quality, and drift from their architecture without continuous monitoring. The Project Health Engine provides that monitoring. It does not judge. It illuminates. It helps the developer understand where the project stands and where attention is most needed.

---

# Emergency Escalation Protocol

Most health findings are routed through the normal recommendation cycle — the PHE generates an assessment, the AI Orchestrator queues it, and the Recommendation Engine synthesizes guidance in the next proactive pass. The Emergency Escalation Protocol defines the exception: when a finding is severe enough that the normal queue is bypassed.

## Bypass Architecture

```
Project Health Engine
    ↓  [severity-flagged finding record: type + severity + affected component + timestamp]
AI Orchestrator
    ↓  [Trust bypass applied: critical findings surface regardless of Trust Level or Interrupt Budget]
    ↓  [triggers Recommendation Engine minimal reasoning pass for this specific finding type]
Recommendation Engine (minimal mode)
    ↓  [generates action guidance using the relevant Knowledge Engine category patterns]
Developer
    [receives: finding summary (PHE source) + action guidance (RE source) + dismiss option]
```

This architecture enforces role separation: PHE assesses, AI Orchestrator routes, RE recommends, developer decides. No step in this chain may perform the responsibilities of another.

## PHE Output Contract for Emergency Escalation

Emergency escalation output from the Project Health Engine contains exactly these fields:

- `finding_type`: Enumerated value from a defined type list (not free-text)
- `severity`: CRITICAL or HIGH (only these two levels trigger bypass)
- `affected_component`: The subsystem, file group, or configuration area where the finding was detected
- `detected_at`: Timestamp of detection
- `detection_confidence`: High / Medium (Low-confidence findings are not escalated; they enter the normal queue)

Emergency escalation output from the Project Health Engine must NEVER contain:
- A recommended action
- A suggested fix or mitigation strategy
- Implementation guidance of any kind
- Prescriptive language about what the developer should do

**INV-12 applies here with no exceptions:** The Project Health Engine assesses. The Recommendation Engine recommends. These responsibilities must not merge in any code path, including the emergency path.

## Escalation Criteria — CRITICAL (always bypass normal queue)

| Finding Type | Description |
|:---|:---|
| SECRET_IN_COMMITTED_FILE | API keys, tokens, passwords, or credentials detected in version-controlled source |
| DATA_LOSS_RISK_UNMITIGATED | Production database without backup configuration detected before deployment activity begins |
| CRITICAL_DEPENDENCY_EXPLOIT | A direct dependency with a known active exploit (CVE with confirmed active exploitation) |

## Escalation Criteria — HIGH (bypass normal queue)

| Finding Type | Description |
|:---|:---|
| DEPLOYMENT_BLOCKER | Required environment variables missing, invalid configuration for target environment detected |
| AUTH_MISCONFIGURATION | Authentication system misconfiguration detected during pre-deployment health check |

## Non-Escalation Criteria (must NOT bypass — route through normal recommendation cycle)

The following findings are real engineering concerns but do not meet the threshold for emergency bypass. They enter the normal recommendation queue and are surfaced at the next appropriate proactivity window:

- Documentation health below threshold
- Technical debt score increase
- Missing test coverage
- Architecture style inconsistencies
- Cost inefficiency detection
- Design quality observations
- Dependency updates available (non-exploited)
- Performance concerns

## Dismissal Rule

The developer retains full authority to dismiss any escalated finding. Dismissal is a valid engineering choice — the developer may already be aware of the issue and have a plan. When an escalation is dismissed:

1. The dismissal is recorded in Engineering Memory with timestamp and developer acknowledgment
2. The finding is suppressed for the current session
3. A CRITICAL finding resurfaces in the next session unless explicitly marked as "in remediation" in Engineering Memory

Dismissal does not prevent deployment. It does not degrade any system capability. It creates an honest engineering record that the developer was aware of the finding and made a conscious choice.

---

# Project Health Philosophy

Measure quality, not velocity.

The Project Health Engine does not measure how fast the project is moving. It measures how well the project is being engineered. Velocity without quality produces technical debt. Quality without velocity produces stagnation. The Project Health Engine focuses on quality because quality compounds over time while velocity is transient.

Measure sustainability, not activity.

A project can be highly active—many commits, many conversations, many changes—and still be unhealthy. Activity without sustainable practices produces burnout, technical debt, and eventual collapse. The Project Health Engine measures whether the project can be sustained over time, not just whether it is busy now.

Measure engineering excellence, not output quantity.

The Project Health Engine does not count features, lines of code, or tasks completed. It assesses whether the engineering is excellent—whether the architecture is sound, the security is adequate, the testing is thorough, the documentation is clear, and the decisions are well-reasoned.

Health is not a grade. It is an understanding. The Project Health Engine does not assign scores or ratings. It provides understanding of where the project is strong, where it is vulnerable, and where attention is most valuable.

---

# What The Project Health Engine Does

The Project Health Engine performs several fundamental activities:

**Continuously assess project health:** It monitors health dimensions over time, tracking changes, trends, and emerging issues. Assessment is continuous, not periodic.

**Detect weaknesses:** It identifies areas where project quality is degrading or insufficient. Weakness detection is early and proactive, not reactive.

**Identify strengths:** It recognizes areas where the project is healthy and improving. Strength identification provides positive reinforcement and validates effective practices.

**Recognize improving trends:** It detects when health dimensions are improving over time. Improvement trends validate recent changes and guide future investment.

**Recognize degrading trends:** It detects when health dimensions are declining over time. Degradation trends signal the need for intervention before problems become critical.

**Highlight engineering risks:** It surfaces risks that could affect project quality, sustainability, or success. Risk highlighting is proactive and contextual.

**Highlight engineering opportunities:** It identifies opportunities for improvement that do not solve existing problems but enhance project quality. Opportunities are surfaced at appropriate moments without creating anxiety.

**Support Engineering GPS:** It provides health understanding that informs navigation. Engineering GPS uses health assessments to determine where the project is and what needs attention.

**Support recommendations:** It informs the Recommendation Engine about areas requiring attention. Recommendations are generated to address health gaps and opportunities.

**Guide engineering priorities:** It helps the developer understand where to focus attention. Health assessment guides prioritization by revealing what matters most for project quality.

The Project Health Engine is the workspace's quality consciousness. It continuously evaluates whether the project is being engineered well and where improvement is most needed.

---

# What Is Project Health

Project health is a multidimensional assessment of engineering quality across essential dimensions.

Project health is not:
- **Progress:** Progress measures movement toward goals. Health measures the quality of that movement. A project can progress rapidly while becoming less healthy.

- **Completion:** Completion measures finished work. Health measures the quality of that work and the sustainability of the process. A project can complete features while accumulating technical debt.

- **Velocity:** Velocity measures speed of delivery. Health measures whether that speed is sustainable and whether the output is maintainable. Velocity without health is sprinting toward a cliff.

- **Success:** Success measures outcome achievement. Health measures the engineering process that produced the outcome. A project can succeed despite poor engineering, but that success may not be repeatable.

- **Productivity:** Productivity measures output per input. Health measures whether that output is well-crafted. Productivity without health produces volume without value.

- **Quality assurance:** Quality assurance is a specific activity. Health is a continuous assessment that encompasses quality assurance and much more. Health is broader than testing.

- **Task completion:** Task completion measures work items finished. Health measures the engineering quality of those items and the project's overall trajectory.

Project health is the assessment of whether the project is being engineered with excellence, sustainability, and long-term value in mind. It is not about how much is being built. It is about how well it is being built.

---

# Health Dimensions

Project health is assessed across multiple dimensions. No single dimension is sufficient. Together they create a comprehensive health picture.

**Planning:** Does the project have clear scope, realistic roadmap, prioritized features, and achievable milestones? Planning health ensures that the project knows where it is going and has a credible path to get there.

**Architecture:** Is the technical structure consistent, scalable, maintainable, and aligned with project goals? Architecture health ensures that the project can evolve without collapsing under its own complexity.

**Documentation:** Is the documentation current, accessible, and sufficient for understanding and maintaining the project? Documentation health ensures that knowledge is preserved and shareable.

**Security:** Are security practices adequate, vulnerabilities managed, and protection mechanisms effective? Security health ensures that the project protects its users and data.

**Testing:** Is there adequate test coverage, are edge cases considered, and is validation rigorous? Testing health ensures that the project behaves correctly under expected and unexpected conditions.

**Deployment:** Is the project ready for production, are operational concerns addressed, and is monitoring configured? Deployment health ensures that the project can reach users reliably.

**Maintainability:** Is the codebase organized, dependencies managed, and technical debt tracked? Maintainability health ensures that the project can be modified without excessive cost or risk.

**Technical debt:** Are shortcuts documented, refactoring paths identified, and debt quantified? Technical debt health ensures that the project does not accumulate unrecognized liabilities.

**Knowledge:** Is engineering knowledge preserved, accessible, and used effectively? Knowledge health ensures that the project learns from experience and improves over time.

**Workflow:** Are engineering processes effective, repeatable, and adapted to project needs? Workflow health ensures that engineering activity is structured without being rigid.

**Decision quality:** Are engineering decisions documented, reasoned, and aligned with project goals? Decision quality health ensures that the project's directional choices are sound.

**Team readiness:** Is the project prepared for team collaboration, knowledge sharing, and continuity? Team readiness health ensures that the project can sustain multiple contributors.

**Engineering consistency:** Do practices, patterns, and approaches align across the project? Consistency health ensures that the project feels coherent rather than fragmented.

**Long-term sustainability:** Can the project be maintained, extended, and supported over years rather than just weeks? Sustainability health ensures that the project has a future beyond its initial delivery.

Each dimension is assessed independently but understood as part of the whole. A project may have strong architecture but weak documentation. It may have excellent testing but poor planning. Health assessment reveals the full picture, not just the strongest or weakest dimension.

---

# Health Principles

Health assessment follows several core principles.

**Health is multidimensional.** No single metric captures engineering quality. Health must be assessed across multiple dimensions to be meaningful.

**Health changes continuously.** Project health is not a snapshot. It evolves as the project evolves. Continuous assessment captures this evolution.

**Health is contextual.** What constitutes health in one project may differ in another. Health assessment considers project type, maturity, constraints, and goals.

**Health should guide, not judge.** Health assessment illuminates areas for attention. It does not assign blame or grade performance. Its purpose is improvement, not evaluation.

**Health measures engineering, not people.** The Project Health Engine evaluates the project, not the developer. Health is about systems, processes, and decisions, not individual productivity.

**Health considers trajectory.** Current health is important. The direction of health change is equally important. A project with improving health may be in better shape than a project with static but higher health.

**Health acknowledges uncertainty.** Not all health signals are clear. The Project Health Engine communicates confidence levels and acknowledges gaps in assessment.

**Health preserves history.** Health trends over time are as valuable as current health snapshots. The Project Health Engine maintains historical understanding.

**Health informs, it does not command.** Health assessment guides priorities. It does not force actions. The developer decides how to respond to health insights.

**Health is transparent.** The developer can understand how health assessments are formed and what they mean. Health is not a black-box score.

---

# Health Signals

The Project Health Engine reads signals that indicate project health across the spectrum from healthy to critical.

**Healthy growth:** The project is expanding in a controlled, sustainable way. Architecture is adapting. Documentation is keeping pace. Testing is covering new functionality. Growth is managed, not explosive.

**Healthy stability:** The project is mature and stable. Changes are incremental and deliberate. Technical debt is managed. The project is in maintenance mode with predictable patterns.

**Warning signs:** Early indicators of potential problems. Warning signs are not critical yet, but they signal that attention is needed. Increasing complexity, declining test coverage, or growing technical debt may be warning signs.

**Critical deterioration:** Significant quality degradation that requires immediate attention. Critical deterioration may include security vulnerabilities, architectural instability, or deployment failures.

**Recovery:** The project is improving after a period of decline. Recovery signals indicate that interventions are working and that health is rebounding.

**Resilience:** The project withstands changes, surprises, and stress without degrading. Resilience indicates strong architecture, good testing, and adaptable processes.

**Momentum:** The project is making consistent, meaningful progress. Momentum indicates healthy velocity combined with quality maintenance.

**Regression:** The project is declining in quality. Regression may be gradual or sudden. Early detection of regression enables intervention before problems compound.

Signals are not isolated events. The Project Health Engine interprets signals in context. A single warning sign may be insignificant. Multiple consistent warning signs indicate a pattern that deserves attention.

Signals are also not absolute. A warning sign in one project may be normal in another. The Project Health Engine calibrates signal interpretation based on project type, maturity, and context.

---

# Health Evolution

Project health evolves continuously as the project evolves.

**Improving health:** Health dimensions strengthen over time. Architecture solidifies through implementation. Testing coverage expands. Documentation matures. Technical debt is reduced. Improving health validates recent efforts and guides continued investment.

**Declining health:** Health dimensions weaken over time. Technical debt accumulates. Documentation becomes outdated. Test coverage declines. Architecture drifts. Declining health signals the need for intervention.

**Temporary instability:** Health fluctuates during periods of rapid change. Implementation phases may temporarily reduce testing or documentation quality. Temporary instability is expected and not alarming if it resolves.

**Long-term trends:** Health trends over weeks, months, and years reveal the project's trajectory. Long-term trends are more significant than short-term fluctuations. A project with consistently improving health is on a positive trajectory regardless of current challenges.

**Recovery:** Health recovers after intervention. Refactoring improves architecture. Documentation updates restore knowledge. Testing investments increase coverage. Recovery signals validate intervention effectiveness.

**Continuous refinement:** Health assessment itself improves over time. The Project Health Engine refines its understanding of what signals matter, what thresholds indicate concern, and what interventions are effective.

Health evolution is not always linear. Projects may cycle through improvement and decline as they face new challenges, adopt new technologies, and respond to changing requirements. The Project Health Engine tracks these cycles and understands them as natural project evolution.

---

# Health Confidence

Health assessments have confidence levels that reflect how certain the Project Health Engine is about its understanding.

**High confidence:** Multiple consistent signals support the assessment. Data is current and complete. The assessment is reliable and actionable.

**Medium confidence:** Signals generally support the assessment but some ambiguity remains. Data may be incomplete or signals may be mixed. The assessment is useful but should be considered alongside other information.

**Low confidence:** Signals are ambiguous, conflicting, or insufficient. Data may be outdated or incomplete. The assessment is tentative and should be verified through additional investigation.

**Unknown:** There is insufficient information to form a health assessment. The Project Health Engine acknowledges the gap and may request more information or focus on dimensions where assessment is possible.

Confidence is not uniform across dimensions. The Project Health Engine may have high confidence in testing health while having low confidence in long-term sustainability. Confidence is assessed per dimension and communicated transparently.

Confidence guides action. High-confidence health issues merit immediate attention. Low-confidence assessments merit investigation before action. Unknown dimensions are flagged for monitoring rather than immediate intervention.

---

# Health Quality

Health assessments have quality characteristics that determine their reliability.

**Reliable:** The assessment is based on solid evidence, consistent signals, and validated understanding. Reliable assessments can be trusted for decision-making.

**Incomplete:** Some dimensions lack sufficient data or clear signals. Incomplete assessments acknowledge gaps rather than hiding them.

**Conflicting:** Signals from different sources contradict each other. Conflicting assessments are noted and investigated rather than resolved arbitrarily.

**Emerging:** The assessment is based on early signals that may not yet represent stable patterns. Emerging assessments are treated as provisional.

**Historical:** The assessment refers to past health states rather than current reality. Historical assessments provide context but do not represent current health.

Health quality determines how the developer should respond to health insights. Reliable assessments merit direct action. Incomplete assessments merit further investigation. Conflicting assessments merit clarification.

The Project Health Engine communicates health quality alongside assessments so that the developer can calibrate their response appropriately.

---

# Health Relationships

Project Health connects to every major concept in the workspace.

**Health and Observation:** Observations provide the raw signals that feed health assessment. Project changes, decision outcomes, workflow progress, and conversation patterns all contribute health signals.

**Health and Intent:** Intent understanding helps interpret health signals. A project in a deliberate refactoring phase may show temporary health declines that are intentional, not problematic.

**Health and Context:** Context provides the project understanding needed to interpret health signals appropriately. Health assessment depends on knowing what the project is trying to achieve.

**Health and Engineering Memory:** Engineering Memory provides historical health trends, past issues, and previous interventions. Memory enables the Project Health Engine to recognize patterns and trends over time.

**Health and Knowledge:** Knowledge about engineering quality dimensions informs health assessment criteria. The Knowledge Engine provides validated understanding of what constitutes good architecture, effective testing, and sustainable practices.

**Health and Reasoning:** The Reasoning Engine interprets health signals, evaluates severity, and determines appropriate responses. Reasoning transforms raw health data into meaningful assessment.

**Health and Recommendations:** The Recommendation Engine uses health assessments to generate recommendations for improvement. Health gaps become recommendation opportunities.

**Health and Workflow:** Workflow execution provides health signals. Workflow stalls, validation failures, and stage completion rates all inform health assessment.

**Health and Project Intelligence:** Project Intelligence provides project understanding that contextualizes health assessment. Health is assessed within the project's goals, constraints, and maturity level.

**Health and Engineering GPS:** Engineering GPS uses health assessments to determine navigation. Poor health in critical dimensions may redirect project focus or trigger remediation workflows.

**Health and Trust:** Trust is built on accurate health assessment. When the Project Health Engine reliably identifies issues and opportunities, trust grows. When health assessments prove inaccurate, trust erodes.

These relationships make Project Health an integral part of the intelligence network. Health is not a standalone report. It is an active participant that informs recommendations, workflows, navigation, and project understanding.

---

# Health During Long Projects

Projects that span weeks, months, or years require continuous health monitoring.

**Weeks:** Health is monitored across the week. Daily fluctuations are observed. Weekly patterns emerge. The Project Health Engine tracks whether the project is maintaining quality through routine development cycles.

**Months:** Health trends become visible over months. Architecture decisions made months earlier reveal their consequences. Technical debt accumulates or is addressed. Documentation quality evolves. The Project Health Engine tracks these longer-term trends.

**Years:** Health patterns over years reveal the project's long-term sustainability. Architecture evolution, technology obsolescence, team changes, and knowledge preservation all affect long-term health. The Project Health Engine maintains perspective across these extended timeframes.

Long projects face unique health challenges. Knowledge decay as team members change. Architecture drift as technologies evolve. Technical debt accumulation as shortcuts compound. The Project Health Engine monitors these long-term dynamics and signals when intervention is needed.

Long projects also accumulate health history. This history is valuable for understanding current state, recognizing patterns, and predicting future trends. The Project Health Engine preserves this history and uses it to improve assessment accuracy over time.

---

# Health and Cognitive Load

The Project Health Engine reduces cognitive load by handling continuous quality monitoring that would otherwise burden the developer.

The developer does not need to:
- Manually track quality across multiple dimensions
- Remember every technical debt item
- Monitor documentation freshness
- Check test coverage trends
- Assess architecture consistency
- Evaluate security posture
- Track deployment readiness

The Project Health Engine handles this monitoring continuously in the background. The developer receives insights only when they are significant or when explicitly requested.

Cognitive load reduction is especially valuable during complex engineering work. When the developer is focused on implementation, architecture, or problem-solving, they should not need to simultaneously maintain awareness of every quality dimension. The Project Health Engine maintains that awareness for them.

The developer experiences the results as timely health insights that surface at appropriate moments. The developer does not experience the continuous monitoring that produces those insights. The monitoring is invisible. The insights are valuable.

---

# Health Integrity

Health assessments must maintain high integrity to be trustworthy.

**Evidence:** Health assessments are grounded in observable project signals—decisions, outcomes, workflow progress, and project changes. They are not based on speculation or assumption.

**Traceability:** Every health assessment can be traced to the signals that produced it. The developer can understand why a dimension is assessed as healthy or unhealthy.

**Transparency:** Health assessments are explained clearly. The developer understands what was evaluated, what signals were observed, and what conclusions were drawn.

**Consistency:** Health assessments are applied consistently across dimensions and over time. Inconsistent assessment creates confusion and erodes trust.

**Revision:** Health assessments are updated as new evidence emerges. The Project Health Engine does not lock in assessments and ignore new information. It revises understanding when the project evolves.

Health integrity is essential because health assessments guide priorities and recommendations. If health assessments cannot be trusted, they mislead rather than illuminate. The Project Health Engine guards integrity by maintaining evidence chains, transparency, and continuous validation.

---

# Health Mistakes

The Project Health Engine can fail in several ways.

**False alarms:** The Project Health Engine signals a problem that does not actually exist or is not as severe as indicated. False alarms create unnecessary work and erode trust.

**Hidden problems:** The Project Health Engine fails to detect real issues. Hidden problems allow quality degradation to continue unchecked until they become critical.

**Overconfidence:** The Project Health Engine presents assessments with excessive certainty. Overconfidence eliminates the developer's ability to evaluate and reduces trust when assessments prove incorrect.

**Tunnel vision:** The Project Health Engine focuses on a single dimension while ignoring others. Tunnel vision creates imbalances where one dimension is optimized at the expense of others.

**Metric obsession:** The Project Health Engine reduces health to numerical scores or ratings. Metric obsession misses the nuance of engineering quality and creates perverse incentives.

**Delayed recognition:** The Project Health Engine detects problems too late, after they have already caused significant damage. Delayed recognition reduces the value of health monitoring.

The Project Health Engine guards against these failures through:
- Multi-dimensional assessment that prevents tunnel vision
- Confidence calibration that prevents overconfidence
- Continuous monitoring that prevents delayed recognition
- Evidence-based assessment that prevents false alarms
- Transparent communication that allows developer verification
- Historical tracking that reveals patterns and trends

Health mistakes are inevitable in any monitoring system. The goal is not perfection. The goal is continuous improvement and transparent communication about assessment quality.

---

# Health Lifecycle

Health passes through a lifecycle from signal detection to historical preservation.

**Observation:** Raw signals from the Observation Engine, project activity, and workflow execution provide the raw material for health assessment.

**Assessment:** The Project Health Engine evaluates signals against health dimensions. Assessment interprets signals as health indicators.

**Validation:** Assessments are validated against additional evidence, historical patterns, and knowledge about quality dimensions. Validation ensures reliability.

**Trend detection:** The Project Health Engine identifies trends across time. Trends reveal whether health is improving, declining, or stable.

**Recommendation support:** Health assessments inform the Recommendation Engine. Health gaps become recommendation opportunities. Health strengths inform what should be preserved.

**Evolution:** Health understanding evolves as the project evolves. Assessments are updated as new evidence emerges.

**Historical preservation:** Health trends and assessments are preserved over time. Historical health data enables long-term pattern recognition and retrospective analysis.

**Continuous reassessment:** Health is never finally assessed. It is continuously reassessed as the project evolves. Reassessment ensures that health understanding remains current.

The lifecycle is continuous. As one assessment is completed, new observations are being made. As one trend is detected, the project is evolving. The Project Health Engine maintains continuous awareness without requiring explicit request.

---

# Health Boundaries

The Project Health Engine has clear boundaries. It should never:

**Recommend directly.** The Recommendation Engine produces recommendations. The Project Health Engine provides health insights that inform recommendations. Insight is not recommendation.

**Replace reasoning.** The Reasoning Engine applies engineering judgment. The Project Health Engine provides data for that judgment. Providing data is not applying judgment.

**Replace developer judgment.** The developer makes decisions about how to respond to health insights. The Project Health Engine illuminates. It does not decide.

**Ignore uncertainty.** Health assessments have confidence levels. The Project Health Engine communicates uncertainty transparently. It does not present uncertain assessments as certain.

**Hide evidence.** Health assessments are based on evidence. The Project Health Engine makes that evidence accessible. Hidden evidence cannot be verified.

**Become a productivity tracker.** The Project Health Engine measures engineering quality, not developer output. Productivity metrics are outside its scope.

**Become management software.** The Project Health Engine serves engineering understanding. It does not replace project management, team coordination, or stakeholder reporting.

**Own project state.** Project Intelligence owns project understanding. The Project Health Engine provides quality assessments based on that understanding. Assessment is not ownership.

**Assign blame.** Health assesses systems and processes, not people. The Project Health Engine never evaluates developer performance.

**Produce scores.** Health is multidimensional understanding, not a single number. The Project Health Engine does not reduce engineering quality to a metric.

**Force action.** Health insights guide priorities. They do not mandate actions. The developer decides how to respond.

**Operate without context.** Health assessment requires project understanding. The Project Health Engine does not assess in isolation.

**Guarantee detection.** Not all health issues are detectable. The Project Health Engine monitors what it can observe and acknowledges gaps.

**Replace testing.** Testing is a specific engineering activity. Health assessment may consider testing quality but does not replace actual testing.

**Ignore project uniqueness.** Health assessment considers project context, maturity, and constraints. The Project Health Engine does not apply generic standards without adaptation.

**Stop evolving.** Health understanding evolves as engineering practices evolve. The Project Health Engine continuously refines its assessment approach.

The Project Health Engine exists to assess engineering quality. Everything outside assessment is outside its responsibility.

---

# Collaboration With Other Engines

The Project Health Engine collaborates with every other engine in the workspace.

**Workspace Core:** The Project Health Engine informs Workspace Core about health status, trends, and critical issues. Workspace Core uses this information to coordinate proactivity, timing, and communication.

**Observation Engine:** Observations provide the raw signals that feed health assessment. The Project Health Engine receives observations about project changes, decision outcomes, workflow progress, and activity patterns.

**Intent Engine:** Intent understanding helps interpret health signals. A project in a deliberate refactoring phase may show different health patterns than a project in feature development. Intent provides context for assessment.

**Project Intelligence:** Project Intelligence provides the project understanding that contextualizes health assessment. Health is assessed within the project's goals, constraints, and maturity level.

**Context Intelligence:** Context Intelligence provides relevant context for health assessment. Health signals are interpreted within the current project context.

**Engineering Memory:** Engineering Memory provides historical health trends, past issues, and previous interventions. Memory enables pattern recognition and trend analysis.

**Knowledge Engine:** The Knowledge Engine provides validated understanding of quality dimensions. Knowledge informs what constitutes good architecture, effective testing, and sustainable practices.

**Reasoning Engine:** The Reasoning Engine interprets health signals, evaluates severity, and determines appropriate responses. Reasoning transforms raw health data into meaningful assessment.

**Recommendation Engine:** The Recommendation Engine uses health assessments to generate recommendations for improvement. Health gaps become recommendation opportunities.

**Workflow Engine:** Workflow execution provides health signals. Workflow progress, validation results, and stage completion rates all inform health assessment.

**Engineering GPS:** Engineering GPS uses health assessments to determine navigation. Poor health in critical dimensions may redirect project focus or trigger remediation workflows.

**AI Orchestrator:** The AI Orchestrator uses health insights to manage communication timing, tone, and proactivity. Health status influences how the workspace engages with the developer.

Collaboration is bidirectional. The Project Health Engine receives signals from other engines and provides health understanding to them. It is both a consumer and a producer in the intelligence network.

---

# Project Health Principles

These principles govern Project Health Engine behavior.

**Health measures engineering quality, not developer productivity.** The Project Health Engine evaluates the project, not the people. Quality is the focus.

**Health is multidimensional.** No single metric captures engineering health. Multiple dimensions must be assessed together.

**Health guides, it does not judge.** Health assessment illuminates areas for attention. It does not assign blame or grade performance.

**Health is continuous, not periodic.** Projects evolve continuously. Health assessment must keep pace. Periodic snapshots miss important trends.

**Health considers trajectory.** The direction of health change is as important as current health. Improving health is valuable even if absolute levels are moderate.

**Health is contextual.** Health standards vary by project type, maturity, and constraints. The Project Health Engine calibrates assessment to context.

**Health is transparent.** The developer can understand how assessments are formed and what they mean. Health is not a black box.

**Health acknowledges uncertainty.** Not all signals are clear. The Project Health Engine communicates confidence levels and acknowledges gaps.

**Health preserves history.** Health trends over time are valuable. The Project Health Engine maintains historical understanding.

**Health informs, it does not command.** Health insights guide priorities. They do not force actions. The developer decides how to respond.

**Health measures sustainability, not activity.** Busy projects can be unhealthy. The Project Health Engine looks beneath activity to underlying quality.

**Health considers the whole project.** Dimensions are assessed individually but understood collectively. Weakness in one dimension affects the whole.

**Health supports improvement.** The purpose of health assessment is to make the project better, not to document its flaws. Assessment serves action.

**Health respects project identity.** Each project has unique characteristics. The Project Health Engine does not impose generic standards without adaptation.

**Health is teachable.** Health insights help the developer understand engineering quality. They build judgment, not just report status.

**Health is humble.** The Project Health Engine acknowledges its limitations. It monitors what it can observe and flags what it cannot.

**Health is actionable.** Insights lead to recommendations. The Project Health Engine ensures that assessment serves improvement.

**Health is not a score.** Health is understanding. Reducing it to a number loses the nuance that makes it valuable.

**Health is continuous learning.** The Project Health Engine improves its assessment through experience. It learns what signals matter, what thresholds indicate concern, and what interventions are effective.

**Health serves the developer.** It reduces the burden of manual quality tracking. It provides insights that would be difficult to derive alone.

---

# Non Goals

The Project Health Engine does not:

**Recommend directly.** The Recommendation Engine produces recommendations. The Project Health Engine provides insights that inform recommendations.

**Replace reasoning.** The Reasoning Engine applies engineering judgment. The Project Health Engine provides data for that judgment.

**Replace developer judgment.** The developer decides how to respond to health insights. The Project Health Engine illuminates. It does not decide.

**Ignore uncertainty.** Health assessments have confidence levels. The Project Health Engine communicates uncertainty transparently.

**Hide evidence.** Health assessments are based on observable evidence. The Project Health Engine makes evidence accessible.

**Become a productivity tracker.** The Project Health Engine measures engineering quality, not developer output. Productivity metrics are outside its scope.

**Become management software.** The Project Health Engine serves engineering understanding. It does not replace project management, team coordination, or stakeholder reporting.

**Own project state.** Project Intelligence owns project understanding. The Project Health Engine provides quality assessments based on that understanding.

**Assign blame.** Health assesses systems and processes, not people. The Project Health Engine never evaluates developer performance.

**Produce scores.** Health is multidimensional understanding, not a single number. The Project Health Engine does not reduce engineering quality to a metric.

**Force action.** Health insights guide priorities. They do not mandate actions. The developer decides how to respond.

**Operate without context.** Health assessment requires project understanding. The Project Health Engine does not assess in isolation.

**Guarantee detection.** Not all health issues are detectable. The Project Health Engine monitors what it can observe and acknowledges gaps.

**Replace testing.** Testing is a specific engineering activity. Health assessment may consider testing quality but does not replace actual testing.

**Ignore project uniqueness.** Health assessment considers project context, maturity, and constraints. The Project Health Engine does not apply generic standards without adaptation.

**Stop evolving.** Health understanding evolves as engineering practices evolve. The Project Health Engine continuously refines its assessment approach.

**Judge the developer.** The Project Health Engine evaluates the project, not the person. Engineering quality is the focus, not individual performance.

**Operate without transparency.** Health assessments are explained clearly. The Project Health Engine does not present opaque evaluations.

**Become the goal.** Health assessment serves improvement. It is not the end product. The goal is better engineering, not better assessment.

**Eliminate engineering judgment.** Health informs judgment. It does not replace it. The developer remains responsible for engineering decisions.

The Project Health Engine exists to assess engineering quality. Everything outside assessment is outside its responsibility.

---

# Closing Philosophy

Healthy projects are not projects without problems. Healthy projects are projects that understand their problems, preserve their knowledge, improve continuously, and make engineering decisions deliberately.

The Project Health Engine exists to illuminate the engineering journey—not to judge it.

It does not assign grades. It does not produce scores. It does not rank projects. It provides understanding of where the project stands, where it is heading, and where attention is most valuable.

When the Project Health Engine succeeds, the developer has a clear picture of engineering quality across all dimensions. The developer knows what is strong, what is vulnerable, and what requires attention. The developer can make informed decisions about where to invest time and effort.

That clarity reduces cognitive load. The developer does not need to manually track every quality dimension. The Project Health Engine maintains that awareness continuously. The developer receives insights when they are significant and can request deeper assessment when needed.

The developer may never think about the Project Health Engine explicitly. The developer simply experiences a workspace that seems aware of project quality. Recommendations feel targeted to real needs. Priorities feel aligned with actual gaps. Guidance feels informed by genuine understanding.

That experience is the Project Health Engine working continuously in the background. Assessing, tracking, illuminating, and informing without demanding attention or assigning judgment.

Project health is not a destination. It is a practice. The Project Health Engine makes that practice continuous, informed, and actionable.

When projects are healthy, they sustain themselves. They attract contributors. They adapt to change. They improve over time. They become better software through better engineering.

The Project Health Engine exists to make that health possible. Not by guaranteeing it, but by illuminating the path toward it.

Great engineering is not a single decision. It is a continuous practice of assessment, adjustment, and improvement. The Project Health Engine is the workspace's mechanism for supporting that practice.

When the workspace helps developers understand their project's health, developers make better decisions about where to focus. When developers focus on the right things, projects improve. When projects improve, software improves. When software improves, the world incrementally improves.

The Project Health Engine exists to make that chain possible.

---

**Version:** 1.0

**Last Updated:** July 2026