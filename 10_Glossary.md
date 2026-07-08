# Glossary

**Version:** 1.1

**Status:** Living Document

---

# Purpose

This glossary defines important technical terms, abbreviations, and concepts used throughout the project.

The objective is to ensure consistent terminology across documentation, research, implementation, and future AI recommendations.

> **Single-Source Policy:** Entries in this Glossary are concise summaries for quick reference. For authoritative definitions — including design notes, relationships, ownership, and examples — refer to the document listed in each entry's cross-reference. Do not define any architectural concept here in full if it is already defined in `development/CORE_CONCEPTS.md` or an engine specification. Duplication of full definitions creates conflicting sources.

---

# A

## ADR (Architecture Decision Record)

A document that records an important architectural decision, the reasoning behind it, alternatives considered, and the expected consequences.

---

## Agentic Coding

A style of AI-assisted development where an AI agent performs multi-step software engineering tasks autonomously, such as planning, editing files, debugging, and running tests.

---

## AI Coding Assistant

An AI system that primarily generates, edits, or explains code.

Examples include IDE assistants and coding agents.

---

## AI Software Engineering Companion

Our product vision.

A system that helps developers make engineering decisions throughout the software development lifecycle rather than focusing on code generation.

---

# B

## Build vs Buy

The engineering decision of whether to implement a feature internally or use an existing third-party solution.

---

## Burn Rate (Context)

The rate at which an AI model consumes its available context window or token budget during a session.

---

# C

## Context

The minimum relevant information required to make a good engineering decision for a specific situation. Selected and assembled by Context Intelligence — not to be confused with the AI model context window (see: Context Window).

See `development/CORE_CONCEPTS.md` — Context.

---

## Context Compression

The process of reducing project information into a smaller representation while preserving important engineering knowledge.

---

## Context Rot

The gradual decline in AI output quality as long conversations become inconsistent or exceed practical context limits.

---

# D

## Dependency

An external library, framework, SDK, or service required by a project.

---

## Documentation Drift

When documentation no longer matches the current implementation.

---

# E

## Engineering Decision

Any decision affecting software quality, maintainability, security, scalability, or long-term success.

Examples include architecture choices, technology selection, and deployment strategy.

---

## Engineering Debt

Work intentionally or unintentionally postponed that increases future maintenance effort.

Often referred to as Technical Debt.

---

## Engineering GPS

The subsystem that tracks project goals, determines current position in the development lifecycle, and generates navigation recommendations toward completion. Solves validated problems P-001, P-003, and P-006. Guidance only — not task management.

See `development/ENGINEERING_GPS.md` and `development/CORE_CONCEPTS.md` — Engineering GPS.

---

## Engineering Memory

The persistent, append-only archive of all engineering decisions made within a project, including rationale, alternatives considered, and historical context. Supersedes the narrower concept of "Project Memory".

See `development/ENGINEERING_MEMORY.md` and `development/CORE_CONCEPTS.md` — Engineering Memory.

---

# F

## Feature Creep

The continuous addition of new features beyond the original project scope, making the product increasingly difficult to manage.

---

## Free Tier

A limited usage plan provided by a software service at no cost.

---

## Focus

The single engineering concern that deserves the developer's attention right now. Derived from project state and developer intent. Owned by Project Intelligence.

See `development/CORE_CONCEPTS.md` — Focus.

---

# I

## Incremental Development

Building software in small, testable steps instead of attempting large implementations all at once.

---

## Intent

What the developer is actually trying to accomplish in a given moment, regardless of the specific words they use. Derived from observations, signals, and project state. Produced by the Intent Engine.

See `development/CORE_CONCEPTS.md` — Intent.

---

## Interrupt Budget

The maximum number of unsolicited guidance events permitted within a session before the workspace reduces proactivity. Derived from Trust Level. Owned and enforced by the AI Orchestrator.

See `development/CORE_CONCEPTS.md` — Trust Level and `development/WORKSPACE_BEHAVIOR.md`.

---

# L

## Local-First

An approach where software primarily stores and processes data on the user's own device instead of relying entirely on cloud services.

---

# M

## MCP (Model Context Protocol)

A protocol that enables AI models to interact with external tools and services in a structured way.

---

## MVP (Minimum Viable Product)

The smallest version of a product that delivers value and allows validation of core assumptions.

---

# P

## Playbook

A structured workflow describing how to complete a recurring software engineering task.

---

## PRD (Product Requirements Document)

A document describing the objectives, requirements, features, constraints, and success criteria of a product.

---

## Project Memory

*Superseded.* The concept of "Project Memory" (structured knowledge across AI sessions) is fully encompassed by Engineering Memory, which defines the persistent, append-only archive of all engineering decisions, rationale, and history within a project. Use Engineering Memory in all architectural and implementation contexts.

See `development/ENGINEERING_MEMORY.md`.

---

# R

## RAG (Retrieval-Augmented Generation)

A technique where an AI retrieves relevant information from external knowledge sources before generating responses.

---

## Reasoning

The cognitive process by which an intelligence engine evaluates available information and produces a justified conclusion or recommendation — always including evidence, alternatives considered, and confidence level. Performed within each intelligence engine; coordinated but not performed by the AI Orchestrator.

See `development/CORE_CONCEPTS.md` — Reasoning.

---

## Repository Health

A measure of the overall quality of a software repository, including documentation, structure, maintainability, security, and technical debt.

---

## Risk

A potential problem that could negatively affect project quality, timeline, or maintainability. Distinct from an Opportunity. See `development/CORE_CONCEPTS.md` — Risk.

---

# S

## Signal

An interpreted observation that may indicate developer intent or a meaningful project change. Produced by the Intent Engine from raw Observations. Represents interpretation, not certainty.

See `development/CORE_CONCEPTS.md` — Signal.

---

## Scope Creep

The uncontrolled expansion of project requirements after development has already begun.

---

## Software Engineering

The discipline of planning, designing, building, testing, deploying, and maintaining software systems.

---

## State Drift

The gradual inconsistency that develops when different parts of a project evolve independently, often resulting in conflicting implementations.

---

# T

## Trust (Developer Confidence)

Confidence earned by the workspace through consistently accurate, transparent, and explainable guidance. A product outcome that grows over time through positive interactions.

See `development/CORE_CONCEPTS.md` — Trust (Developer Confidence).

---

## Trust Level

A developer-controlled parameter that determines how proactively the workspace surfaces unsolicited guidance (Low / Medium / High). Does not affect recommendation quality — only delivery frequency. Owned and enforced by the AI Orchestrator; stored by Workspace Core.

See `development/CORE_CONCEPTS.md` — Trust Level.

---

## Technical Debt

The long-term cost incurred by choosing quick or suboptimal solutions instead of more maintainable approaches.

---

## Token

The unit used by AI models to process text.

Context windows are measured in tokens.

---

# U

## User Story

A short description of a software feature written from the perspective of an end user.

---

# V

## Vibe Coding

A style of AI-assisted development where developers primarily guide AI systems through natural language rather than manually writing most of the code.

---

## Validation

The process of confirming that a problem, solution, or feature is supported by evidence, testing, or real-world usage.

---

# Living Document

This glossary should expand as the project grows.

New terms should be added whenever they appear repeatedly in research or implementation discussions.

Definitions should remain concise, technically accurate, and vendor-neutral.

---

**Version:** 1.1

**Last Updated:** July 2026
