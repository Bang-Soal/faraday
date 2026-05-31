# Faraday Agent Guide

Faraday is the BangSoal React Native mobile app. Keep the app organized by feature and keep `App.tsx` thin.

## Structure

- `App.tsx`: entry only. Mount providers and app navigation here.
- `src/app/navigation`: route types and navigators.
- `src/app/providers`: app-wide providers and global setup.
- `src/app/store`: global state only when it is truly cross-feature.
- `src/features/<domain>`: feature screens, feature-only components, hooks, API calls, and types.
- `src/components`: shared dumb UI components reused across features.
- `src/theme`: colors, typography, spacing, fonts.
- `src/utils`: pure helper functions.
- `src/constants`: app-wide config/constants.
- `src/assets`: static images and fonts.

## Rules

- Do not put feature UI, form state, or business logic in `App.tsx`.
- Prefer shared components only when they are reused or clearly generic.
- Keep feature-specific UI inside the feature folder.
- Keep API calls out of screens. Put them in `features/<domain>/api` or `src/lib`.
- Keep validation and formatting helpers pure and testable in `src/utils`.
- Use Quicksand from `src/theme/typography.ts` for BangSoal UI.
- Use `lucide-react-native` for icons when a matching icon exists.
- When adding native dependencies, run `pod install` in `ios/` and rebuild the native app.

## Verification

Before handing off meaningful code changes, run:

```sh
pnpm lint
pnpm test --watch=false
```

For native dependency, icon, font, splash, or app metadata changes, also rebuild the relevant native app.
