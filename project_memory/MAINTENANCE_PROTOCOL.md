# Maintenance Protocol

**CRITICAL RULE**: ALL changes to the codebase, database, or business logic MUST be immediately reflected in this `project_memory` directory.

## When to Update
1.  **New Feature**: Update `features.md` with the new logic and `roadmap.md` to mark it as complete.
2.  **Database Change**: Update `database.md` with new tables, columns, or relationships.
3.  **Architecture Change**: Update `architecture.md` if the folder structure or core tech stack changes.
4.  **New Rule**: Update `conventions.md`.

## How to Update
-   **Do not** delete old context unless it is strictly obsolete.
-   **Do** append new information or modify existing sections to reflect the *current* state of truth.
-   **Commit**: Ensure these `.md` files are committed alongside the code changes.

## AI Instructions
If you are an AI assistant working on this project:
1.  **Read** these memory files before starting work to understand the full context.
2.  **Execute** your coding task.
3.  **Update** the relevant memory files in the same turn/pr before finishing the task.
