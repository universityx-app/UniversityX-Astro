export const AI_COHORT_PATH =
  '/cohort/build-and-ship-ai-applications-with-python/';

export const AI_COHORT_ENROLLMENT_PATH = `${AI_COHORT_PATH}enrollment/`;

export const AI_COHORT_SCHOLARSHIP_PATH = `${AI_COHORT_PATH}scholarship/`;

export type PaymentOption = 'full' | 'installment';

export interface CohortOffer {
  slug: string;
  title: string;
  shortTitle: string;
  durationWeeks: number;
  startDate: string;
  startDateLabel: string;
  capacity: number;
  prerequisite: string;
  originalPrice: number;
  fullPaymentPrice: number;
  installmentAmount: number;
  installmentCount: number;
  installmentTotal: number;
  fullPaymentSaving: number;
  promiseDeadline: string;
  promiseDeadlineLabel: string;
}

export const aiCohort: CohortOffer = {
  slug: 'build-and-ship-ai-applications-with-python',
  title: 'Build and Ship AI Applications with Python in 6 Weeks',
  shortTitle: 'Build and Ship AI Applications with Python',
  durationWeeks: 6,
  startDate: '2026-10-03',
  startDateLabel: '3 October 2026',
  capacity: 30,
  prerequisite: 'Basic Python',
  originalPrice: 25_000,
  fullPaymentPrice: 20_000,
  installmentAmount: 10_500,
  installmentCount: 2,
  installmentTotal: 21_000,
  fullPaymentSaving: 1_000,
  promiseDeadline: '2026-10-16T23:59:00+01:00',
  promiseDeadlineLabel: '16 October 2026 at 11:59 PM WAT',
};

export const formatNaira = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export function validPaystackPaymentPage(value: string | undefined): string {
  if (!value) return '';

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const paystackDomains = ['paystack.com', 'paystack.shop'];
    const isPaystackHost = paystackDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
    return url.protocol === 'https:' && isPaystackHost ? url.toString() : '';
  } catch {
    return '';
  }
}

export const paystackPaymentPages: Record<PaymentOption, string> = {
  full: validPaystackPaymentPage(
    import.meta.env.PUBLIC_PAYSTACK_FULL_PAYMENT_URL || 'https://paystack.shop/pay/ai-cohort-full',
  ),
  installment: validPaystackPaymentPage(
    import.meta.env.PUBLIC_PAYSTACK_INSTALLMENT_PAYMENT_URL || 'https://paystack.shop/pay/ai-cohort-part',
  ),
};
