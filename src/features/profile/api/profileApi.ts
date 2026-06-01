import {apiFetch} from '../../../lib/api/client';
import {ProfileResponse} from '../../../types/api';

export function getProfile() {
  return apiFetch<ProfileResponse>('/users/profile');
}
