/** Shared API types mirroring the newton backend contract. */

/**
 * User as returned by the auth endpoints (`verify-mail`, `login-email`) and
 * profile. Most fields are null until onboarding completes. `onboard_date` is
 * the routing flag: null = not onboarded, ISO timestamp = onboarded.
 */
export type User = {
  id?: string;
  email: string | null;
  full_name: string | null;
  highschool: string | null;
  highschool_year: string | null;
  choosen_university_one: string | null;
  choosen_major_one: string | null;
  choosen_university_two: string | null;
  choosen_major_two: string | null;
  choosen_university_three: string | null;
  choosen_major_three: string | null;
  phone_number: string | null;
  onboard_date: string | null;
  // auth responses use `profile_picture`; profile uses `profile_img`
  profile_picture?: string | null;
  profile_img?: string | null;
  referral_code?: string | null;
  source?: string | null;
};

/** Shape returned by `verify-mail` and `login-email`. */
export type AuthResponse = {
  token: string;
  user: User;
};
