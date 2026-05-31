import {apiFetch} from '../../../lib/api/client';
import {AuthResponse} from '../../../types/api';

/** POST /auth/mail-verification — sends a 6-digit OTP to the email. */
export function sendMailOtp(email: string): Promise<string> {
  return apiFetch<string>('/auth/mail-verification', {
    method: 'POST',
    body: {email},
    auth: false,
  });
}

/** POST /auth/verify-mail — verifies OTP, creates/returns the user + token. */
export function verifyMail(email: string, otp: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/verify-mail', {
    method: 'POST',
    body: {email, otp},
    auth: false,
  });
}

/** POST /auth/login-email — password login, returns user + token. */
export function loginEmail(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login-email', {
    method: 'POST',
    body: {email, password},
    auth: false,
  });
}
