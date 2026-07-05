# Product Principles

**Version:** 1.0

**Status:** Active

---

# Purpose

This document defines the principles that guide every product decision.

Whenever a new feature is proposed, it should be evaluated against these principles.

If a feature violates multiple principles, it should not be included in the product.

---

# Principle 1 — Engineering Over Coding

Our purpose is to improve software engineering, not code generation.

We do not compete with coding models.

We complement them.

If a feature's primary purpose is writing code, it probably does not belong in this product.

Questions we solve:

- What should I build?
- How should I build it?
- Is this the right approach?
- What should I improve next?

Questions we generally do not solve:

- Write this function.
- Build this API.
- Generate this component.

---

# Principle 2 — Solve Validated Problems

Every feature must solve a real developer problem.

Problems should be supported by research, community discussions, personal experimentation, or industry evidence.

We build from evidence, not assumptions.

---

# Principle 3 — Reduce Cognitive Load

The product should reduce the number of decisions a developer must make manually.

Good examples:

- recommending tools
- identifying risks
- organizing knowledge
- prioritizing tasks

Bad examples:

- adding features that create unnecessary complexity

---

# Principle 4 — Remain Valuable as AI Improves

AI models will continue to improve.

Our product should remain useful even if coding models become significantly better.

We avoid building features whose value depends on AI being bad at writing code.

---

# Principle 5 — Be Model Agnostic

Developers use different coding tools.

The product should integrate naturally with multiple AI coding assistants rather than depending on a single provider.

The engineering knowledge should remain portable.

---

# Principle 6 — Explain Recommendations

Recommendations should include reasoning whenever appropriate.

Developers should understand why a recommendation is made rather than blindly accepting it.

The goal is to improve engineering judgment over time.

---

# Principle 7 — Recommend Before Reinventing

Whenever appropriate, recommend existing solutions before encouraging custom implementations.

Examples include:

- authentication
- payments
- analytics
- storage
- email
- monitoring

Building from scratch should generally be the exception.

---

# Principle 8 — Local Context First

Engineering recommendations should consider the actual project context whenever possible.

Examples include:

- existing technology stack
- dependencies
- project goals
- documentation
- roadmap
- previous decisions

Generic advice should be the fallback, not the default.

---

# Principle 9 — Transparency

The system should clearly communicate:

- assumptions
- limitations
- confidence level
- trade-offs

It should avoid presenting uncertain recommendations as facts.

---

# Principle 10 — Education Through Practice

The companion should gradually improve the developer's engineering knowledge.

Whenever practical, recommendations should help users understand software engineering principles instead of simply giving answers.

---

# Principle 11 — Minimize Vendor Lock-In

Developers should remain free to choose their preferred:

- AI model
- editor
- hosting platform
- framework
- cloud provider

The product should encourage flexibility rather than dependence on specific vendors.

---

# Principle 12 — Simplicity Over Feature Count

Adding more features does not necessarily create a better product.

Whenever possible:

- combine related workflows
- reduce unnecessary options
- keep the interface focused

A smaller product that solves important problems well is preferable to a larger product with overlapping functionality.

---

# Feature Evaluation Checklist

Before adding a feature, ask:

- Does it solve a validated problem?
- Does it reduce cognitive load?
- Will it still matter in five years?
- Does it complement AI instead of competing with it?
- Can we clearly explain its value?
- Does it fit our mission?
- Is it simple enough to maintain?

If the answer to multiple questions is "No", the feature should be reconsidered.

---

# Living Document

These principles may evolve as our understanding improves.

However, changes should be rare and deliberate because they influence every product decision.

---

**Version:** 1.0

**Last Updated:** July 2026
