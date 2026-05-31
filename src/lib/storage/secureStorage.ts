/** Secure storage for the auth bearer token (react-native-keychain). */
import * as Keychain from 'react-native-keychain';

const SERVICE = 'bangsoal.auth.token';

export async function saveToken(token: string): Promise<void> {
  try {
    await Keychain.setGenericPassword('token', token, {service: SERVICE});
  } catch (err) {
    // Native module missing (stale build) or keychain unavailable. Don't crash;
    // the session just won't persist until the app is rebuilt.
    console.warn('[secureStorage] saveToken failed', err);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const result = await Keychain.getGenericPassword({service: SERVICE});
    return result ? result.password : null;
  } catch (err) {
    console.warn('[secureStorage] getToken failed', err);
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({service: SERVICE});
  } catch (err) {
    console.warn('[secureStorage] clearToken failed', err);
  }
}
