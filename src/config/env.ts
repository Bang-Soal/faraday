/**
 * App configuration.
 *
 * React Native does not read `.env` at runtime yet (see `.env.example`). For now
 * these are plain constants. When we adopt `react-native-config`, swap the
 * right-hand values for `Config.PUBLIC_API_URL` etc. and keep these names — they
 * are the app-side contract.
 */

// newton backend base, including the `/api` prefix. Matches `.env` PUBLIC_API_URL.
// Local newton runs on http://localhost:8080/api (works on the iOS simulator).
// Android emulator: use http://10.0.2.2:8080/api. Remote dev: https://api-dev.bangsoal.co.id/api.
export const API_BASE_URL = 'http://localhost:8080/api';
