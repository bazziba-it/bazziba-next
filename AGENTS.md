# Project Context

**Project:** bazziba-rebuild
**Goal:** Rebuild bazziba.it video platform as a modern Next.js app with glass UI, neon cyan (#00f2ff) accent on deep navy (#050a14), matching the WhatsApp screenshot designs exactly.
**Status:** active

## Stop Condition

The project should stop when: Production-ready Next.js app deployed to Vercel with all core pages (home, browse, watch, upload, profile) implemented and visually matching the reference screenshots.
If the stop condition appears to be met, the leader should raise a motion for the team to vote on whether to stop.

**Heartbeat Member:** leader (woken every 15 min)

## Team Members

| Profile Name | Role | Responsibilities |
|---|---|---|
| leader (heartbeat) | leader — Team Leader | Project management, discussion chair, heartbeat, task dispatch |
| architect | architect — Architect | System design, API contracts, technology selection, trade-off analysis |
| developer | developer — Developer | Implementation, bug fixes, refactoring, dependency management |
| reviewer | reviewer — Reviewer | Code review, security review, spec conformance, edge cases |
| tester | tester — Tester | Test strategy, automated tests, bug verification, regression coverage |
| devops | devops — DevOps | CI/CD, containerization, deployment, monitoring, infrastructure |

Assign tasks by role name (e.g. `assignee='developer'`). The system routes to the correct worker automatically.

## Kanban Summary

- Triage: 0 | Todo: 0 | Ready (queued): 0 | Running: 0 | Blocked: 0 | In review: 0 | Done: 0

**Last heartbeat:** 2026-11-05T04:01:24.185377+00:00

## Workflow

1. Check your assigned tasks with `agora_project_status` or `hermes kanban list`.
2. Use `kanban show <task_id>` to read task details.
3. **Developer:** after completing a task, if your team has a `reviewer`,
   use `kanban_request_review(task_id, summary="...")` to submit for code
   review (summary describes what was implemented + how it was verified).
   The reviewer is auto-spawned. If the reviewer requests changes, fix the
   findings and re-submit. If no `reviewer` on team, use `kanban complete`.
4. **Reviewer:** approve with `kanban complete`; reject with
   `kanban_request_changes(task_id, reason="concrete findings")` — the
   task routes back to the implementer automatically.
5. **All other roles:** use `kanban complete <task_id>` when done.
6. If blocked, use `kanban block <task_id>` with a clear explanation.
7. For design decisions that need team input, use `agora_raise_motion`.
8. **Never** use Python, terminal, or direct DB calls to manage tasks/motions.
   Always use agora tools (`agora_raise_motion`, `agora_create_task`, etc.).
