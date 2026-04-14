# TSX Component Structure Guide

Use this section order in all `*.tsx` files when writing component bodies.

```tsx
const ExampleComponent: React.FC = () => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return <div />;
};
```

## Rules

1. Keep sections in this exact order:
   1. `//* States`
   2. `//* Custom hooks`
   3. `//* Refs`
   4. `//* Helper functions`
   5. `//* Life cycle hooks`
   6. `//* Handlers`
   7. `//* JSX`
2. If a section is not used yet, keep the section marker as an empty placeholder.
3. `return (...)` must always be under `//* JSX`.
4. Place `useEffect` and similar React lifecycle hooks only under `//* Life cycle hooks`.
5. Put event callbacks like `handleSubmit`, `onClick` wrappers, and navigation handlers under `//* Handlers`.

## Scope

This guide applies to all frontend TSX files under:

- `apps/frontend/src/app`
- `apps/frontend/src/features`
- `apps/frontend/src/shared`
