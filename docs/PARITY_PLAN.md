# Faraday → Parity Plan (RN rebuild of the BangSoal mobile app)

> **Goal:** bring `faraday` (React Native) to feature parity with the existing apps.
> **UI source of truth:** `../curie` (the previous Flutter mobile app — we are *refactoring* it, so mirror its screens/widgets 1:1 wherever they exist).
> **Feature source of truth for what curie never built:** `../lagrange` (tryout session) and `../dijkstra` (everything else).
>
> **Pace:** one phase at a time. Each phase is independently shippable and ends with a working, testable state. Do not start a phase until the previous one is merged.

---

## Goals

1. **Full feature parity with the current websites.** Every feature live in `dijkstra` (auth, dashboard, latihan soal timed + untimed, leaderboard, langganan, bang-catatan, profile, referral) and `lagrange` (the full tryout session) must exist in the app. The websites are the definition of "done" for *what* ships; `curie` is the reference for *how it looks* on mobile. Nothing in the parity matrix stays 🔴.

2. **Keep the app size as low as possible.** Install size is a first-class constraint, not an afterthought — treat it as a budget reviewed every phase. Rules of thumb:
   - **Add a dependency only when it clearly beats hand-rolling it.** Prefer small, focused libraries; reject anything that pulls a large transitive tree. Check the cost (e.g. bundle-size impact) before adding.
   - **Avoid duplicate libraries that do the same job** (one date lib, one icon set, one bottom-sheet, etc.).
   - **Lean on what's already in.** `react-native-svg` is installed → prefer it over new graphics deps; reuse `lucide-react-native` rather than adding another icon pack.
   - **LaTeX (Phase 2) weighs on this:** the WebView+`mathpix-markdown-it` path bundles a large JS payload; the `react-native-mathjax-html-to-svg` path reuses `react-native-svg`. Weigh size alongside fidelity/perf when choosing.
   - **Assets:** compress images, ship a single density where possible, avoid bundling fonts/icons that aren't used. Keep large/remote content (question images, etc.) server-fetched, not bundled.
   - **Native config:** keep Hermes on; enable Android R8/Proguard shrinking + resource shrinking + ABI splits / App Bundle; enable iOS bitcode-free app thinning. Drop unused native modules and locales.
   - **Track it:** record the APK/IPA size after each phase so regressions are visible; investigate any jump.

---

## Reference map (Flutter → React Native)

| curie (Flutter) | faraday (React Native) | Notes |
|---|---|---|
| `go_router` | `@react-navigation/native` + native-stack + bottom-tabs | Replaces manual `useState` navigator |
| `flutter_bloc` / `Cubit` (server calls) | `@tanstack/react-query` | Server state, caching, mutations |
| `Cubit` (auth/session/client state) | `zustand` | Lightweight global store |
| `dio` | typed `fetch` wrapper (`src/lib/api/client.ts`) | Same base URL + interceptors |
| `get_it` / `injectable` (DI) | plain module imports | No DI container needed |
| `shared_preferences` | `@react-native-async-storage/async-storage` | Non-secret cache |
| (token storage) | `react-native-keychain` | Secure token storage |
| `firebase_auth` + `google_sign_in` | `@react-native-firebase/auth` + `@react-native-google-signin/google-signin` | Google OAuth only |
| `midtrans_sdk` | Midtrans **Snap via `react-native-webview`** | No solid native RN SDK; use Snap redirect URL |
| `flutter_tex` (KaTeX) | **TBD in Phase 2** — `mathpix-markdown-it` in WebView *or* `react-native-mathjax-html-to-svg` | Web apps use `mathpix-markdown-it` |
| `GoogleFonts.quicksand` | bundled `Quicksand.ttf` (already in `src/assets/fonts`) | ✅ done |

## Backend (from curie `lib/core/constants/endpoints.dart`)

Base: `https://api-dev.bangsoal.co.id/api`

| Purpose | Endpoint |
|---|---|
| Login (email) | `POST /auth/login-email` |
| Send email OTP | `POST /auth/mail-verification` |
| Verify email OTP | `POST /auth/verify-mail` |
| PTN list | `GET /ptn` |
| Onboarding submit | `POST /users/onboarding` |
| Profile | `GET /users/profile` |
| Subjects | `GET /subjects` |
| Topics | `GET /subjects/topics` |
| Latihan soal | `GET /latihan-soal` |
| Referral | `/referral` |
| Payment (Snap) | `POST /payment/snap` |

> Tryout endpoints are **not** in curie — pull the contract from `lagrange` (`/tryouts/...`) when we reach Phase 12.

---

## Status legend
`[ ]` not started · `[~]` in progress · `[x]` done

---

# PHASE 0 — Foundation & tooling
**Goal:** install the libraries every later phase depends on. No user-facing change.
**curie ref:** `pubspec.yaml`, `lib/core/client/`, `lib/main.dart`

- [ ] Add deps: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context` (already present)
- [ ] Add deps: `@tanstack/react-query`, `zustand`
- [ ] Add deps: `@react-native-async-storage/async-storage`, `react-native-keychain`
- [ ] Add dep: `react-native-config` (or use `.env` already present) for `API_BASE_URL`
- [ ] `pod install` for iOS; verify Android + iOS still build
- [ ] Set up `QueryClientProvider` in `src/app/providers/AppProviders.tsx`
- [ ] Add `src/lib/`, `src/app/store/`, `src/features/*/api`, `src/types/` (dirs exist but empty)

**Done when:** app boots unchanged with all providers mounted; both platforms build clean.

---

# PHASE 1 — Design system parity
**Goal:** port curie's exact design tokens so every screen matches the Flutter app.
**curie ref:** `lib/core/themes/base_colors.dart`, `font_theme.dart`, `base_shadows.dart`

- [ ] Extend `src/theme/colors.ts` to full curie palette (primary 50–950 ✅, slate 50–950, gray, white/black). Match hex exactly.
- [ ] Port the **Quicksand type ramp** into `src/theme/typography.ts` as a `text` object: `h1`–`h6` (32/28/24/20/18/16) × weights (regular/medium/semiBold/bold), plus `base`/`sm`/`xs`. Use curie's `height: 1.2`, `letterSpacing: -0.1`.
- [ ] Port `BaseShadows` (`md`, `xl`) into `src/theme/shadows.ts` as RN `boxShadow` strings.
- [ ] Refactor existing components (`BangSoalButton`, `BangSoalTextField`, `SelectSheet`) to consume the ramp instead of hardcoded sizes.
- [ ] Audit existing 3 components against curie's `lib/core/bases/presentation/widgets/` (button variants, textfield, snackbar).
- [ ] Add `BangSoalSnackbar`/toast equivalent (curie has variants: success/error/info).
- [ ] Add `Shimmer` loading component (curie uses it everywhere).

**Done when:** a shared `theme.text.*`, `theme.colors.*`, `theme.shadows.*` API exists and the 3 current screens render via it.

---

# PHASE 2 — LaTeX rendering (cross-cutting dependency)
**Goal:** decide + build the math renderer. **Everything question-related blocks on this**, so do it before Latihan/Tryout.
**curie ref:** `lib/core/bases/presentation/widgets/latex/latex_renderer.dart` + `markdown_latex.dart`

- [ ] Prototype A: `react-native-webview` + `mathpix-markdown-it` (matches `lagrange`/`dijkstra` web exactly — highest fidelity for markdown + `$...$`/`$$...$$`).
- [ ] Prototype B: `react-native-mathjax-html-to-svg` (no WebView; reuses `react-native-svg` already installed).
- [ ] Test both against **real soal data** (pull a few questions from `/latihan-soal`) including chemistry (`mhchem`) if used.
- [ ] Measure: render speed in a scrolling list of 20+ questions (this was the Flutter `flutter_tex` "wall").
- [ ] Pick one. Build `src/components/Latex/Latex.tsx` + `MarkdownLatex.tsx` mirroring curie's API: `{ stringData, textColor, fontSize }`.

**Done when:** `<Latex stringData={...} />` renders inline + block math correctly and scrolls smoothly in a list.

---

# PHASE 3 — Data layer & API client
**Goal:** typed HTTP + auth-token plumbing + error handling.
**curie ref:** `lib/core/client/dio.dart`, `lib/core/constants/endpoints.dart`, `lib/core/errors/`

- [ ] `src/lib/api/client.ts`: fetch wrapper with base URL from env, JSON handling, auth header injection, 401 handling.
- [ ] `src/lib/api/endpoints.ts`: port the endpoints table above.
- [ ] `src/lib/storage/`: keychain (tokens) + async-storage (cache) helpers.
- [ ] `src/app/store/authStore.ts` (zustand): `token`, `user`, `isAuthenticated`, `signIn()`, `signOut()`, hydrate-on-boot.
- [ ] React Query default options (retry, staleTime) + error → toast mapping.
- [ ] `src/types/api.ts`: shared response envelope types.

**Done when:** an authenticated GET (e.g. `/users/profile`) works end-to-end with token from keychain, and a 401 clears session.

---

# PHASE 4 — Navigation skeleton
**Goal:** real navigation replacing the `useState` switch.
**curie ref:** `lib/app.dart` (go_router), `lib/features/main/` (MainPage bottom nav + Wrapper)

- [ ] Replace `AppNavigator.tsx` with React Navigation.
- [ ] **Auth stack:** intro → signIn → signUp → otp → onboarding (mirror current screens).
- [ ] **Main tab navigator** (curie `MainPage` bottom nav): Belajar / Dashboard / Sosial / Profile (match curie's tabs + icons).
- [ ] **Root `Wrapper`:** boot → hydrate auth → branch to Auth stack or Main tabs (mirror curie `Wrapper` + `UserInitializationCubit`).
- [ ] Splash screen (curie `SplashScreen`).
- [ ] No-internet fallback (curie `NoInternetPage`).

**Done when:** logged-out users land on intro; logged-in users land on the tab shell; back/deep nav works.

---

# PHASE 5 — Auth wiring (email)
**Goal:** make the existing auth UI real.
**curie ref:** `lib/features/auth/` (SignInPage, SignUpPage, SignUpOTPPage), `AuthCubit`

- [ ] `features/auth/api/`: `loginEmail`, `sendMailOtp`, `verifyMail`.
- [ ] Wire `SignInScreen` → `POST /auth/login-email` → store token → go to Main.
- [ ] Wire `SignUpScreen` → `POST /auth/mail-verification` (send OTP).
- [ ] Wire `SignUpOtpScreen` → `POST /auth/verify-mail`; real resend cooldown.
- [ ] Loading states, server error display, keyboard handling.

**Done when:** a real account can log in and persist across app restarts.

---

# PHASE 6 — Google OAuth
**Goal:** enable the "Gunakan email Google" button (currently shows "belum aktif").
**curie ref:** `AuthCubit` Google flow

- [ ] Add `@react-native-firebase/app` + `auth` + `@react-native-google-signin/google-signin`.
- [ ] iOS: GoogleService-Info.plist + URL scheme; Android: google-services.json + SHA-1.
- [ ] Wire `GoogleAuthButton` → Google sign-in → exchange with backend → session.

**Done when:** Google sign-in produces an authenticated session on both platforms.

---

# PHASE 7 — Onboarding submit
**Goal:** persist profile + PTN choices.
**curie ref:** `lib/features/auth/` OnboardingPage, `OnboardingBloc`

- [ ] `features/onboarding/api/`: `getPtnList` (`GET /ptn`), `submitOnboarding` (`POST /users/onboarding`).
- [ ] Replace static `data.ts` PTN list with `/ptn` (React Query). Keep `SelectSheet` UI.
- [ ] Wire `ProfileOnboardingScreen` "Lanjut" → submit → go to Main.
- [ ] Validation + server errors.

**Done when:** onboarding writes to backend and routes into the app.

---

# PHASE 8 — Dashboard / Home
**Goal:** the post-login landing tab.
**curie ref:** `lib/features/dashboard/` (note: curie dashboard is a **stub**) → enrich using `dijkstra` `/dashboard` (stats, topic cards, history).

- [ ] Build dashboard tab: greeting, subscription status, quick links to Belajar/Tryout.
- [ ] Topic/progress stats cards (from dijkstra UX; back with `/users/profile` + stats endpoints).
- [ ] Empty/loading/error states with shimmer.

**Done when:** logged-in users see a real home tab with live data.

---

# PHASE 9 — Latihan Soal Reguler (practice questions)
**Goal:** the core learning loop — first real content feature. Heavily mirrors curie.
**curie ref:** `lib/features/belajar/latihan-soal/` (LatihanRegulerPage, QuestionDetailContainer, ChoiceBox, options)

- [ ] Subject → topic → year-range selection (curie launch params: subjectId, topicId, minYear, maxYear).
- [ ] `features/latihan/api/`: question list, question detail, attempt, submit attempt (`/latihan-soal`, `/subjects`, `/subjects/topics`).
- [ ] Question detail screen: `<Latex>` content + asset image + A–E `ChoiceBox` options (mirror curie styling).
- [ ] Select option → create attempt → submit → record.
- [ ] Question navigator bottom sheet (curie `LatihanNavBottomSheet`).
- [ ] Prev/next navigation, current-question indicator, empty state.

**Done when:** a user can pick a topic, answer questions, and submit attempts against the backend.

---

# PHASE 10 — Pembahasan (explanations) + feedback
**Goal:** post-answer explanation with the like/dislike feedback loop.
**curie ref:** `pembahasan/pembahasan_container.dart`, `QuestionFeedback`

- [ ] Pembahasan view after submit: correct answer + `<Latex>` explanation, user choice highlighted, isCorrect.
- [ ] Like/dislike + optional text feedback; create/update feedback.
- [ ] `features/latihan/api/`: getPembahasan, submit/update/get feedback.

**Done when:** explanations render with math and feedback round-trips to backend.

---

# PHASE 11 — Profile
**Goal:** account tab.
**curie ref:** `lib/features/profile/` (ProfileCard, UserPtnChoices, ReferralCard, ProfilePageBloc)

- [ ] Profile screen: name, email, avatar, subscription/package status, transaction history.
- [ ] Edit profile (`POST/PUT /users/profile`).
- [ ] PTN choices view + edit (reuse `SelectSheet`).
- [ ] Referral code display + copy/share.
- [ ] Logout (clear keychain + reset to intro).

**Done when:** profile shows live data and edits persist.

---

# PHASE 12 — Payment / Langganan
**Goal:** subscriptions.
**curie ref:** `lib/features/payment/` (LanggananCarousel, plan cards, ReferralForm, PaymentBloc)

- [ ] Plans carousel (Pemula / Setia / Ambis) with pricing + discount badges.
- [ ] Referral code check (discount preview).
- [ ] Purchase → `POST /payment/snap` → open Snap redirect URL in `react-native-webview` → handle success/failure callback.
- [ ] Reflect new subscription in profile/dashboard.

**Done when:** a test purchase completes via Midtrans Snap and updates entitlement.

---

# PHASE 13 — Latihan Soal Timed
**Goal:** timed practice (curie left this **unimplemented**).
**ref:** `dijkstra` `/latihan-soal-timed` (classic + sequential) — adapt web UX to mobile.

- [ ] Mode select: Classic (any order) vs Sequential (one-at-a-time).
- [ ] Countdown timer, progress bar (answered/unanswered/skipped), auto-submit on timeout.
- [ ] Session review after completion (score, per-question correctness, explanations).

**Done when:** both timed modes run start→submit→review on device.

---

# PHASE 14 — Leaderboard
**Goal:** ranking/points (curie **never built** this).
**ref:** `dijkstra` `/leaderboard`.

- [ ] Podium (top 3) + top-100 list + "my rank" card.
- [ ] Period/subject filters if present.

**Done when:** leaderboard renders live ranking data.

---

# PHASE 15 — Tryout (the big one)
**Goal:** full tryout session. **No curie precedent** — port from `lagrange` and split into sub-phases. Do NOT attempt in one PR.
**ref:** `lagrange` `/(base)/tryout/...` + `src/components/tryout/*` + `/tryouts/...` API.

### 15a — Browse & registration
- [ ] Tryout list + preview (sets, duration, question counts, free badge).
- [ ] Registration screen + `useStartTryoutMutation` equivalent.

### 15b — Session shell + state
- [ ] `TryoutProvider`-equivalent (zustand): current set/question, answers, flags.
- [ ] Per-set timer with auto-submit (lagrange `TryoutSetTimer`, `end_time` from server).
- [ ] Question palette grid + flag (color states: unanswered/answered/flagged/current).

### 15c — Question types (each is its own task)
- [ ] Multiple choice (`MultipleChoiceQuestionDetail`)
- [ ] Multiple answer (`MultipleAnswerDetail`)
- [ ] Fill-in / isian (`FilledInQuestionDetail`, `[[FILL]]` tokens)
- [ ] True/False table (`TableChoiceOptions`)
- [ ] All with `<Latex>` rendering + auto-save per answer.

### 15d — Flow control + modals
- [ ] Break screen between sets (`/istirahat`).
- [ ] Modals: start, submit, next-set, time-up, finished (5 states).

### 15e — Results & review
- [ ] Result modal: pie (benar/salah/kosong), per-set breakdown.
- [ ] History/review: read-only question review, per-question analytics (difficulty, % correct, answer distribution), pembahasan.

**Done when:** a full tryout can be taken end-to-end and reviewed, matching lagrange behavior.

---

# PHASE 16 — Remaining + polish
**Goal:** close the long tail.
**ref:** `dijkstra` (catatan, notifications).

- [ ] Bang Catatan (notes): browse + upload.
- [ ] Notifications.
- [ ] Forgot/reset password (dijkstra 4-step).
- [ ] No-internet / offline polish, error boundaries, analytics (Mixpanel parity), Sentry.
- [ ] Accessibility + haptics pass.

**Done when:** no remaining 🔴 in the parity matrix.

---

## Sequencing notes
- **Phases 0–4** are pure foundation — they unlock everything and have no parity reference to "match," so move through them deliberately but quickly.
- **Phase 2 (LaTeX) is deferred to immediately before Phase 9** (its first consumer). Rationale: LaTeX only renders inside question content (latihan/tryout), so there's no reason to add its weight or lock the renderer choice until then — and deferring lets us measure its real app-size impact at integration time (per the size goal). Do the structural phases (navigation, dashboard, profile, etc.) first.
- **Phases 5–12** mostly *mirror curie 1:1* → fastest parity wins, copy the Flutter UI.
- **Phases 13–15** have *no curie UI* → design from lagrange/dijkstra web, adapt to mobile; expect these to take the longest.
- Ship each phase behind its own PR with the "Done when" as the acceptance check.
