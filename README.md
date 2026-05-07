# eslint-plugin-react-hooks@7.1.1 — Inconsistent rule reporting based on `memo` wrapper syntax

## Bug description

`eslint-plugin-react-hooks@7.1.1` does not report `react-hooks/refs` or
`react-hooks/set-state-in-effect` violations when a component function is
defined inline inside a `memo()` call, but it **does** report those same
violations when the function is defined separately and `memo` is applied on
export. The two component definitions are functionally identical.

## Rules affected

- `react-hooks/refs`
- `react-hooks/set-state-in-effect`

## To reproduce

```sh
npm install
npm run lint
```

## Expected output

Both files should produce the same lint errors (or neither should), because
the runtime behavior is identical. The `memo` call is an optimization wrapper
and should not affect which rules apply to the component body.

## Actual output

```
/src/InlineMemo.jsx
  (no errors)

/src/SeparateMemo.jsx
  16:23  error  Cannot access refs during render          react-hooks/refs
  21:7   error  Avoid calling setState() directly within  react-hooks/set-state-in-effect
                an effect
```

## Files

| File | Syntax | Lint result |
|------|--------|-------------|
| `src/InlineMemo.jsx` | `const Comp = memo(function Comp() { ... })` | No errors (bug — violations are missed) |
| `src/SeparateMemo.jsx` | `function Comp() { ... }` + `export default memo(Comp)` | 2 errors (correct) |

## Root cause hypothesis

The plugin likely uses pattern matching to identify component boundaries. When
a function is defined inside `memo(function Comp() {...})`, the plugin may not
recognize the inner function as a component entry point for the purposes of
these rules, causing the analysis to be skipped entirely.

## Impact

Teams migrating to `eslint-plugin-react-hooks@7.1.1` that use the inline-memo
pattern will silently miss rule violations. Additionally, mechanically
refactoring from the inline form to the separate form (e.g., to satisfy a
`react-compiler` lint rule or code style preference) will cause new lint errors
to appear on code that was previously clean — even though no functional change
was made.

## Environment

- `eslint-plugin-react-hooks`: 7.1.1
- `eslint`: 9.x
- `react`: 18.x
