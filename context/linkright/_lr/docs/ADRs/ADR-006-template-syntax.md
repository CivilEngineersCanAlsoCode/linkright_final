# ADR-006: Jinja2 Template Syntax ({{VAR}})

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright's step files and artifacts use variables that need to be dynamically populated by agents. Initial implementations used shell-style `${VAR}` syntax, which conflicts with environment variable expansion in scripts and lacks the power of modern template engines.

## Decision
Standardize on **Jinja2-style double-brace syntax (`{{VAR}}`)** for all template variables in Linkright step files, configurations, and artifact templates.

## Rationale
- **Compatibility**: Widely recognized by template engines across multiple programming languages.
- **Isolation**: Prevents accidental expansion by shell scripts or CI/CD pipelines during transport.
- **Extensibility**: Supports advanced features like filters, loops, and conditionals if needed in the future.
- **Clarity**: Distinctive visual signature makes variables easy to find via grep or regex.

## Consequences
- Requires a bulk migration of all existing `${VAR}` and `$VAR` instances.
- Documentation and style guides must be updated to reflect the new standard.
- Custom template loaders must be updated to support the double-brace syntax.

## Alternatives Considered
- **Shell-style (`${VAR}`)**: Too prone to accidental expansion and conflicts.
- **Angle-bracket (`<VAR>`)**: Harder to distinguish from HTML/XML tags.
- **Custom placeholders (`[VAR]`)**: Lacks existing library support and standardized parsing.
