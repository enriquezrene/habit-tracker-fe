# TypeScript Strict Mode

**Always** use TypeScript strict mode in this project.

## Required tsconfig settings
- `"strict": true`
- `"noImplicitAny": true`
- `"strictNullChecks": true`

## When writing code
- Never use `any` — use `unknown` if type is truly unknown
- Always provide explicit return types for functions
- Handle null/undefined cases explicitly

## Verification
Before completing any task involving TypeScript:
- Run `npm run typecheck`
- Fix all type errors
- Do not suppress with `@ts-ignore` unless absolutely necessary (and document why)