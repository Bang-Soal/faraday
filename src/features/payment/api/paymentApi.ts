import {apiFetch} from '../../../lib/api/client';
import {
  PaymentSnapResponse,
  ReferralDetail,
  SubscriptionType,
} from '../../../types/api';

export function purchaseSubscription(params: {
  subscriptionType: SubscriptionType;
  referalCode?: string;
}) {
  return apiFetch<PaymentSnapResponse>('/payment/snap', {
    method: 'POST',
    body: {
      subscription_type: params.subscriptionType,
      referal_code: params.referalCode,
    },
  });
}

export function checkReferralCode(code: string) {
  return apiFetch<ReferralDetail>(`/referral/${encodeURIComponent(code)}`);
}
