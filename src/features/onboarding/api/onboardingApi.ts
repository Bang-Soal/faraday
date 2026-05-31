import {apiFetch} from '../../../lib/api/client';
import {User} from '../../../types/api';

export type Ptn = {
  name: string;
  href: string;
  prodi: string[];
};

/** GET /ptn — list of universities + their prodi (no auth). */
export function getPtnList(): Promise<Ptn[]> {
  return apiFetch<Ptn[]>('/ptn', {auth: false});
}

export type OnboardingPayload = {
  full_name: string;
  password: string;
  phone_number: string;
  highschool: string;
  highschool_year: string;
  source: string;
  email: string;
  choosen_university_one: string;
  choosen_major_one: string;
  choosen_university_two?: string;
  choosen_major_two?: string;
  choosen_university_three?: string;
  choosen_major_three?: string;
  referral_code?: string;
};

/** POST /users/onboarding — sets profile + password, marks onboard_date. */
export function submitOnboarding(payload: OnboardingPayload): Promise<User> {
  return apiFetch<User>('/users/onboarding', {
    method: 'POST',
    body: payload,
  });
}
