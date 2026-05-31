/** Non-secret JSON cache (AsyncStorage), e.g. the cached user object. */
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[appStorage] setJSON failed', err);
  }
}

export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn('[appStorage] getJSON failed', err);
    return null;
  }
}

export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn('[appStorage] remove failed', err);
  }
}
